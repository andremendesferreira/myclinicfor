"use client";
import { Button } from "@/components/ui/button";
import { handleBilling } from "../_act/create-subscription";
import { msgError, msgInfo, msgSuccess, msgWarning } from "@/components/custom-toast";
import { getStripeJs } from "@/stripe/stripe-js";
import { Plan } from "@/generated/prisma"

interface PlanProps {
    types: Plan;
}

interface BillingButtonProps {
  planId: string;
  className?: string;
  textBtn: string;
  type: PlanProps;
  disabled?: boolean | false;
}

export function BillingButton({ planId, className, textBtn, type, disabled }: BillingButtonProps) {

    interface BillingResponse {
        success: boolean;
        type: string;
        message: string;
        sessionId?: string;
    }

    async function handleClick(planId: string, type: PlanProps) {
        const response: BillingResponse = await handleBilling(planId, type);

        console.log(response);
        if (response.type === "success" && response.sessionId) {
            const stripeJs = await getStripeJs();
            stripeJs.redirectToCheckout({ sessionId: response.sessionId });
            msgSuccess(response.message);
        } else if (response.type === "success" && !response.sessionId) {
            msgSuccess(response.message);
        } else if (response.type === "info") {
            msgInfo(response.message);
        } else if (response.type === "warning") {
            msgWarning(response.message);
        } else {
            msgError(response.message);
        }
        return;
    }

    return (
        <Button onClick={() => handleClick(planId, type)} className={className} disabled={disabled}>
            {textBtn}
        </Button>
    );
  }
