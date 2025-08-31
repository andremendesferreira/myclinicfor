"use server"

import { auth } from '@/lib/auth'
import { updateServerAction } from '@/lib/server-actions/template'
import { updatePatientSchema } from '@/lib/validations'
import prisma from '@/lib/prisma'
import { z } from 'zod'

export const updatePatient = updateServerAction(
  updatePatientSchema.extend({ id: z.string().uuid() }),
  'Paciente',
  async (data, userId) => {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado')
    }

    const { id, ...updateData } = data
    //ToDo: Corrigir
    return await prisma.patient.update({
      where: { 
        id, 
        userId: session.user.id 
      },
      data: updateData
    })
  },
  ['/dashboard/patients']
)