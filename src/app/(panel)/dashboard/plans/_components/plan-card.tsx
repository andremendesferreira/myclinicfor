"use client";

import { useState } from "react";
import { Card, CardTitle, CardAction, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { formatCurrecy } from "@/app/utils/formatCurrency";
import { PLAN_CUSTOMIZATIONS } from "../_constants/plan-customizations";
import { PlanCardProps } from "../_types/plan.types";
import { DowngradeDialog } from "./downgrade-dialog";
import { PlanActionButton } from "./plan-action-button";

export function PlanCard({ 
  plan, 
  index, 
  actualPlan, 
  onPlanDowngrade 
}: PlanCardProps) {
  const customization = PLAN_CUSTOMIZATIONS[index] || PLAN_CUSTOMIZATIONS[0];
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  
  const handlePlanAction = () => {
    if (!actualPlan) return;
    
    const targetPlan = customization.type.types;
    
    // Mostrar diálogo APENAS quando for downgrade de plano pago para FREE
    if (targetPlan === "FREE" && actualPlan !== "FREE") {
      setShowDowngradeDialog(true);
    } else {
      // Para outros cenários, deixar o billing-button.tsx tratar
      console.log(`Processando mudança de ${actualPlan} para ${targetPlan}`);
    }
  };

  const confirmDowngrade = async () => {
    if (!actualPlan || !onPlanDowngrade) return;
    
    try {
      await onPlanDowngrade(actualPlan, customization.type.types);
      console.log(`Downgrade confirmado de ${actualPlan} para ${customization.type.types}`);
    } catch (error) {
      console.error('Erro no downgrade:', error);
      throw error;
    }
  };
  
  return (
    <>
      <Card className={`${customization.cardClass} relative flex flex-col h-full`}>
        {customization.badge && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 pl-4 pt-4 rounded-full z-10">
            {customization.badge}
          </div>
        )}
        
        <CardHeader>
          <CardTitle className={customization.titleClass}>{plan.name}</CardTitle>
          <CardDescription>{plan.description.text}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <ul className="space-y-2">
            {plan.description.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start text-base lg:text-sm">
                <span className="text-gray-800 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="text-2xl font-bold mt-4">
            {plan.activatePromo ? (
              <div className="flex flex-row items-center justify-around">
                <span className="text-gray-400 line-through text-lg mr-2">{formatCurrecy(plan.price)}</span>
                <span className="text-gray-600">{formatCurrecy(plan.promoPrice ?? 0)}</span>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-between">
                {formatCurrecy(plan.price)}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="mt-auto">
          <CardAction className="w-full h-full flex justify-end-safe items-center">
            <PlanActionButton 
              actualPlan={actualPlan}
              customization={customization}
              onPlanAction={handlePlanAction}
            />
          </CardAction>
        </CardFooter>
      </Card>

      <DowngradeDialog
        isOpen={showDowngradeDialog}
        onOpenChange={setShowDowngradeDialog}
        onConfirm={confirmDowngrade}
        currentPlan={actualPlan || "FREE"}
        targetPlan={customization.type.types}
      />
    </>
  );
}