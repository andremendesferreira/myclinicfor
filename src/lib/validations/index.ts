// src/lib/validations/index.ts
// ================================================================
// 🛡️ VALIDAÇÕES CENTRALIZADAS - MyClinicSOL
// ================================================================
// Este arquivo centraliza todas as validações Zod do projeto
// Criado para resolver imports quebrados e padronizar validações

import { z } from 'zod'

// ===============================================
// 🛠️ UTILITIES & HELPERS
// ===============================================

/**
 * Valida CPF brasileiro
 * @param cpf - CPF em qualquer formato
 * @returns true se válido, false se inválido
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf) return false
  
  const cleanCpf = cpf.replace(/\D/g, '')
  
  if (cleanCpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false // 111.111.111-11
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false
  
  return true
}

/**
 * Formata CPF: 12345678901 → 123.456.789-01
 */
export function formatCPF(cpf: string): string {
  const cleanCpf = cpf.replace(/\D/g, '')
  if (cleanCpf.length === 11) {
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return cpf
}

/**
 * Formata telefone: 85999998888 → (85) 99999-8888
 */
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

/**
 * Capitaliza nomes próprios
 */
export function capitalizeProperNames(name: string): string {
  if (!name) return ''
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Preposições e artigos que ficam em minúscula
      const lowercase = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no']
      if (lowercase.includes(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// ===============================================
// 🔧 ZOD SCHEMAS REUTILIZÁVEIS
// ===============================================

const phoneSchema = z
  .string()
  .min(1, "Telefone é obrigatório")
  .refine(
    (val) => {
      const clean = val.replace(/\D/g, '')
      return clean.length >= 10 && clean.length <= 11
    },
    "Telefone deve ter 10 ou 11 dígitos"
  )

const cpfSchema = z
  .string()
  .min(1, "CPF é obrigatório")
  .transform(val => val.replace(/\D/g, ''))
  .refine(val => val.length === 11, "CPF deve ter 11 dígitos")
  .refine(validateCPF, "CPF inválido")

const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Email inválido")
  .toLowerCase()

const nameSchema = z
  .string()
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(100, "Nome muito longo")
  .transform(capitalizeProperNames)

// ===============================================
// 👥 PATIENT SCHEMAS
// ===============================================

export const createPatientSchema = z.object({
  nome: nameSchema,
  cpf: cpfSchema,
  telefone: phoneSchema,
  email: emailSchema,
  dataNascimento: z
    .date()
    .max(new Date(), "Data de nascimento deve ser no passado")
    .optional(),
  endereco: z
    .string()
    .max(200, "Endereço muito longo")
    .optional(),
  profissao: z
    .string()
    .max(100, "Profissão muito longa")
    .optional(),
  estadoCivil: z
    .enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel'])
    .optional(),
  contatoEmergencia: phoneSchema.optional(),
  convenio: z
    .string()
    .max(100, "Nome do convênio muito longo")
    .optional(),
  numeroConvenio: z
    .string()
    .max(50, "Número do convênio muito longo")
    .optional(),
})

export const updatePatientSchema = createPatientSchema.partial().extend({
  id: z.string().uuid("ID do paciente inválido"),
})

// ===============================================
// 🛠️ SERVICE SCHEMAS
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
    .max(999999, "Preço muito alto"),
  duration: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .max(480, "Duração máxima é 8 horas"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar em formato hexadecimal")
    .default("#3b82f6"),
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
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: phoneSchema,
  cpf: cpfSchema,
  serviceId: z.string().uuid("Serviço inválido"),
  appointmentDate: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  patientId: z.string().uuid().optional(), // ✅ NOVO campo opcional
  clinicId: z.string().cuid().optional() // Para appointments públicos
})

export const createAppointmentWithPatientSchema = z.object({
  patientId: z.string().uuid("ID do paciente inválido"),
  serviceId: z.string().uuid("Serviço inválido"),
  appointmentDate: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
})

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().uuid("ID do agendamento inválido"),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']),
})

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().uuid("ID do agendamento inválido"),
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
  name: nameSchema.optional(),
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
    .max(50, "Máximo 50 horários")
    .optional(),
})

export const updateAvatarSchema = z.object({
  image: z.string().url("URL da imagem inválida"),
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
    .optional(),
  formaPagamento: z
    .enum(['dinheiro', 'cartao', 'pix', 'convenio'])
    .optional(),
})

export const updateConsultationSchema = createConsultationSchema.partial().extend({
  id: z.string().uuid("ID da consulta inválido"),
})

// ===============================================
// 📊 TYPES PARA TYPESCRIPT
// ===============================================

export type CreatePatientData = z.infer<typeof createPatientSchema>
export type UpdatePatientData = z.infer<typeof updatePatientSchema>
export type CreateServiceData = z.infer<typeof createServiceSchema>
export type UpdateServiceData = z.infer<typeof updateServiceSchema>
export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>
export type CreateAppointmentWithPatientData = z.infer<typeof createAppointmentWithPatientSchema> // ✅ NOVO
export type CreateConsultationData = z.infer<typeof createConsultationSchema>
export type UpdateConsultationData = z.infer<typeof updateConsultationSchema>
export type CreateReminderData = z.infer<typeof createReminderSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>

// ===============================================
// 🔄 ACTION RESPONSE TYPE
// ===============================================

export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}