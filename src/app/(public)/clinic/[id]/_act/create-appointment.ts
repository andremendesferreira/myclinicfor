"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { validateCPF } from '@/app/utils/formatCPF' 

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  cpf: z.string()
    .min(1, "O CPF é obrigatório")
    .refine((cpf) => {
      // Remove formatação e verifica se tem pelo menos 11 dígitos
      const cleanCpf = cpf.replace(/\D/g, '');
      return cleanCpf.length === 11;
    }, "CPF deve ter 11 dígitos")
    .refine((cpf) => validateCPF(cpf), "CPF inválido"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
  time: z.string().min(1, "O horário é obrigatório"),
  clinicId: z.string().min(1, "A clínica é obrigatória"),
  // ✅ NOVOS CAMPOS OPCIONAIS
  endereco: z.string().optional(),
  dataNascimento: z.date().optional(), 
  convenio: z.string().optional()
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema) {

  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const selectedDate = new Date(formData.date)
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))

    // ✅ Buscar ou criar paciente automaticamente
    let patient = await prisma.patient.findUnique({
      where: { cpf: formData.cpf }
    })

    // Se o paciente não existe, criar automaticamente
    if (!patient) {
      try {
        // Preparar dados do patient (apenas campos que existem no schema)
        const patientData: any = {
          nome: formData.name,
          cpf: formData.cpf,
          telefone: formData.phone,
          email: formData.email,
          userId: formData.clinicId
        }

        // ✅ Adicionar campos opcionais apenas se fornecidos
        if (formData.endereco) {
          patientData.endereco = formData.endereco
        }

        // Nota: dataNascimento e convenio podem não existir no schema Patient ainda
        // Descomente se os campos existirem no schema:
        // if (formData.dataNascimento) {
        //   patientData.dataNascimento = formData.dataNascimento
        // }
        // if (formData.convenio) {
        //   patientData.convenio = formData.convenio
        // }

        patient = await prisma.patient.create({
          data: patientData
        })
        
        console.log(`Paciente criado automaticamente: ${patient.nome} (${patient.cpf})`)
        
      } catch (patientError: any) {
        // Tratamento de erro de unique constraint
        if (patientError?.code === 'P2002') {
          const target = patientError?.meta?.target || []
          
          if (target.includes('email')) {
            // Buscar paciente pelo email para usar o existente
            patient = await prisma.patient.findUnique({
              where: { email: formData.email }
            })
            
            if (!patient) {
              return { error: "Este email já está cadastrado para outro paciente" }
            }
            console.log(`Paciente encontrado por email: ${patient.nome}`)
          } 
          else if (target.includes('cpf')) {
            return { error: "Este CPF já está cadastrado" }
          }
          else {
            return { error: "Dados já cadastrados para outro paciente" }
          }
        } else {
          console.error('Erro ao criar patient:', patientError)
          return { error: "Erro ao processar dados do paciente" }
        }
      }
    } else {
      console.log(`Paciente existente encontrado: ${patient.nome}`)
    }

    // Verificar se patient foi criado/encontrado
    if (!patient) {
      return { error: "Erro ao processar dados do paciente" }
    }

    // ✅ Criar appointment com relacionamento
    const appointmentData = {
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.phone,
      time: formData.time,
      appointmentDate: appointmentDate,
      serviceId: formData.serviceId,
      userId: formData.clinicId,
      patientId: patient.id // ✅ Relacionamento automático
    }
    
    const newAppointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        }
      }
    })

    return {
      data: newAppointment
    }

  } catch (err) {
    console.error('Erro ao criar appointment:', err);
    
    // Tratamento de erros específicos
    if (err instanceof Error) {
      // Erro de agendamento duplicado
      if (err.message.includes('Unique constraint') || 
          (err as any)?.code === 'P2002') {
        return { error: "Já existe um agendamento para este horário" }
      }
      
      // Erro de serviço não encontrado
      if (err.message.includes('Foreign key constraint')) {
        return { error: "Serviço selecionado não está disponível" }
      }
    }
    
    return {
      error: "Erro interno. Tente novamente em alguns instantes."
    }
  }
}