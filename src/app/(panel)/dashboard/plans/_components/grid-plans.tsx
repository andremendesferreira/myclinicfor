import { Card, CardTitle, CardAction, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { PLANS, type PlanDetailProps} from "@/app/utils/plansConst";
import freeImg from '../../../../../../public/free.png';
import basicImg from '../../../../../../public/basic.png';
import profImg from '../../../../../../public/professional.png';
import premiumImg from '../../../../../../public/premium.png';
import Image from "next/image";
import { BillingButton } from "./billing-button";
import { Plan } from "@/generated/prisma"

interface PlanProps {
    types: Plan;
}

// Tipo para configuração de personalização de cada plano
type PlanCustomization = {
  cardClass: string;
  titleClass: string;
  badge: React.ReactNode | null;
  buttonText: string;
  buttonClass: string;
  planId: string;
  type: PlanProps
};

// Configuração para personalização de cada plano
const PLAN_CUSTOMIZATIONS: Record<number, PlanCustomization> = {
  0: {
    cardClass: "shadow-lg border-gray-200 bg-gray-50",
    titleClass: "text-gray-700 pt-10 text-3xl md:text-2xl lg:text-lg",
    badge: <Image src={freeImg} alt="Grátis" width={48} height={48} className="inline-block mr-2 pt-1" />,
    buttonText: "Contratar",
    buttonClass: "bg-gray-600 hover:bg-gray-700 text-white",
    planId: process.env.NEXT_PUBLIC_STRIPE_FREE_PLAN_ID as string || "free-plan",
    type: { types: "FREE" }
  },
  1: {
    cardClass: "shadow-xl border-blue-300 bg-blue-50",
    titleClass: "text-blue-700 pt-10 text-3xl md:text-2xl lg:text-lg",
    badge: <Image src={basicImg} alt="Básico" width={48} height={48} className="inline-block mr-2 pt-1" />,
    buttonText: "Contratar",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
    planId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_ID as string || "basic-plan", // Use environment variable or default value
    type: { types: "BASIC" }
  },
  2: {
    cardClass: "shadow-lg border-green-200 bg-green-50",
    titleClass: "text-green-700 pt-10 text-3xl md:text-2xl lg:text-lg",
    badge: <Image src={profImg} alt="Profissional" width={48} height={48} className="inline-block mr-2 pt-1" />,
    buttonText: "Contratar",
    buttonClass: "bg-green-600 hover:bg-green-700 text-white",
    planId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PLAN_ID as string || "professional-plan", // Use environment variable or default value
    type: { types: "PROFESSIONAL" }
  },
  3: {
    cardClass: "shadow-lg border-purple-200 bg-purple-50",
    titleClass: "text-purple-700 pt-10 text-3xl md:text-2xl lg:text-lg",
    badge: <Image src={premiumImg} alt="Premium" width={64} height={64} className="inline-block mr-2" />,
    buttonText: "Contratar",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white",
    planId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_ID as string || "premium-plan", // Use environment variable or default value
    type: { types: "PREMIUM" }
  }
};

// Componente reutilizável para exibir cada plano
function PlanCard({ plan, index, actualPlan }: { plan: PlanDetailProps; index: number; actualPlan?: Plan }) {
  const customization = PLAN_CUSTOMIZATIONS[index] || PLAN_CUSTOMIZATIONS[0];
  
  return (
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
        <p className="text-2xl font-bold mt-4">
          {plan.activatePromo ? (
            <>
              <span className="text-gray-400 line-through text-lg mr-2">R$ {plan.price}</span>
              <span className="text-gray-600">R$ {plan.promoPrice}</span>
            </>
          ) : (
            `R$ ${plan.price}`
          )}
        </p>
      </CardContent>
      
      <CardFooter className="mt-auto">
        <CardAction className="w-full h-full flex justify-end-safe items-center">
          {actualPlan && actualPlan === customization.type.types ? (
            <div className={`hover:cursor-not-allowed w-full h-9 flex items-center justify-center py-2 px-4 rounded-md bg-gray-300 text-gray-700`}>
              Ativo
            </div>
          ) : (
            <BillingButton 
              planId={customization.planId} 
              className={`w-full py-2 px-4 rounded-md transition-colors ${customization.buttonClass}`}
              textBtn={customization.buttonText}
              type={customization.type}
          />
          )}

        </CardAction>
      </CardFooter>
    </Card>
  );
}

export function GridPlans({ actualPlan }: { actualPlan?: Plan | undefined }) {
  const plans = Object.values(PLANS);
  
  return (
    <article>
      <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={plan} index={index} actualPlan={actualPlan || undefined} />
        ))}
      </section>
    </article>
  );
}