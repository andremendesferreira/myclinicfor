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
  clinicId: z.string().min(1, "O horário é obrigatório"),
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

    const Data =  {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone,
        time: formData.time,
        appointmentDate: appointmentDate,
        serviceId: formData.serviceId,
        userId: formData.clinicId
      }
    
    const newAppointment = await prisma.appointment.create({
      data: Data
    })

    return {
      data: newAppointment
    }


  } catch (err) {
    console.log(err);
    return {
      error: "Erro ao cadastrar agendamento"
    }
  }


}