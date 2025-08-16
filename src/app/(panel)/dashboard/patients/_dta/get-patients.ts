import prisma from "@/lib/prisma";

interface GetPatientsProps {
  userId: string
  search?: string
  limit?: number
  offset?: number
}

export async function getPatients({ 
  userId, 
  search, 
  limit = 50, 
  offset = 0 
}: GetPatientsProps) {
  try {
    const where = {
      userId,
      ...(search && {
        OR: [
          { nome: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { cpf: { contains: search.replace(/\D/g, '') } }
        ]
      })
    }

    const patients = await prisma.patient.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        nome: true,
        cpf: true,
        telefone: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            consultations: true
          }
        }
      }
    })

    return patients
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    return []
  }
}