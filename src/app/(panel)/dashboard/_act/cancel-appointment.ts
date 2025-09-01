// ================================================================
// ❌ CANCEL APPOINTMENT - Server Action Corrigida
// ================================================================
// Arquivo: src/app/(panel)/dashboard/_act/cancel-appointment.ts

"use server"

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { cancelAppointmentSchema } from '@/lib/validations'
import type { ActionResponse } from '@/lib/validations'

// ===============================================
// 🚨 SERVER ACTION - cancelAppointment
// ===============================================

export async function cancelAppointment(input: unknown): Promise<ActionResponse> {
  try {
    // 1. Validar dados de entrada
    const validatedData = cancelAppointmentSchema.parse(input)
    
    // 2. Verificar autenticação
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Acesso negado. Faça login para continuar.'
      }
    }

    const userId = session.user.id

    // 3. Verificar se o agendamento existe e pertence ao usuário
    const appointment = await prisma.appointment.findFirst({
      where: { 
        id: validatedData.appointmentId,
        // Verificar se o agendamento pertence ao usuário (pelo service ou diretamente)
        OR: [
          { userId: userId }, // Agendamentos diretos do usuário
          { 
            service: {
              userId: userId // Agendamentos através de serviços do usuário
            }
          }
        ]
      },
      include: {
        patient: {
          select: {
            nome: true
          }
        },
        service: {
          select: {
            name: true
          }
        }
      }
    })

    if (!appointment) {
      return {
        success: false,
        error: 'Agendamento não encontrado ou você não tem permissão para cancelá-lo.'
      }
    }

    // 4. Cancelar o agendamento (soft delete ou hard delete)
    await prisma.appointment.delete({
      where: { 
        id: validatedData.appointmentId 
      }
    })

    // 5. Revalidar cache das páginas relacionadas
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/appointments')
    
    // 6. Log da ação (opcional)
    console.log(`📅 Agendamento cancelado: ${appointment.patient?.nome || 'Paciente'} - ${appointment.service.name}`)

    // 7. Retornar sucesso
    return {
      success: true,
      data: `Agendamento de ${appointment.patient?.nome || 'paciente'} cancelado com sucesso.`
    }

  } catch (error) {
    console.error('❌ Erro ao cancelar agendamento:', error)
    
    // Tratar erros de validação do Zod
    if (error && typeof error === 'object' && 'issues' in error) {
      return {
        success: false,
        error: 'Dados inválidos fornecidos.',
        fieldErrors: (error as any).flatten?.()?.fieldErrors
      }
    }

    return {
      success: false,
      error: 'Erro interno do servidor. Tente novamente.'
    }
  } 
}