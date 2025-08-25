// src/lib/validations/index.ts
// ✅ VERSÃO LIMPA (sem imports React Hook Form)

import { z } from 'zod'

// ===============================================
// 🛠️ VALIDADORES BASE E UTILITIES
// ===============================================

// Validador de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCpf = cpf.replace(/\D/g, '')
  
  if (cleanCpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false // CPFs com dígitos iguais
  
  const calculateDigit = (cpf: string, factor: number): number => {
    const sum = cpf
      .slice(0, factor - 1)
      .split('')
      .reduce((acc, digit, index) => acc + parseInt(digit) * (factor - index), 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }
  
  const digit1 = calculateDigit(cleanCpf, 10)
  const digit2 = calculateDigit(cleanCpf, 11)
  
  return cleanCpf.endsWith(`${digit1}${digit2}`)
}

// Validador de telefone brasileiro
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return /^[1-9]{2}[2-9]\d{7,8}$/.test(cleanPhone)
}

// Formatadores
export const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
  } else if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`
  }
  return phone
}

export const formatCPF = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, '')
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const capitalizeProperNames = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (['de', 'da', 'do', 'das', 'dos', 'e'].includes(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

// ===============================================
// 🔐 SCHEMAS BASE
// ===============================================

export const baseUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .transform(capitalizeProperNames),
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .optional()
    .refine(phone => !phone || validatePhone(phone), "Telefone inválido")
    .transform(phone => phone ? formatPhone(phone) : phone),
})

export const cpfSchema = z
  .string()
  .min(1, "CPF é obrigatório")
  .refine(validateCPF, "CPF inválido")
  .transform(cpf => cpf.replace(/\D/g, '')) // Armazena apenas números

export const phoneSchema = z
  .string()
  .min(1, "Telefone é obrigatório")
  .refine(validatePhone, "Telefone inválido")
  .transform(formatPhone)

// ===============================================
// 👨‍👩‍👦 PATIENT SCHEMAS
// ===============================================

export const createPatientSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .transform(capitalizeProperNames),
  cpf: cpfSchema,
  telefone: phoneSchema,
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  dataNascimento: z
    .date()
    .max(new Date(), "Data de nascimento não pode ser futura")
    .optional(),
  endereco: z.string().max(200, "Endereço muito longo").optional(),
  profissao: z.string().max(100, "Profissão muito longa").optional(),
  estadoCivil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel']).optional(),
  contatoEmergencia: phoneSchema.optional(),
  convenio: z.string().max(100, "Nome do convênio muito longo").optional(),
  numeroConvenio: z.string().max(50, "Número do convênio muito longo").optional(),
})

export const updatePatientSchema = createPatientSchema.partial().extend({
  id: z.string().uuid("ID do paciente inválido"),
})

export const searchPatientSchema = z.object({
  search: z.string().min(1, "Termo de busca é obrigatório"),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
})

// ===============================================
// 🩺 SERVICE SCHEMAS  
// ===============================================

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Nome do serviço deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  description: z
    .string()
    .max(500, "Descrição muito longa")
    .optional(),
  price: z
    .number()
    .min(0, "Preço não pode ser negativo")
    .int("Preço deve ser um número inteiro"),
  duration: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .max(480, "Duração máxima é 8 horas"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar em formato hexadecimal")
    .optional(),
})

export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().uuid("ID do serviço inválido"),
})

export const toggleServiceStatusSchema = z.object({
  serviceId: z.string().uuid("ID do serviço inválido"),
  status: z.boolean(),
})

// ===============================================
// 📅 APPOINTMENT SCHEMAS
// ===============================================

export const createAppointmentSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .transform(capitalizeProperNames),
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase(),
  phone: phoneSchema,
  cpf: cpfSchema,
  serviceId: z.string().uuid("Serviço inválido"),
  appointmentDate: z.date().min(new Date(), "Data deve ser futura"),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
})

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().uuid("ID do agendamento inválido"),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']),
})

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().uuid("ID do agendamento inválido"),
})

// ===============================================
// 🏥 CONSULTATION SCHEMAS
// ===============================================

export const createConsultationSchema = z.object({
  patientId: z.string().uuid("ID do paciente inválido"),
  serviceId: z.string().uuid("ID do serviço inválido"),
  consultationDate: z.date().optional(),
  anamnese: z.string().max(5000, "Anamnese muito longa").optional(),
  exameClinico: z.string().max(5000, "Exame clínico muito longo").optional(),
  diagnostico: z.string().max(2000, "Diagnóstico muito longo").optional(),
  conduta: z.string().max(2000, "Conduta muito longa").optional(),
  familyHistory: z.string().max(3000, "Histórico familiar muito longo").optional(),
  observations: z.string().max(2000, "Observações muito longas").optional(),
  valorCobrado: z
    .number()
    .min(0, "Valor não pode ser negativo")
    .int("Valor deve ser um número inteiro")
    .optional(),
  formaPagamento: z
    .enum(['dinheiro', 'cartao', 'pix', 'convenio'])
    .optional(),
})

export const updateConsultationSchema = createConsultationSchema.partial().extend({
  id: z.string().uuid("ID da consulta inválido"),
})

export const addConsultationImagesSchema = z.object({
  consultationId: z.string().uuid("ID da consulta inválido"),
  images: z.array(z.string().url("URL da imagem inválida")),
})

// ===============================================
// 🔔 REMINDER SCHEMAS
// ===============================================

export const createReminderSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição muito longa"),
  priority: z
    .enum(['low', 'medium', 'high'])
    .default('medium'),
})

export const updateReminderSchema = createReminderSchema.partial().extend({
  id: z.string().uuid("ID do lembrete inválido"),
  completed: z.boolean().optional(),
})

// ===============================================
// 👤 PROFILE SCHEMAS
// ===============================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .transform(capitalizeProperNames)
    .optional(),
  address: z
    .string()
    .max(200, "Endereço muito longo")
    .optional(),
  phone: phoneSchema.optional(),
  timeZone: z
    .string()
    .min(1, "Fuso horário é obrigatório")
    .optional(),
  activities: z
    .array(z.string())
    .max(20, "Máximo 20 atividades")
    .optional(),
  times: z
    .array(z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"))
    .max(48, "Máximo 48 horários por dia") // 30min slots in 24h
    .optional(),
})

export const updateAvatarSchema = z.object({
  image: z.string().url("URL da imagem inválida"),
})

// ===============================================
// 📊 QUERY/FILTER SCHEMAS
// ===============================================

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: "Data final deve ser posterior à data inicial",
  path: ["endDate"],
})

export const appointmentFiltersSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']).optional(),
  serviceId: z.string().uuid().optional(),
  dateRange: dateRangeSchema.optional(),
  search: z.string().min(1).optional(),
}).merge(paginationSchema)

// ===============================================
// 🔄 RESPONSE TYPE SCHEMAS
// ===============================================

export const actionResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  fieldErrors: z.record(z.array(z.string())).optional(),
})

// ===============================================
// 📤 EXPORT TYPES
// ===============================================

export type CreatePatientData = z.infer<typeof createPatientSchema>
export type UpdatePatientData = z.infer<typeof updatePatientSchema>
export type CreateServiceData = z.infer<typeof createServiceSchema>
export type UpdateServiceData = z.infer<typeof updateServiceSchema>
export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>
export type CreateConsultationData = z.infer<typeof createConsultationSchema>
export type UpdateConsultationData = z.infer<typeof updateConsultationSchema>
export type CreateReminderData = z.infer<typeof createReminderSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
export type ActionResponse<T = any> = z.infer<typeof actionResponseSchema> & { data?: T }

// ===============================================
// 🎨 UTILITY FUNCTIONS PARA FORMATAÇÃO
// ===============================================

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value / 100) // Assumindo que o valor está em centavos
}

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d]/g, '')
  return parseInt(cleaned) || 0
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// ===============================================
// 📊 SCHEMAS COMPLEMENTARES
// ===============================================

export const patientSearchSchema = z.object({
  query: z.string().min(1, "Digite algo para buscar"),
  filter: z.enum(['nome', 'cpf', 'email']).default('nome'),
  status: z.boolean().optional(),
})

export const appointmentStatusSchema = z.enum([
  'scheduled', 'completed', 'cancelled', 'no_show'
])

// ===============================================
// 📤 EXPORT ADDITIONAL TYPES
// ===============================================

export type PatientSearchData = z.infer<typeof patientSearchSchema>
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>