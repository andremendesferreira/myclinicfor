"use server"

import { auth } from '@/lib/auth'
import { createServerAction } from '@/lib/server-actions/template'
import { createPatientSchema } from '@/lib/validations'
import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'

/**
 * Server Action para criar um novo paciente
 * 
 * Funcionalidades:
 * - Verificação de autenticação obrigatória
 * - Validação de limites do plano do usuário
 * - Sanitização e formatação automática de dados
 * - Verificação de duplicatas inteligente
 * - Logs de auditoria para rastreabilidade
 * - Tratamento específico de erros de negócio
 */
export const createPatient = createServerAction(
  createPatientSchema,
  'Paciente',
  async (data, userId) => {
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error('Acesso negado. Faça login para continuar.')
    }

    const authenticatedUserId = session.user.id

    // 2. Verificar limites do plano (se aplicável)
    const [userWithSubscription, currentPatientCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: authenticatedUserId },
        select: {
          id: true,
          name: true,
          subscription: {
            select: {
              plan: true,
              status: true
            }
          }
        }
      }),
      prisma.patient.count({
        where: { 
          userId: authenticatedUserId,
          status: true 
        }
      })
    ])

    if (!userWithSubscription) {
      throw new Error('Usuário não encontrado')
    }

    // Definir limites por plano (ajustar conforme necessário)
    // ToDo: Rever limites de pacientes por plano
    const planLimits = {
      FREE: 10,
      BASIC: 50,
      PREMIUM: 200,
      PROFESSIONAL: 1000,
      TOP: Infinity
    }

    const userPlan = userWithSubscription.subscription?.plan || 'FREE'
    const maxPatients = planLimits[userPlan as keyof typeof planLimits] || planLimits.FREE

    if (currentPatientCount >= maxPatients) {
      throw new Error(`Limite de ${maxPatients} pacientes atingido para o plano ${userPlan}. Faça upgrade para continuar.`)
    }

    // 3. Sanitizar e formatar dados de entrada
    const sanitizedData = {
      nome: data.nome?.trim() || '',
      cpf: data.cpf?.replace(/\D/g, '') || '', // Remove formatação
      telefone: data.telefone?.replace(/\D/g, '') || '', // Remove formatação
      email: data.email?.toLowerCase().trim() || '',
      endereco: data.endereco?.trim() || '',
      convenio: data.convenio?.trim() || ''
    }

    // 4. Verificar duplicatas antes de criar
    const existingPatient = await prisma.patient.findFirst({
      where: {
        userId: authenticatedUserId,
        OR: [
          { cpf: sanitizedData.cpf },
          { email: sanitizedData.email }
        ],
        status: true
      },
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true
      }
    })

    if (existingPatient) {
      if (existingPatient.cpf === sanitizedData.cpf) {
        throw new Error(`Paciente com CPF ${data.cpf} já está cadastrado.`)
      }
      if (existingPatient.email === sanitizedData.email) {
        throw new Error(`Paciente com email ${sanitizedData.email} já está cadastrado.`)
      }
    }

    // 5. Preparar dados para criação (apenas campos que existem no schema)
    const patientData: Prisma.PatientCreateInput = {
      nome: sanitizedData.nome,
      cpf: sanitizedData.cpf,
      telefone: sanitizedData.telefone,
      email: sanitizedData.email,
      user: {
        connect: { id: authenticatedUserId }
      }
    }

    if (sanitizedData.endereco) {
      // Verificar se campo endereco existe no schema antes de atribuir
      (patientData as any).endereco = sanitizedData.endereco
    }

    if (sanitizedData.convenio) {
      (patientData as any).convenio = sanitizedData.convenio
    }

    if (data.dataNascimento) {
      (patientData as any).dataNascimento = data.dataNascimento
    }

    try {
      // 6. Criar paciente com transação para garantir consistência
      const newPatient = await prisma.$transaction(async (tx) => {
        // Criar o paciente
        const patient = await tx.patient.create({
          data: patientData,
          select: {
            id: true,
            nome: true,
            email: true,
            cpf: true,
            telefone: true,
            endereco: true,
            convenio: true,
            dataNascimento: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                name: true
              }
            }
          }
        })

        // Log de auditoria (opcional - implementar conforme necessário)
        console.log(`📝 Paciente criado: ${patient.nome} (${patient.cpf}) por usuário ${authenticatedUserId}`)

        return patient
      })

      return newPatient

    } catch (error) {
      // 7. Tratamento específico de erros do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            // Unique constraint violation
            const field = (error.meta?.target as string[])?.join(', ') || 'dados'
            throw new Error(`Paciente com ${field} já existe no sistema.`)
          
          case 'P2003':
            // Foreign key constraint violation
            throw new Error('Erro de referência de dados. Verifique se todos os dados estão corretos.')
          
          case 'P2025':
            // Record not found
            throw new Error('Usuário não encontrado no sistema.')
          
          default:
            console.error('Erro do Prisma ao criar paciente:', error)
            throw new Error('Erro interno do banco de dados. Tente novamente.')
        }
      }

      // Re-lançar outros erros
      throw error
    }
  },
  ['/dashboard/patients']
)