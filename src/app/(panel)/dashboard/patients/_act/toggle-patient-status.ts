"use server"

import { auth } from '@/lib/auth'
import { updateServerAction } from '@/lib/server-actions/template'
import { z } from 'zod'
import prisma from '@/lib/prisma'

export const togglePatientStatus = updateServerAction(
  z.object({
    patientId: z.string().uuid(),
    status: z.boolean()
  }),
  'Status do Paciente',
  async (data, userId) => {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado')
    }

    return await prisma.patient.update({
      where: { 
        id: data.patientId, 
        userId: session.user.id 
      },
      data: { status: data.status }
    })
  },
  ['/dashboard/patients']
)