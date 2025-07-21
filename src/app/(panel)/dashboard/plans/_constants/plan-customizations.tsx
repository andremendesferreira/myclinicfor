import Image from "next/image";
import freeImg from '../../../../../../public/free.png';
import basicImg from '../../../../../../public/basic.png';
import profImg from '../../../../../../public/professional.png';
import premiumImg from '../../../../../../public/premium.png';
import { PlanCustomization } from "../_types/plan.types";

export const PLAN_CUSTOMIZATIONS: Record<number, PlanCustomization> = {
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
    planId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_ID as string || "basic-plan",
    type: { types: "BASIC" }
  },
  2: {
    cardClass: "shadow-lg border-green-200 bg-green-50",
    titleClass: "text-green-700 pt-10 text-3xl md:text-2xl lg:text-lg",
    badge: <Image src={profImg} alt="Profissional" width={48} height={48} className="inline-block mr-2 pt-1" />,
    buttonText: "Contratar",
    buttonClass: "bg-green-600 hover:bg-green-700 text-white",
    planId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PLAN_ID as string || "professional-plan",
    type: { types: "PROFESSIONAL" }
  },
  3: {
    cardClass: "shadow-lg border-purple-200 bg-purple-50",
    titleClass: "text-purple-700 pt-10 text-3xl md:text-2xl lg:text-lg",
    badge: <Image src={premiumImg} alt="Premium" width={64} height={64} className="inline-block mr-2" />,
    buttonText: "Contratar",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white",
    planId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_ID as string || "premium-plan",
    type: { types: "PREMIUM" }
  }
};