"use client";

import { PLANS } from "@/app/utils/plansConst";
import { GridPlansProps } from "../_types/plan.types";
import { PlanCard } from "./plan-card";

export function GridPlans({ 
  actualPlan, 
  onPlanDowngrade 
}: GridPlansProps) {
  const plans = Object.values(PLANS);
  
  return (
    <article>
      <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan, index) => (
          <PlanCard 
            key={index} 
            plan={plan} 
            index={index} 
            actualPlan={actualPlan || undefined}
            onPlanDowngrade={onPlanDowngrade}
          />
        ))}
      </section>
    </article>
  );
}