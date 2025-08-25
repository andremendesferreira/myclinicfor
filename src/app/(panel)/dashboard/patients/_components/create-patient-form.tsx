"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPatient } from "../_act/create-patient"
import { useCreatePatientForm } from "@/lib/validations/hooks"
import { formatPhone, formatCPF } from "@/lib/validations"
import { msgError, msgSuccess, msgWarning, msgInfo, msgLoading } from "@/components/custom-toast"
import { toast } from "sonner"

interface CreatePatientFormProps {
  onSuccess: () => void
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useCreatePatientForm()

  const onSubmit = async (data: any) => {
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
        // Tratar diferentes tipos de erro
        if (result.fieldErrors) {
          // Mostrar erros específicos dos campos
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors[0]) {
              msgError(`${field}: ${errors[0]}`)
            }
          })
        } else if (result.error?.includes('Limite')) {
          msgWarning(result.error || "Limite do plano atingido")
        } else if (result.error?.includes('já existe')) {
          msgWarning(result.error || "Paciente já cadastrado")
        } else {
          msgError(result.error || "Erro ao cadastrar paciente")
        }
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      msgError("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Formatação automática durante digitação
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setValue('cpf', formatted)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('telefone', formatted)
  }

  const handleEmergencyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('contatoEmergencia', formatted)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* 👤 DADOS PESSOAIS */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Dados Pessoais</h3>
        
        {/* Nome */}
        <div>
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            {...register("nome")}
            placeholder="Digite o nome completo do paciente"
            disabled={isLoading}
            className={errors.nome ? "border-red-500" : ""}
          />
          {errors.nome?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.nome.message)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CPF */}
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              {...register("cpf")}
              placeholder="000.000.000-00"
              maxLength={14}
              onChange={handleCPFChange}
              disabled={isLoading}
              className={errors.cpf ? "border-red-500" : ""}
            />
            {errors.cpf?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.cpf.message)}</p>
            )}
          </div>

          {/* Data de Nascimento */}
          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
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

        {/* Estado Civil */}
        <div>
          <Label htmlFor="estadoCivil">Estado Civil</Label>
          <Select onValueChange={(value) => setValue('estadoCivil', value)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado civil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
              <SelectItem value="uniao_estavel">União Estável</SelectItem>
            </SelectContent>
          </Select>
          {errors.estadoCivil?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.estadoCivil.message)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profissão */}
          <div>
            <Label htmlFor="profissao">Profissão</Label>
            <Input
              id="profissao"
              {...register("profissao")}
              placeholder="Ex: Engenheiro, Professor, etc."
              disabled={isLoading}
              className={errors.profissao ? "border-red-500" : ""}
            />
            {errors.profissao?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.profissao.message)}</p>
            )}
          </div>

          {/* Endereço */}
          <div>
            <Label htmlFor="endereco">Endereço</Label>
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
      </div>

      {/* 📞 CONTATOS */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Contatos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telefone */}
          <div>
            <Label htmlFor="telefone">Telefone Principal *</Label>
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

          {/* Contato de Emergência */}
          <div>
            <Label htmlFor="contatoEmergencia">Contato de Emergência</Label>
            <Input
              id="contatoEmergencia"
              {...register("contatoEmergencia")}
              placeholder="(85) 99999-9999"
              maxLength={15}
              onChange={handleEmergencyPhoneChange}
              disabled={isLoading}
              className={errors.contatoEmergencia ? "border-red-500" : ""}
            />
            {errors.contatoEmergencia?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.contatoEmergencia.message)}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email *</Label>
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
      </div>

      {/* 🏥 CONVÊNIO */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Convênio (Opcional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Convênio */}
          <div>
            <Label htmlFor="convenio">Nome do Convênio</Label>
            <Input
              id="convenio"
              {...register("convenio")}
              placeholder="Ex: Unimed, Hapvida, etc."
              disabled={isLoading}
              className={errors.convenio ? "border-red-500" : ""}
            />
            {errors.convenio?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.convenio.message)}</p>
            )}
          </div>

          {/* Número do Convênio */}
          <div>
            <Label htmlFor="numeroConvenio">Número do Convênio</Label>
            <Input
              id="numeroConvenio"
              {...register("numeroConvenio")}
              placeholder="Número da carteirinha"
              disabled={isLoading}
              className={errors.numeroConvenio ? "border-red-500" : ""}
            />
            {errors.numeroConvenio?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.numeroConvenio.message)}</p>
            )}
          </div>
        </div>
      </div>

      {/* BOTÕES */}
      <div className="flex gap-3 pt-6 border-t">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Cadastrando..." : "Cadastrar Paciente"}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => reset()}
          disabled={isLoading}
          className="px-8"
        >
          Limpar
        </Button>
      </div>

      {/* Info sobre campos obrigatórios */}
      <p className="text-sm text-gray-500 text-center">
        * Campos obrigatórios
      </p>
    </form>
  )
}