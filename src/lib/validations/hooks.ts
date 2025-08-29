// src/lib/validations/hooks.ts
// Hooks específicos para forms usando validações centralizadas

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  createPatientSchema, 
  createServiceSchema, 
  createAppointmentSchema,
  createReminderSchema 
} from './index'
import { z } from 'zod'

export function useCreatePatientForm(defaultValues?: any) {
  return useForm({
    resolver: zodResolver(createPatientSchema),
    defaultValues: defaultValues || {
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      dataNascimento: undefined,
      endereco: "",
      profissao: "",
      estadoCivil: undefined,
      contatoEmergencia: "",
      convenio: "",
      numeroConvenio: ""
    }
  })
}

export function useCreateServiceForm(defaultValues?: any) {
  return useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      price: 0,
      duration: 60,
      color: "#3b82f6"
    }
  })
}

export function useCreateAppointmentForm(defaultValues?: any) {
  return useForm({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      serviceId: "",
      appointmentDate: new Date(),
      time: ""
    }
  })
}

export function useCreateReminderForm(defaultValues?: any) {
  return useForm({
    resolver: zodResolver(createReminderSchema),
    defaultValues: defaultValues || {
      description: "",
      priority: "medium"
    }
  })
}

const createServiceSchemaForForm = z.object({
  name: z
    .string()
    .min(2, "Nome do serviço deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  price: z
    .number()
    .min(0, "Preço não pode ser negativo"),
  duration: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .max(480, "Duração máxima é 8 horas"),
})

export function useCreateServiceFormCorrect(options?: { defaultValues?: any }) {
  return useForm({
    resolver: zodResolver(createServiceSchemaForForm),
    defaultValues: options?.defaultValues || {
      name: "",
      price: 0,
      duration: 60
    }
  })
}