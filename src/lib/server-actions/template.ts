// src/lib/server-actions/template.ts
// Template padronizado para Server Actions - MyClinicSOL

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { ActionResponse } from '@/lib/validations'

// ===============================================
// 🛠️ UTILITIES E HELPERS
// ===============================================

/**
 * Logger estruturado para Server Actions
 */
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '')
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '')
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '')
    }
  }
}

/**
 * Wrapper para tratamento de erros padronizado
 */
export async function handleServerAction<T extends z.ZodSchema, R = any>(
  input: unknown,
  schema: T,
  handler: (validatedInput: z.infer<T>, userId: string) => Promise<R>,
  options?: {
    requireAuth?: boolean
    revalidatePaths?: string[]
    successMessage?: string
    errorMessage?: string
    redirectTo?: string
  }
): Promise<ActionResponse<R>> {
  const {
    requireAuth = true,
    revalidatePaths = [],
    successMessage,
    errorMessage = "Ocorreu um erro interno",
    redirectTo
  } = options || {}

  try {
    // 🔐 Verificação de autenticação
    let userId: string | undefined
    
    if (requireAuth) {
      const session = await auth()
      if (!session?.user?.id) {
        logger.warn('Tentativa de acesso não autorizado')
        return { 
          success: false, 
          error: "Usuário não autenticado" 
        }
      }
      userId = session.user.id
      logger.debug('Action executada por usuário', { userId })
    }

    // 📝 Validação dos dados de entrada
    const validationResult = schema.safeParse(input)
    if (!validationResult.success) {
      logger.warn('Dados de entrada inválidos', {
        errors: validationResult.error.errors,
        input: JSON.stringify(input)
      })
      
      return {
        success: false,
        error: "Dados inválidos fornecidos",
        fieldErrors: Object.fromEntries(
          Object.entries(validationResult.error.flatten().fieldErrors).filter(([_, v]) => v !== undefined)
        ) as Record<string, string[]>
      }
    }

    logger.debug('Dados validados com sucesso', validationResult.data)

    // 🚀 Execução da lógica de negócio
    const result = await handler(validationResult.data, userId!)
    
    // 🔄 Revalidação de caminhos
    for (const path of revalidatePaths) {
      revalidatePath(path)
      logger.debug('Path revalidated', { path })
    }

    // ↩️ Redirecionamento se especificado
    if (redirectTo) {
      logger.info('Redirecting user', { redirectTo })
      redirect(redirectTo)
    }

    logger.info('Action executed successfully')

    return {
      success: true,
      data: result,
      ...(successMessage && { message: successMessage })
    }

  } catch (error) {
    // 🚨 Tratamento de erros específicos
    if (error instanceof z.ZodError) {
      logger.error('Zod validation error', error.errors)
      return {
        success: false,
        error: "Dados inválidos",
        fieldErrors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).filter(([_, v]) => v !== undefined)
        ) as Record<string, string[]>
      }
    }

    // Erro de violação de constraint do banco
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      logger.error('Database unique constraint violation', error.message)
      return {
        success: false,
        error: "Este registro já existe no sistema"
      }
    }

    // Erro de foreign key constraint
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      logger.error('Database foreign key constraint violation', error.message)
      return {
        success: false,
        error: "Operação não permitida devido a relacionamentos existentes"
      }
    }

    // Erro genérico
    logger.error('Unexpected error in server action', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })

    return {
      success: false,
      error: errorMessage
    }
  }
}

// ===============================================
// 🎯 TEMPLATES ESPECÍFICOS POR OPERAÇÃO
// ===============================================

/**
 * Template para operações CREATE
 */
export function createServerAction<T extends z.ZodSchema>(
  schema: T,
  tableName: string,
  handler: (data: z.infer<T>, userId: string) => Promise<any>,
  revalidatePaths: string[] = []
) {
  return async (input: unknown): Promise<ActionResponse> => {
    return handleServerAction(
      input,
      schema,
      handler,
      {
        revalidatePaths,
        successMessage: `${tableName} criado com sucesso!`,
        errorMessage: `Erro ao criar ${tableName.toLowerCase()}`
      }
    )
  }
}

/**
 * Template para operações UPDATE
 */
export function updateServerAction<T extends z.ZodSchema>(
  schema: T,
  tableName: string,
  handler: (data: z.infer<T>, userId: string) => Promise<any>,
  revalidatePaths: string[] = []
) {
  return async (input: unknown): Promise<ActionResponse> => {
    return handleServerAction(
      input,
      schema,
      handler,
      {
        revalidatePaths,
        successMessage: `${tableName} atualizado com sucesso!`,
        errorMessage: `Erro ao atualizar ${tableName.toLowerCase()}`
      }
    )
  }
}

/**
 * Template para operações DELETE
 */
export function deleteServerAction<T extends z.ZodSchema>(
  schema: T,
  tableName: string,
  handler: (data: z.infer<T>, userId: string) => Promise<any>,
  revalidatePaths: string[] = []
) {
  return async (input: unknown): Promise<ActionResponse> => {
    return handleServerAction(
      input,
      schema,
      handler,
      {
        revalidatePaths,
        successMessage: `${tableName} removido com sucesso!`,
        errorMessage: `Erro ao remover ${tableName.toLowerCase()}`
      }
    )
  }
}

