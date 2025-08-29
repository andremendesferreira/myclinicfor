"use server"

import { createLimitedServerAction, updateServerAction, deleteServerAction } from '@/lib/server-actions/template'
import { z } from 'zod'
import prisma from '@/lib/prisma'

// ===============================================
// 🔧 SCHEMAS CORRIGIDOS (sem campos inexistentes)
// ===============================================

// Schema para criação de serviço (apenas campos que existem no Prisma)
const createServiceSchemaCorrect = z.object({
  name: z
    .string()
    .min(2, "Nome do serviço deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  price: z
    .number()
    .min(0, "Preço não pode ser negativo")
    .int("Preço deve ser um número inteiro"),
  duration: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .max(480, "Duração máxima é 8 horas"),
})

// Schema para atualização de serviço
const updateServiceSchemaCorrect = createServiceSchemaCorrect.partial().extend({
  id: z.string().uuid("ID do serviço inválido"),
})

// Schema para toggle status
const toggleServiceStatusSchema = z.object({
  serviceId: z.string().uuid("ID do serviço inválido"),
  status: z.boolean(),
})

// ===============================================
// 🆕 CREATE SERVICE - Com verificação de limites
// ===============================================

export const createService = createLimitedServerAction(
  createServiceSchemaCorrect,
  'Serviço',
  'create_service',
  async (data, userId) => {
    // Converter preço de reais para centavos
    const priceInCents = Math.round(data.price * 100)
    
    return await prisma.service.create({
      data: {
        name: data.name,
        price: priceInCents,
        duration: data.duration,
        userId,
        status: true
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        status: true,
        createdAt: true
      }
    })
  },
  ['/dashboard/services']
)

// ===============================================
// ✏️ UPDATE SERVICE - Atualização segura
// ===============================================

export const updateService = updateServerAction(
  updateServiceSchemaCorrect,
  'Serviço',
  async (data, userId) => {
    const { id, ...updateData } = data
    
    // Converter preço para centavos se fornecido
    if (updateData.price !== undefined) {
      updateData.price = Math.round(updateData.price * 100)
    }
    
    // Verificar se o serviço pertence ao usuário
    const existingService = await prisma.service.findFirst({
      where: { id, userId }
    })
    
    if (!existingService) {
      throw new Error('Serviço não encontrado ou sem permissão')
    }
    
    return await prisma.service.update({
      where: { id, userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        status: true,
        updatedAt: true
      }
    })
  },
  ['/dashboard/services']
)

// ===============================================
// 🔄 TOGGLE STATUS - Ativar/Desativar
// ===============================================

export const toggleServiceStatus = updateServerAction(
  toggleServiceStatusSchema,
  'Status do Serviço',
  async (data, userId) => {
    // Buscar o serviço atual
    const service = await prisma.service.findFirst({
      where: { 
        id: data.serviceId, 
        userId 
      },
      select: {
        id: true,
        status: true,
        name: true
      }
    })

    if (!service) {
      throw new Error('Serviço não encontrado')
    }

    const newStatus = !data.status

    return await prisma.service.update({
      where: { 
        id: data.serviceId, 
        userId 
      },
      data: { 
        status: newStatus 
      },
      select: {
        id: true,
        name: true,
        status: true,
        updatedAt: true
      }
    })
  },
  ['/dashboard/services']
)

// ===============================================
// 🗑️ DELETE SERVICE - Com validações de integridade  
// ===============================================

const deleteServiceSchema = z.object({
  serviceId: z.string().uuid("ID do serviço inválido")
})

export const deleteService = deleteServerAction(
  deleteServiceSchema,
  'Serviço',
  async (data, userId) => {
    // Verificar se o serviço pertence ao usuário
    const service = await prisma.service.findFirst({
      where: { 
        id: data.serviceId, 
        userId 
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            appointment: true,
            consultations: true
          }
        }
      }
    })

    if (!service) {
      throw new Error('Serviço não encontrado')
    }

    // Verificar se há agendamentos ou consultas vinculados
    if (service._count.appointment > 0) {
      throw new Error(`Não é possível excluir "${service.name}" pois possui ${service._count.appointment} agendamento(s) vinculado(s)`)
    }

    if (service._count.consultations > 0) {
      throw new Error(`Não é possível excluir "${service.name}" pois possui ${service._count.consultations} consulta(s) vinculada(s)`)
    }

    // Se chegou até aqui, pode deletar
    return await prisma.service.delete({
      where: { 
        id: data.serviceId, 
        userId 
      },
      select: {
        id: true,
        name: true
      }
    })
  },
  ['/dashboard/services']
)

// ===============================================
// 🔄 LEGACY COMPATIBILITY (manter compatibilidade)
// ===============================================

// Manter nome antigo para compatibilidade (corrigindo o typo "crete")
export const creteNewService = createService

// Exportar com nomes alternativos para compatibilidade
export const inativeService = toggleServiceStatus