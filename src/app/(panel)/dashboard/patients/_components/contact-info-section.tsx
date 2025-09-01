// ================================================================
// 📞 CONTACT INFO SECTION - Informações de Contato do Paciente
// ================================================================
// Componente para seção de contatos do formulário de paciente

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPhone } from "@/lib/validations"
import type { UseFormReturn } from "react-hook-form"
import type { CreatePatientData } from "@/lib/validations"

interface ContactInfoSectionProps {
  form: UseFormReturn<CreatePatientData>
  isLoading: boolean
}

export function ContactInfoSection({ form, isLoading }: ContactInfoSectionProps) {
  const { register, formState: { errors }, setValue } = form;

  // ===============================================
  // 🚀 HANDLER DE FORMATAÇÃO DO TELEFONE
  // ===============================================

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('telefone', formatted);
  };

  return (
    // <div className="space-y-6">
    //    <div className="flex items-center gap-2">
    //     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
    //       <span className="text-green-600 font-semibold text-sm">2</span>
    //     </div>
    //     <h3 className="text-lg font-semibold text-gray-900">Contato</h3>
    //   </div>

      <div className="space-y-4">
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
      </div>
    // </div>
  );
}