const { PrismaClient } = require('../../src/generated/prisma')

const prisma = new PrismaClient()

async function createMissingPatients() {
  console.log('Iniciando criação de pacientes para appointments órfãos...')

  try {
    // 1. Buscar appointments sem patient
    const orphanAppointments = await prisma.appointment.findMany({
      where: {
        patientId: null,
        // Opcional: incluir filtros para dados mínimos necessários
        AND: [
          { name: { not: "" } },
          { email: { not: "" } }
        ]
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

    console.log(`Encontrados ${orphanAppointments.length} appointments sem patient`)

    if (orphanAppointments.length === 0) {
      console.log('Todos appointments já têm patients relacionados. Nada para fazer.')
      return
    }

    let created = 0
    let linked = 0
    let skipped = 0
    let errors = 0

    for (const appointment of orphanAppointments) {
      try {
        console.log(`Processando appointment: ${appointment.name} (${appointment.id})`)

        let patient = null

        // 2. Tentar encontrar patient existente por email ou CPF
        if (appointment.cpf && appointment.cpf.trim() !== "") {
          patient = await prisma.patient.findUnique({
            where: { cpf: appointment.cpf }
          })
          if (patient) {
            console.log(`  Patient encontrado por CPF: ${patient.nome}`)
          }
        }

        if (!patient && appointment.email && appointment.email.trim() !== "") {
          patient = await prisma.patient.findUnique({
            where: { email: appointment.email }
          })
          if (patient) {
            console.log(`  Patient encontrado por email: ${patient.nome}`)
          }
        }

        // 3. Se não encontrou, criar novo patient
        if (!patient) {
          // Validar dados mínimos
          if (!appointment.name || !appointment.email) {
            console.log(`  SKIP: Dados insuficientes (nome: ${appointment.name}, email: ${appointment.email})`)
            skipped++
            continue
          }

          // Gerar CPF se não existir (usando timestamp + random)
          let cpfToUse = appointment.cpf
          if (!cpfToUse || cpfToUse.trim() === "") {
            cpfToUse = generateDummyCPF()
            console.log(`  Gerando CPF temporário: ${cpfToUse}`)
          }

          try {
            patient = await prisma.patient.create({
              data: {
                nome: appointment.name.trim(),
                cpf: cpfToUse,
                telefone: appointment.phone || "",
                email: appointment.email.toLowerCase().trim(),
                userId: appointment.userId
              }
            })
            created++
            console.log(`  Patient criado: ${patient.nome} (${patient.cpf})`)
          } catch (createError) {
            if (createError.code === 'P2002') {
              // Erro de unique constraint
              if (createError.meta?.target?.includes('email')) {
                console.log(`  SKIP: Email já existe - ${appointment.email}`)
              } else if (createError.meta?.target?.includes('cpf')) {
                console.log(`  SKIP: CPF já existe - ${cpfToUse}`)
              }
              skipped++
              continue
            } else {
              throw createError
            }
          }
        }

        // 4. Linkar appointment ao patient
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { patientId: patient.id }
        })
        linked++
        console.log(`  Appointment linkado ao patient`)

      } catch (error) {
        errors++
        console.error(`  ERRO no appointment ${appointment.id}:`, error.message)
      }
    }

    console.log('\n=== RESULTADO ===')
    console.log(`Appointments processados: ${orphanAppointments.length}`)
    console.log(`Pacientes criados: ${created}`)
    console.log(`Appointments linkados: ${linked}`)
    console.log(`Pulados (dados insuficientes/duplicados): ${skipped}`)
    console.log(`Erros: ${errors}`)

    // 5. Validação final
    const remainingOrphans = await prisma.appointment.count({
      where: { patientId: null }
    })
    
    console.log(`\nAppointments órfãos restantes: ${remainingOrphans}`)

  } catch (error) {
    console.error('Erro geral:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Função auxiliar para gerar CPF temporário único
function generateDummyCPF() {
  const timestamp = Date.now().toString().slice(-8) // 8 dígitos finais do timestamp
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0') // 3 dígitos aleatórios
  return `${timestamp}${random}` // 11 dígitos no total
}

// Executar script
createMissingPatients()