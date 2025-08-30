const { PrismaClient } = require('../../src/generated/prisma')
// Note: dois níveis para subir de /prisma/scripts/ para /src/

const prisma = new PrismaClient()

async function migrateAppointmentPatientRelationship() {
  console.log('Iniciando migração Appointment → Patient')
  
  try {
    const totalAppointments = await prisma.appointment.count()
    const appointmentsWithCPF = await prisma.appointment.count({
      where: { cpf: { not: "" } }
    })
    
    console.log(`Total appointments: ${totalAppointments}`)
    console.log(`Com CPF: ${appointmentsWithCPF}`)

    const appointmentsToMigrate = await prisma.appointment.findMany({
      where: {
        cpf: { not: "" },
        patientId: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        userId: true
      }
    })

    console.log(`Migrando ${appointmentsToMigrate.length} appointments`)

    let linked = 0
    let created = 0
    let errors = 0

    for (const appointment of appointmentsToMigrate) {
      try {
        let patient = await prisma.patient.findUnique({
          where: { cpf: appointment.cpf }
        })

        if (!patient) {
          patient = await prisma.patient.create({
            data: {
              nome: appointment.name,
              cpf: appointment.cpf,
              telefone: appointment.phone,
              email: appointment.email,
              userId: appointment.userId
            }
          })
          created++
          console.log(`Patient criado: ${patient.nome} (${patient.cpf})`)
        }

        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { patientId: patient.id }
        })

        linked++

      } catch (error) {
        errors++
        console.error(`Erro no appointment ${appointment.id}:`, error.message)
      }
    }

    console.log(`Migração concluída:`)
    console.log(`- Appointments linkados: ${linked}`)
    console.log(`- Patients criados: ${created}`)
    console.log(`- Erros: ${errors}`)

  } catch (error) {
    console.error('Erro geral na migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateAppointmentPatientRelationship()