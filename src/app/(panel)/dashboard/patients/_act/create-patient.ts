"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import getSession from "@/lib/getSession"
import { revalidatePath } from "next/cache"

const createPatientSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
})

export async function createPatient(data: z.infer<typeof createPatientSchema>) {
  try {
    // Verificar sessão
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" }
    }

    // Validar dados
    const validatedData = createPatientSchema.parse(data)

    // Limpar CPF (remover caracteres especiais)
    const cleanCpf = validatedData.cpf.replace(/\D/g, '')

    // Verificar se CPF já existe
    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [
          { cpf: cleanCpf },
          { email: validatedData.email }
        ]
      }
    })

    if (existingPatient) {
      return { 
        success: false, 
        error: existingPatient.cpf === cleanCpf 
          ? "CPF já cadastrado" 
          : "Email já cadastrado" 
      }
    }

    // Criar paciente
    const patient = await prisma.patient.create({
      data: {
        nome: validatedData.nome,
        cpf: cleanCpf,
        telefone: validatedData.telefone,
        email: validatedData.email,
        userId: session.user.id,
        status: true
      }
    })

    // Revalidar cache da página
    revalidatePath('/dashboard/patients')

    return { success: true, data: patient }
  } catch (error) {
    console.error('Erro ao criar paciente:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Dados inválidos" 
      }
    }

    return { success: false, error: "Erro interno do servidor" }
  }
}