// src/lib/validations/hooks.ts
// ================================================================
// 🎣 HOOKS DE VALIDAÇÃO CORRIGIDOS - MyClinicSOL
// ================================================================
// Versão corrigida que resolve erros TypeScript específicos

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'

// ✅ Importar dos schemas centralizados
import { 
  createPatientSchema, 
  createServiceSchema, 
  createAppointmentSchema,
  createReminderSchema,
  updateProfileSchema,
  createConsultationSchema,
  type CreatePatientData,
  type CreateServiceData,
  type CreateAppointmentData,
  type CreateReminderData,
  type UpdateProfileData,
  type CreateConsultationData,
  type ActionResponse
} from './index'

// ===============================================
// 🩺 PATIENT FORM HOOKS
// ===============================================

export function useCreatePatientForm(options?: { defaultValues?: Partial<CreatePatientData> }) {
  const defaultValues: CreatePatientData = {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    dataNascimento: undefined,
    endereco: "",
    convenio: "",
    ...options?.defaultValues
  } as CreatePatientData

  return useForm({
    resolver: zodResolver(createPatientSchema),
    defaultValues
  })
}

// ===============================================
// 🛠️ SERVICE FORM HOOKS - CORRIGIDO
// ===============================================

export function useCreateServiceForm(options?: { defaultValues?: Partial<CreateServiceData> }) {
  // ✅ CORREÇÃO: Definir defaultValues com tipo explícito
  const defaultValues: CreateServiceData = {
    name: "",
    description: "",
    price: 0,
    duration: 60,
    color: "#3b82f6", // ✅ CORREÇÃO: Sempre string, nunca undefined
    ...options?.defaultValues
  }

  return useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues
  })
}

// ===============================================
// 📅 APPOINTMENT FORM HOOKS - CORRIGIDO
// ===============================================

export function useCreateAppointmentForm(options?: { defaultValues?: Partial<CreateAppointmentData> }) {
  const defaultValues: CreateAppointmentData = {
    name: "",
    email: "",
    phone: "",
    cpf: "",
    serviceId: "",
    appointmentDate: new Date(),
    time: "",
    ...options?.defaultValues
  }

  return useForm({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues
  })
}

// ===============================================
// 🔔 REMINDER FORM HOOKS
// ===============================================

export function useCreateReminderForm(options?: { defaultValues?: Partial<CreateReminderData> }) {
  const defaultValues: CreateReminderData = {
    description: "",
    priority: "medium",
    ...options?.defaultValues
  }

  return useForm({
    resolver: zodResolver(createReminderSchema),
    defaultValues
  })
}

// ===============================================
// 👤 PROFILE FORM HOOKS
// ===============================================

export function useUpdateProfileForm(options?: { defaultValues?: Partial<UpdateProfileData> }) {
  const defaultValues = {
    name: "",
    address: "",
    phone: "",
    timeZone: "",
    activities: [],
    times: [],
    ...options?.defaultValues
  } as UpdateProfileData

  return useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues
  })
}

// ===============================================
// 🏥 CONSULTATION FORM HOOKS
// ===============================================

export function useCreateConsultationForm(options?: { defaultValues?: Partial<CreateConsultationData> }) {
  const defaultValues = {
    patientId: "",
    serviceId: "",
    consultationDate: new Date(),
    anamnese: "",
    exameClinico: "",
    diagnostico: "",
    conduta: "",
    familyHistory: "",
    observations: "",
    valorCobrado: undefined,
    formaPagamento: undefined,
    ...options?.defaultValues
  } as CreateConsultationData

  return useForm({
    resolver: zodResolver(createConsultationSchema),
    defaultValues
  })
}

// ===============================================
// 🔧 HOOK GENÉRICO PARA SERVER ACTIONS - CORRIGIDO
// ===============================================

interface UseServerActionOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  successMessage?: string
  errorMessage?: string
  showToasts?: boolean
}

/**
 * Hook genérico para executar server actions com tratamento de erro padronizado
 */
export function useServerAction<T = any, P = any>(
  action: (input: P) => Promise<ActionResponse<T>>,
  options: UseServerActionOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showToasts = true
  } = options

  const execute = useCallback(async (input: P) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await action(input)
      
      if (result.success) {
        setData(result.data || null)
        
        // ✅ CORREÇÃO: Verificar se data existe antes de chamar onSuccess
        if (onSuccess && result.data !== undefined) {
          onSuccess(result.data)
        }
        
        if (showToasts && successMessage) {
          toast.success(successMessage)
        }
        
        return result
      } else {
        const errorMsg = result.error || errorMessage || "Erro na operação"
        setError(errorMsg)
        
        if (onError) onError(errorMsg)
        
        if (showToasts) {
          // Mostrar erros específicos de campo se existirem
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              if (errors && errors[0]) {
                toast.error(`${field}: ${errors[0]}`)
              }
            })
          } else {
            toast.error(errorMsg)
          }
        }
        
        return result
      }
    } catch (err) {
      const errorMsg = errorMessage || "Erro inesperado"
      setError(errorMsg)
      
      if (onError) onError(errorMsg)
      
      if (showToasts) {
        toast.error(errorMsg)
      }
      
      return { success: false, error: errorMsg } as ActionResponse<T>
    } finally {
      setIsLoading(false)
    }
  }, [action, onSuccess, onError, successMessage, errorMessage, showToasts])

  const reset = useCallback(() => {
    setError(null)
    setData(null)
  }, [])

  return {
    execute,
    isLoading,
    error,
    data,
    reset
  }
}

// ===============================================
// 🔧 HOOKS UTILITÁRIOS PARA FORMATAÇÃO
// ===============================================

import { formatCPF, formatPhone } from './index'

/**
 * Hook para formatação automática de CPF em inputs
 */
export function useCPFFormatter() {
  return useCallback((value: string) => {
    return formatCPF(value)
  }, [])
}

/**
 * Hook para formatação automática de telefone em inputs
 */
export function usePhoneFormatter() {
  return useCallback((value: string) => {
    return formatPhone(value)
  }, [])
}

/**
 * Hook para formatação automática de moeda em inputs
 */
export function useCurrencyFormatter() {
  return useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }, [])
}