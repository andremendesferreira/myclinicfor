"use client"

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { validateCPF } from '@/app/utils/formatCPF'

export const appointmentSchema = z.object({
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
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export function useAppointmentForm() {
  return useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      phone: "",
      serviceId: "",
      date: new Date(),
    }
  })
}