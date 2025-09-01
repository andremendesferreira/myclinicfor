// ================================================================
// ✏️ PATIENT EDIT MODAL - Modal de Edição de Paciente
// ================================================================
// Arquivo: src/app/(panel)/dashboard/patients/_components/_patient/patient-edit-modal.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Loader2, X } from "lucide-react"
import { useCreatePatientForm } from "@/lib/validations/hooks"
import { formatPhone } from "@/lib/validations"
import { msgError, msgSuccess, msgLoading } from "@/components/custom-toast"
import { toast } from "sonner"
import { updatePatient } from "../../_act/update-patient"

interface Patient {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco?: string
  convenio?: string
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

export function EditPatientModal({ 
  patient, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditPatientModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useCreatePatientForm()
  const { register, handleSubmit, formState: { errors }, setValue, reset } = form

  useEffect(() => {
    if (patient && isOpen) {
      setValue('nome', patient.nome)
      setValue('cpf', patient.cpf)
      setValue('telefone', patient.telefone)
      setValue('email', patient.email)
      setValue('endereco', patient.endereco || '')
      setValue('convenio', patient.convenio || '')
    }
  }, [patient, isOpen, setValue])

  const handleClose = () => {
    if (!isLoading) {
      reset()
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      handleClose()
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('telefone', formatted)
  }

  const onSubmit = async (data: any) => {
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
          convenio: data.convenio
        }
      })
      
      toast.dismiss(loadingToastId)
      
      if (result.success) {
        msgSuccess("Paciente atualizado com sucesso!")
        handleClose()
        onSuccess()
      } else {
        msgError(result.error || "Erro ao atualizar paciente")
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      msgError("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !patient) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Paciente
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              {...register("nome")}
              disabled={isLoading}
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.nome.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              {...register("cpf")}
              disabled={true}
              className="bg-gray-100"
              title="CPF não pode ser alterado"
            />
            <p className="text-xs text-gray-500 mt-1">CPF não pode ser alterado</p>
          </div>

          <div>
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              {...register("telefone")}
              maxLength={15}
              onChange={handlePhoneChange}
              disabled={isLoading}
              className={errors.telefone ? "border-red-500" : ""}
            />
            {errors.telefone?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.telefone.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              {...register("endereco")}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="convenio">Convênio</Label>
            <Input
              id="convenio"
              {...register("convenio")}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}