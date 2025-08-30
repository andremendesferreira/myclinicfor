const { PrismaClient } = require('../../src/generated/prisma')
const prisma = new PrismaClient()

async function checkStatus() {
  try {
    // Verificar estrutura da tabela
    const appointments = await prisma.appointment.findMany({
      take: 2,
      select: {
        id: true,
        cpf: true,
        patientId: true, // Este campo pode não existir ainda
        name: true
      }
    })
    
    console.log('Estrutura dos appointments:', appointments)
    
    // Contar appointments por status
    const withPatientId = await prisma.appointment.count({
      where: { patientId: { not: null } }
    })
    
    const withCpfButNoPatient = await prisma.appointment.count({
      where: {
        cpf: { not: "" },
        patientId: null
      }
    })
    
    console.log('Com patientId:', withPatientId)
    console.log('Com CPF mas sem patientId:', withCpfButNoPatient)
    
  } catch (error) {
    if (error.message.includes('patientId')) {
      console.log('Campo patientId não existe. Execute a migration primeiro:')
      console.log('npx prisma migrate dev --name add-appointment-patient-relationship')
    } else {
      console.error('Erro:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkStatus()