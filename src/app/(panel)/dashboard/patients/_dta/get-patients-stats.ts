import prisma from "@/lib/prisma"

interface GetPatientsStatsProps {
  userId: string
}

export async function getPatientsStats({ userId }: GetPatientsStatsProps) {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Total de pacientes
    const total = await prisma.patient.count({
      where: { userId }
    })

    // Pacientes ativos (com status true)
    const active = await prisma.patient.count({
      where: { 
        userId,
        status: true
      }
    })

    // Novos pacientes este mês
    const newThisMonth = await prisma.patient.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    // Consultas este mês
    const consultationsThisMonth = await prisma.consultation.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    return {
      total,
      active,
      newThisMonth,
      consultationsThisMonth
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos pacientes:', error)
    return {
      total: 0,
      active: 0,
      newThisMonth: 0,
      consultationsThisMonth: 0
    }
  }
}