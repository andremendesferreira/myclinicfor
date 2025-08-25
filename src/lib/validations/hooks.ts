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