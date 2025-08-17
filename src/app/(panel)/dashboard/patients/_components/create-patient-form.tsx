"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPatient } from "../_act/create-patient"
import { msgError, msgSuccess } from "@/components/custom-toast"
import { formatPhone } from '@/app/utils/formatPhone';
import { formatCPF, validateCPF } from "@/app/utils/formatCPF"
import { capitalizeProperNames } from "@/app/utils/formatName"

const createPatientSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string()
    .min(1, "O CPF é obrigatório")
    .refine((cpf) => {
      const cleanCpf = cpf.replace(/\D/g, '');
      return cleanCpf.length === 11;
    }, "CPF deve ter 11 dígitos")
    .refine((cpf) => validateCPF(cpf.replace(/\D/g, '')), "CPF inválido"),
  telefone: z.string().refine(value => {
    const regex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return regex.test(value);
  }, {
    message: "Telefone deve estar no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
  }),
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
        msgSuccess("Paciente cadastrado com sucesso!")
        reset()
        onSuccess()
      } else {
        msgError(result.error || "Erro ao cadastrar paciente")
      }
    } catch (error) {
      msgError("Erro inesperado ao cadastrar paciente")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label className="mb-2" htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          placeholder="Digite o nome completo"
          {...register("nome", {
            onChange: (e) => {
              const formattedValue = capitalizeProperNames(e.target.value);
              e.target.value = formattedValue;
            }
          })}
        />
        {errors.nome && (
          <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2" htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          placeholder="000.000.000-00"
          {...register("cpf", {
            pattern: {
              value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: "CPF deve estar no formato 000.000.000-00"
            },
            onChange: (e) => {
              const formattedValue = formatCPF(e.target.value);
              e.target.value = formattedValue;
            }
          })}
          maxLength={14}
        />
        {errors.cpf && (
          <p className="text-sm text-red-600 mt-1">{errors.cpf.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2" htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          placeholder="(99) 99999-9999"
          {...register("telefone", {
            pattern: {
              value: /^\(\d{2}\) \d{4,5}-\d{4}$/,
              message: "Telefone deve estar no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
            },
            onChange: (e) => {
              const formattedValue = formatPhone(e.target.value);
              e.target.value = formattedValue;
            }
          })}
        />
        {errors.telefone && (
          <p className="text-sm text-red-600 mt-1">{errors.telefone.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2" htmlFor="email">Email</Label>
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