"use client";

import { Button } from "@/components/ui/button";
import { BillingButton } from "./billing-button";
import { Plan } from "@/generated/prisma";
import { PlanCustomization } from "../_types/plan.types";
import { getButtonText } from "../_utils/plan-hierarchy";

interface PlanActionButtonProps {
  actualPlan?: Plan;
  customization: PlanCustomization;
  onPlanAction: () => void;
}

export function PlanActionButton({ actualPlan, customization, onPlanAction }: PlanActionButtonProps) {
  // Se é o plano atual, mostrar "Ativo"
  if (actualPlan && actualPlan === customization.type.types) {
    return (
      <Button 
        variant="secondary" 
        disabled 
        className="w-full cursor-not-allowed"
      >
        Ativo
      </Button>
    );
  }

  // Se é downgrade de plano pago para FREE, usar botão customizado
  if (actualPlan && actualPlan !== "FREE" && customization.type.types === "FREE") {
    return (
      <Button
        onClick={onPlanAction}
        variant="destructive"
        className={`w-full py-2 px-4 rounded-md transition-colors ${customization.buttonClass}`}
      >
        Downgrade
      </Button>
    );
  }

  // Para todos os outros cenários (upgrades, mudanças entre planos pagos, usuário FREE), usar BillingButton
  return (
    <BillingButton 
      planId={customization.planId} 
      className={`w-full py-2 px-4 rounded-md transition-colors ${customization.buttonClass}`}
      textBtn={actualPlan && actualPlan !== "FREE" ? getButtonText(actualPlan, customization.type.types) : customization.buttonText}
      type={customization.type}
    />
  );
}