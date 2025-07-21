import { Plan } from "@/generated/prisma";

export interface PlanDetailProps {
  name: string;
  description: {
    text: string;
    features: string[];
  };
  price: number;
  promoPrice?: number;
  activatePromo?: boolean;
}

export interface PlanProps {
  types: Plan;
}

export type PlanCustomization = {
  cardClass: string;
  titleClass: string;
  badge: React.ReactNode | null;
  buttonText: string;
  buttonClass: string;
  planId: string;
  type: PlanProps;
};

export interface DowngradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  currentPlan: Plan;
  targetPlan: string;
  isLoading?: boolean;
}

export interface PlanCardProps {
  plan: PlanDetailProps;
  index: number;
  actualPlan?: Plan;
  onPlanDowngrade?: (fromPlan: Plan, toPlan: Plan) => Promise<void>;
}

export interface GridPlansProps {
  actualPlan?: Plan | undefined;
  onPlanDowngrade?: (fromPlan: Plan, toPlan: Plan) => Promise<void>;
}
