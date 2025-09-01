// ================================================================
// 👥 CREATE PATIENT FORM - Componente Principal (Refatorado)
// ================================================================
// Form de criação de paciente dividido em componentes menores

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createPatient } from "../_act/create-patient"
import { useCreatePatientForm } from "@/lib/validations/hooks"
import { msgError, msgSuccess, msgLoading } from "@/components/custom-toast"
import { toast } from "sonner"
import { Loader2, UserPlus, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CreatePatientData } from "@/lib/validations"

// Importar os componentes divididos
import { PersonalInfoSection } from "./personal-info-section"
import { ContactInfoSection } from "./contact-info-section" 
import { InsuranceInfoSection } from "./insurance-info-section"

interface CreatePatientFormProps {
  onSuccess: () => void
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useCreatePatientForm()

  const { handleSubmit, reset } = form

  // ===============================================
  // 🚀 SUBMIT HANDLER
  // ===============================================

  const onSubmit = async (data: CreatePatientData) => {
    setIsLoading(true)
    
    const loadingToastId = msgLoading("Cadastrando paciente...")
    
    try {
      const result = await createPatient(data)
      
      toast.dismiss(loadingToastId)
      
      if (result.success) {
        msgSuccess("Paciente cadastrado com sucesso!")
        reset()
        onSuccess()
      } else {
        // Tratamento específico de diferentes tipos de erro
        if (result.fieldErrors) {
          // Mostrar erros específicos dos campos
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors[0]) {
              msgError(`${field}: ${errors[0]}`)
            }
          })
        } else if (result.error?.includes('Limite')) {
          msgError("⚠️ Limite do plano atingido! Upgrade para cadastrar mais pacientes.")
        } else if (result.error?.includes('já existe')) {
          msgError("⚠️ Já existe um paciente com este CPF ou email.")
        } else {
          msgError(result.error || "Erro ao cadastrar paciente")
        }
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      msgError("Erro inesperado. Tente novamente.")
      console.error('Erro ao criar paciente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto gap-1 border-0 mt-0 pt-0">
      <CardHeader className="border-0 mt-0 pt-0">
        <CardTitle className="flex items-center gap-2 p-0">
          <UserPlus className="w-5 h-5" />
          Novo Paciente
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-0 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 m-0 p-0">
          {/* Alerta informativo */}
          <Alert className="bg-blue-200 border-blue-400">
            <AlertCircle className="h-5! w-5! text-blue-50" />
            <AlertDescription className="text-sm text-shadow-white">
              Campos marcados com * são obrigatórios. Os dados serão criptografados e mantidos em segurança.
            </AlertDescription>
          </Alert>
          {/* 📋 SEÇÃO: Dados Pessoais */}
          <PersonalInfoSection form={form} isLoading={isLoading} />
          {/* 📞 SEÇÃO: Contatos */}
          <ContactInfoSection form={form} isLoading={isLoading} />
          {/* 🏥 SEÇÃO: Convênio */}
          <InsuranceInfoSection form={form} isLoading={isLoading} />
          <Separator className="my-4" />
          {/* 🚀 BOTÕES DE AÇÃO */}
          <div className="flex flex-row items-center space-x-2 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isLoading}
              className="order-2 sm:order-1"
            >
              Limpar Formulário
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="order-1 sm:order-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Cadastrar Paciente
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}