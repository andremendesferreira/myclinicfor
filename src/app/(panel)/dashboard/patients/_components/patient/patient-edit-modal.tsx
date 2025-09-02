// ================================================================
// ✏️ PATIENT EDIT MODAL - Modal de Edição de Paciente (Refatorado)
// ================================================================
// Modal refatorado usando Dialog do shadcn/ui para melhor acessibilidade
// Com componentes modulares, formatação automática e validações consistentes

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Loader2, X, AlertCircle } from "lucide-react"
import { useCreatePatientForm } from "@/lib/validations/hooks"
import { formatPhone, formatCPF } from "@/lib/validations"
import { capitalizeProperNames } from "@/app/utils/formatName"
import { msgError, msgSuccess, msgLoading } from "@/components/custom-toast"
import { toast } from "sonner"
import { updatePatient } from "../../_act/update-patient"
import type { CreatePatientForm } from "@/lib/validations"

// ===============================================
// 🔧 INTERFACES
// ===============================================

interface Patient {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco?: string
  dataNascimento?: string
  convenio?: string
  contatoEmergencia?: string
  status: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    consultations: number
  }
}

interface EditPatientModalProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// ===============================================
// 🎨 COMPONENTE PRINCIPAL
// ===============================================

export function EditPatientModal({ 
  patient, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditPatientModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useCreatePatientForm()
  const { register, handleSubmit, formState: { errors }, setValue, reset } = form

  // ===============================================
  // 📥 PREENCHIMENTO DO FORMULÁRIO
  // ===============================================
  
  useEffect(() => {
    if (patient && isOpen) {
      // Preencher todos os campos com os dados do paciente
      setValue('nome', patient.nome)
      setValue('cpf', patient.cpf)
      setValue('telefone', patient.telefone)
      setValue('email', (formatPhone(patient.email)))
      setValue('endereco', patient.endereco || '')
      setValue('dataNascimento', patient.dataNascimento || '')
      setValue('convenio', patient.convenio || '')
    }
  }, [patient, isOpen, setValue])

  // ===============================================
  // 🎛️ HANDLERS DE CONTROLE DO MODAL
  // ===============================================

  const handleClose = () => {
    if (!isLoading) {
      reset()
      onClose()
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      handleClose()
    }
  }

  // ===============================================
  // 📝 HANDLERS DE FORMATAÇÃO AUTOMÁTICA
  // ===============================================

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = capitalizeProperNames(e.target.value)
    setValue('nome', formatted)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('telefone', formatted)
  }

  // ===============================================
  // 🚀 SUBMIT HANDLER
  // ===============================================

  const onSubmit = async (data: CreatePatientForm) => {
    if (!patient) return
    
    setIsLoading(true)
    const loadingToastId = msgLoading("Atualizando paciente...")
    
    try {
      const result = await updatePatient({
        patientId: patient.id,
        data: {
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          endereco: data.endereco,
          dataNascimento: data.dataNascimento,
          convenio: data.convenio
        }
      })
      
      toast.dismiss(loadingToastId)
      
      if (result.success) {
        msgSuccess("✅ Paciente atualizado com sucesso!")
        handleClose()
        onSuccess()
      } else {
        // Tratamento específico de diferentes tipos de erro
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (Array.isArray(errors) && errors.length > 0) {
              msgError(`${field}: ${errors[0]}`)
            }
          })
        } else if (result.error?.includes('já existe')) {
          msgError("⚠️ Já existe um paciente com este email.")
        } else {
          msgError(result.error || "Erro ao atualizar paciente")
        }
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      msgError("Erro inesperado. Tente novamente.")
      console.error('Erro ao atualizar paciente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ===============================================
  // 🎨 RENDERIZAÇÃO
  // ===============================================

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="lg:min-w-lg sm:max-w-md w-full p-0 m-0 [&>button]:hidden">
        {/* HEADER */}
        <DialogHeader className="p-0 m-0">
          <DialogTitle className="pl-4 mt-4 mb-0 mr-0 ml-0 flex flex-row items-center justify-between">
            Editar Paciente
            <DialogClose className="absolute right-1 m-0 p-0">
              <Button
                className="mr-1"
                variant="ghost"
                size="icon"
                onClick={handleClose} 
                disabled={isLoading}
              >
                <X className='w-5 h-5' />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-4 mb-4 mt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            
            {/* Alerta informativo */}
            <Alert className="bg-blue-50 border-blue-200 p-2 mb-3">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                Campos marcados com * são obrigatórios, o CPF não pode ser alterado.
              </AlertDescription>
            </Alert>

            {/* 📋 DADOS PESSOAIS */}
            <div className="space-y-3">
              
              {/* Nome Completo */}
              <div>
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Digite o nome completo do paciente"
                  onChange={handleNameChange}
                  disabled={isLoading}
                  className={errors.nome ? "border-red-500" : ""}
                />
                {errors.nome?.message && (
                  <p className="text-sm text-red-500 mt-1">{String(errors.nome.message)}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="paciente@exemplo.com"
                  disabled={isLoading}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email?.message && (
                  <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>
                )}
              </div>

              {/* Endereço */}
              <div>
                <Label htmlFor="endereco" className="text-sm font-medium">
                  Endereço
                </Label>
                <Input
                  id="endereco"
                  {...register("endereco")}
                  placeholder="Rua, número, bairro, cidade"
                  disabled={isLoading}
                  className={errors.endereco ? "border-red-500" : ""}
                />
                {errors.endereco?.message && (
                  <p className="text-sm text-red-500 mt-1">{String(errors.endereco.message)}</p>
                )}
              </div>
            </div>

            {/* 📞 CONTATOS */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Telefone Principal */}
                <div>
                  <Label htmlFor="telefone" className="text-sm font-medium">
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    {...register("telefone")}
                    placeholder="(85) 99999-9999"
                    maxLength={15}
                    onChange={handlePhoneChange}
                    disabled={isLoading}
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                  {errors.telefone?.message && (
                    <p className="text-sm text-red-500 mt-1">{String(errors.telefone.message)}</p>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div>
                  <Label htmlFor="dataNascimento" className="text-sm font-medium">
                    Data de Nascimento
                  </Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    {...register("dataNascimento")}
                    disabled={isLoading}
                    className={errors.dataNascimento ? "border-red-500" : ""}
                  />
                  {errors.dataNascimento?.message && (
                    <p className="text-sm text-red-500 mt-1">{String(errors.dataNascimento.message)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 🏥 CONVÊNIO */}
            <div className="space-y-4 mb-3">
              <div>
                <Label htmlFor="convenio" className="text-sm font-medium">
                  Nome do Convênio
                </Label>
                <Input
                  id="convenio"
                  {...register("convenio")}
                  placeholder="Ex: Unimed, Hapvida, Bradesco Saúde, etc."
                  disabled={isLoading}
                  className={errors.convenio ? "border-red-500" : ""}
                />
                {errors.convenio?.message && (
                  <p className="text-sm text-red-500 mt-1">{String(errors.convenio.message)}</p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* 🚀 BOTÕES DE AÇÃO */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 order-2 sm:order-1"
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 order-1 sm:order-2 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}