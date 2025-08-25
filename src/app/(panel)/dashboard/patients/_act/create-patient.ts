"use server"

import { createLimitedServerAction } from '@/lib/server-actions/template'
import { createPatientSchema } from '@/lib/validations'
import prisma from '@/lib/prisma'

// ✅ VERSÃO NOVA - Usando template padronizado
export const createPatient = createLimitedServerAction(
  createPatientSchema,
  'Paciente',
  'create_patient',
  async (data, userId) => {
    return await prisma.patient.create({
      data: {
        ...data,
        userId
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        createdAt: true
      }
    })
  },
  ['/dashboard/patients']
)