// ===============================================
// 📋 EXEMPLOS DE USO DO TEMPLATE
// ===============================================

/*
// Exemplo 1: CREATE Patient usando template
import { createPatientSchema } from '@/lib/validations'

export const createPatient = createServerAction(
  createPatientSchema,
  'Paciente',
  async (data, userId) => {
    return await prisma.patient.create({
      data: {
        ...data,
        userId
      }
    })
  },
  ['/dashboard/patients']
)

// Exemplo 2: UPDATE Service usando template
import { updateServiceSchema } from '@/lib/validations'

export const updateService = updateServerAction(
  updateServiceSchema,
  'Serviço',
  async (data, userId) => {
    const { id, ...updateData } = data
    return await prisma.service.update({
      where: { id, userId },
      data: updateData
    })
  },
  ['/dashboard/services']
)

// Exemplo 3: Action customizada usando handleServerAction
export const toggleServiceStatus = async (input: unknown): Promise<ActionResponse> => {
  return handleServerAction(
    input,
    z.object({
      serviceId: z.string().uuid(),
      status: z.boolean()
    }),
    async (data, userId) => {
      return await prisma.service.update({
        where: { id: data.serviceId, userId },
        data: { status: !data.status }
      })
    },
    {
      revalidatePaths: ['/dashboard/services'],
      successMessage: 'Status do serviço atualizado!',
      errorMessage: 'Erro ao alterar status do serviço'
    }
  )
}

// Exemplo 4: Action que não requer autenticação (para agendamento público)
export const createPublicAppointment = async (input: unknown): Promise<ActionResponse> => {
  return handleServerAction(
    input,
    createAppointmentSchema,
    async (data, userId) => { // userId será undefined, mas não é usado
      return await prisma.appointment.create({
        data: {
          ...data,
          userId: data.clinicId // ID da clínica vem dos dados
        }
      })
    },
    {
      requireAuth: false,
      successMessage: 'Agendamento realizado com sucesso!',
      errorMessage: 'Erro ao realizar agendamento'
    }
  )
}
*/

// ===============================================
// 🔧 UTILITIES ADICIONAIS
// ===============================================

/**
 * Helper para verificar permissões de acesso a recursos
 */
export async function checkResourceAccess(
  resourceId: string,
  userId: string,
  resourceType: 'patient' | 'service' | 'appointment' | 'consultation'
): Promise<boolean> {
  try {
    const whereClause = { id: resourceId, userId }
    
    let exists = false
    switch (resourceType) {
      case 'patient':
        exists = !!(await prisma.patient.findFirst({ where: whereClause }))
        break
      case 'service':
        exists = !!(await prisma.service.findFirst({ where: whereClause }))
        break
      case 'appointment':
        exists = !!(await prisma.appointment.findFirst({ where: whereClause }))
        break
      case 'consultation':
        exists = !!(await prisma.consultation.findFirst({ where: whereClause }))
        break
    }
    
    return exists
  } catch (error) {
    logger.error(`Error checking resource access`, { resourceId, userId, resourceType, error })
    return false
  }
}

/**
 * Helper para verificar limites do plano
 */
export async function checkPlanLimits(
  userId: string,
  operation: 'create_service' | 'create_patient'
): Promise<{ allowed: boolean; message?: string }> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (!subscription) {
      // Usuário sem assinatura - usar limites FREE
      const counts = await Promise.all([
        prisma.service.count({ where: { userId, status: true } }),
        prisma.patient.count({ where: { userId, status: true } })
      ])

      const [serviceCount, patientCount] = counts

      if (operation === 'create_service' && serviceCount >= 2) {
        return { allowed: false, message: "Limite de serviços atingido. Considere fazer upgrade do plano." }
      }
      if (operation === 'create_patient' && patientCount >= 5) {
        return { allowed: false, message: "Limite de pacientes atingido. Considere fazer upgrade do plano." }
      }
    }

    return { allowed: true }
  } catch (error) {
    logger.error('Error checking plan limits', { userId, operation, error })
    return { allowed: true } // Em caso de erro, permita a operação
  }
}

/**
 * Template para actions que verificam limites do plano
 */
export function createLimitedServerAction<T extends z.ZodSchema>(
  schema: T,
  tableName: string,
  operation: 'create_service' | 'create_patient',
  handler: (data: z.infer<T>, userId: string) => Promise<any>,
  revalidatePaths: string[] = []
) {
  return async (input: unknown): Promise<ActionResponse> => {
    return handleServerAction(
      input,
      schema,
      async (data, userId) => {
        // Verificar limites do plano antes de executar
        const limitCheck = await checkPlanLimits(userId, operation)
        if (!limitCheck.allowed) {
          throw new Error(limitCheck.message || "Limite do plano atingido")
        }

        return await handler(data, userId)
      },
      {
        revalidatePaths,
        successMessage: `${tableName} criado com sucesso!`,
        errorMessage: `Erro ao criar ${tableName.toLowerCase()}`
      }
    )
  }
}