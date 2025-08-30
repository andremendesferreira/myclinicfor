const { PrismaClient } = require('../../src/generated/prisma')

const prisma = new PrismaClient()

async function validateMigration() {
  console.log('Validando migração...')

  try {
    const stats = await prisma.$transaction([
      // Total appointments
      prisma.appointment.count(),
      
      // Appointments com patient
      prisma.appointment.count({
        where: { patientId: { not: null } }
      }),
      
      // Appointments órfãos (com CPF mas sem patient)
      prisma.appointment.count({
        where: {
          cpf: { not: "" },
          patientId: null
        }
      }),

      // Patients criados
      prisma.patient.count(),

      // Verificar integridade referencial
      prisma.appointment.count({
        where: {
          patient: { isNot: null }
        }
      })
    ])

    const [total, withPatient, orphans, totalPatients, validRefs] = stats

    console.log('Estatísticas da Migração:')
    console.log(`  Total appointments: ${total}`)
    console.log(`  Com patient: ${withPatient}`)
    console.log(`  Órfãos: ${orphans}`)
    console.log(`  Total patients: ${totalPatients}`)
    console.log(`  Referencias válidas: ${validRefs}`)

    if (orphans > 0) {
      console.warn('ATENÇÃO: Existem appointments órfãos!')
      
      // Mostrar detalhes dos órfãos
      const orphanList = await prisma.appointment.findMany({
        where: {
          cpf: { not: "" },
          patientId: null
        },
        select: {
          id: true,
          name: true,
          cpf: true,
          email: true
        },
        take: 5
      })
      
      console.log('Appointments órfãos (primeiros 5):')
      console.table(orphanList)
    } else {
      console.log('Perfeito: Todos os appointments com CPF têm patient relacionado!')
    }

    // Testar consulta com include
    const sampleAppointment = await prisma.appointment.findFirst({
      include: {
        service: true,
        patient: true
      }
    })

    console.log('\nTeste de consulta:', {
      appointmentId: sampleAppointment?.id?.substring(0, 8) + '...',
      hasService: !!sampleAppointment?.service,
      hasPatient: !!sampleAppointment?.patient,
      patientName: sampleAppointment?.patient?.nome || 'N/A',
      serviceName: sampleAppointment?.service?.name || 'N/A'
    })

    // Verificar se appointments públicos criam patients
    const appointmentsWithoutPatient = await prisma.appointment.count({
      where: {
        patientId: null,
        cpf: { not: "" }
      }
    })

    if (appointmentsWithoutPatient === 0) {
      console.log('\nSucesso: Todos appointments com CPF têm patient relacionado')
    }

    // Stats finais
    const percentage = total > 0 ? Math.round((withPatient / total) * 100) : 0
    console.log(`\nCobertura: ${percentage}% dos appointments têm patient relacionado`)

  } catch (error) {
    console.error('Erro durante validação:', error.message)
    
    if (error.message.includes('patient')) {
      console.log('\nDica: Verifique se a migration do schema foi executada:')
      console.log('npx prisma migrate dev --name add-appointment-patient-relationship')
    }
  } finally {
    await prisma.$disconnect()
  }
}

validateMigration()