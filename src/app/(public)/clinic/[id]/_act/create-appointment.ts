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

    // ✅ NOVO: Buscar ou criar paciente automaticamente
    let patient = await prisma.patient.findUnique({
      where: { cpf: formData.cpf }
    })

    // Se o paciente não existe, criar automaticamente
    if (!patient) {
      try {
        patient = await prisma.patient.create({
          data: {
            nome: formData.name,
            cpf: formData.cpf,
            telefone: formData.phone,
            email: formData.email,
            userId: formData.clinicId
          }
        })
        console.log(`✅ Paciente criado automaticamente: ${patient.nome} (${patient.cpf})`)
      } catch (patientError: any) {
        // Se houver erro de email duplicado, tentar buscar por email
        if (patientError?.code === 'P2002' && patientError?.meta?.target?.includes('email')) {
          // Buscar paciente pelo email para usar o existente
          patient = await prisma.patient.findUnique({
            where: { email: formData.email }
          })
          
          if (!patient) {
            throw new Error('Erro ao criar paciente: email já cadastrado')
          }
        } else {
          throw patientError
        }
      }
    }

    // Criar dados do appointment
    const appointmentData = {
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.phone,
      time: formData.time,
      appointmentDate: appointmentDate,
      serviceId: formData.serviceId,
      userId: formData.clinicId,
      patientId: patient.id  // ✅ NOVO: Relacionamento com patient
    }
    
    const newAppointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true
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
    console.log('Erro ao criar appointment:', err);
    
    // Tratamento de erros específicos
    if (err instanceof Error) {
      if (err.message.includes('email já cadastrado')) {
        return { error: "Este email já está cadastrado para outro paciente" }
      }
      if (err.message.includes('Unique constraint')) {
        return { error: "Já existe um agendamento para este horário" }
      }
    }
    
    return {
      error: "Erro ao cadastrar agendamento"
    }
  }
}