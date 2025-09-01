// ================================================================
// 📋 PERSONAL INFO SECTION - Dados Pessoais do Paciente
// ================================================================
// Componente para seção de dados pessoais do formulário de paciente

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { MapPin } from "lucide-react"
import { formatCPF } from "@/lib/validations"
import { capitalizeProperNames } from "@/app/utils/formatName"
import { AddressSelector } from "@/components/AddressSelector"
import type { UseFormReturn } from "react-hook-form"
import type { CreatePatientInput } from "@/lib/validations"

interface PersonalInfoSectionProps {
  form: UseFormReturn<CreatePatientInput>
  isLoading: boolean
}

export function PersonalInfoSection({ form, isLoading }: PersonalInfoSectionProps) {
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);
  
  const { register, formState: { errors }, setValue } = form;

  // ===============================================
  // 🚀 HANDLERS DE FORMATAÇÃO AUTOMÁTICA
  // ===============================================

  // Capitalização automática do nome
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = capitalizeProperNames(e.target.value);
    setValue('nome', formattedValue);
  };

  // Formatação automática do CPF
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  return (
    // <div className="space-y-6">
    //   <div className="flex items-center gap-2">
    //     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
    //       <span className="text-blue-600 font-semibold text-sm">1</span>
    //     </div>
    //     <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
    //   </div>

      <div className="space-y-4">
        {/* Nome Completo - COM CAPITALIZAÇÃO AUTOMÁTICA */}
        <div>
          <Label htmlFor="nome" className="text-sm font-medium">
            Nome Completo *
          </Label>
          <Input
            id="nome"
            {...register("nome")}
            placeholder="Digite o nome completo do paciente"
            disabled={isLoading}
            className={errors.nome ? "border-red-500" : ""}
            onChange={handleNameChange}
          />
          {errors.nome?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.nome.message)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CPF */}
          <div>
            <Label htmlFor="cpf" className="text-sm font-medium">
              CPF *
            </Label>
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
          <div className="flex gap-2">
            <Input
              id="endereco"
              {...register("endereco")}
              placeholder="Rua, número, bairro, cidade"
              disabled={isLoading}
              className={`flex-1 ${errors.endereco ? "border-red-500" : ""}`}
            />
            <Dialog 
              open={isAddressSelectorOpen} 
              onOpenChange={setIsAddressSelectorOpen}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-3 h-9 bg-blue-600 text-white hover:bg-blue-500 shadow-blue-200 hover:text-white hover:shadow-md w-fit font-semibold cursor-pointer"
                  title="Buscar endereço no Google Maps"
                  disabled={isLoading}
                >
                  <MapPin className="w-4 h-4" />
                  Buscar
                </Button>
              </DialogTrigger>
              <AddressSelector
                onAddressSelect={(address) => setValue('endereco', address)}
                isOpen={isAddressSelectorOpen}
                onOpenChange={setIsAddressSelectorOpen}
                placeholder="Digite o endereço ou nome do local..."
                title="Buscar Endereço"
              />
            </Dialog>
          </div>
          {errors.endereco?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.endereco.message)}</p>
          )}
        </div>
      </div>
    // </div>
  );
}