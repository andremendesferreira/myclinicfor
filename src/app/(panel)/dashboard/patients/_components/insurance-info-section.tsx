// ================================================================
// 🏥 INSURANCE INFO SECTION - Informações do Convênio
// ================================================================
// Componente para seção de convênio do formulário de paciente

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UseFormReturn } from "react-hook-form"
import type { CreatePatientInput } from "@/lib/validations"

interface InsuranceInfoSectionProps {
  form: UseFormReturn<CreatePatientInput>
  isLoading: boolean
}

export function InsuranceInfoSection({ form, isLoading }: InsuranceInfoSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    // <div className="space-y-6">
    //   <div className="flex items-center gap-2">
    //     <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
    //       <span className="text-purple-600 font-semibold text-sm">3</span>
    //     </div>
    //     <h3 className="text-lg font-semibold text-gray-900">Convênio (Opcional)</h3>
    //   </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Nome do Convênio */}
          <div>
            <Label htmlFor="convenio" className="text-sm font-medium">
              Nome do Convênio
            </Label>
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
        </div>
      </div>
    // </div>
  );
}