"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPatient } from "../_act/create-patient"
import { toast } from "sonner"

const createPatientSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
})

type CreatePatientData = z.infer<typeof createPatientSchema>

interface CreatePatientFormProps {
  onSuccess: () => void
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreatePatientData>({
    resolver: zodResolver(createPatientSchema)
  })

  const onSubmit = async (data: CreatePatientData) => {
    setIsLoading(true)
    
    try {
      const result = await createPatient(data)
      
      if (result.success) {
        toast.success("Paciente cadastrado com sucesso!")
        reset()
        onSuccess()
      } else {
        toast.error(result.error || "Erro ao cadastrar paciente")
      }
    } catch (error) {
      toast.error("Erro inesperado ao cadastrar paciente")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          {...register("nome")}
          placeholder="Digite o nome completo"
        />
        {errors.nome && (
          <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          {...register("cpf")}
          placeholder="000.000.000-00"
          maxLength={14}
        />
        {errors.cpf && (
          <p className="text-sm text-red-600 mt-1">{errors.cpf.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          {...register("telefone")}
          placeholder="(00) 00000-0000"
        />
        {errors.telefone && (
          <p className="text-sm text-red-600 mt-1">{errors.telefone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="email@exemplo.com"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          className="flex-1"
        >
          Limpar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  )
}