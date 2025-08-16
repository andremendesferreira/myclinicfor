import { Plan } from "@/generated/prisma";

export const getPlanHierarchy = (plan: Plan): number => {
  const hierarchy = {
    'FREE': 0,
    'BASIC': 1,
    'PROFESSIONAL': 2,
    'PREMIUM': 3
  };
  return hierarchy[plan] || 0;
};

export const getButtonText = (currentPlan: Plan, targetPlan: Plan): string => {
  const currentHierarchy = getPlanHierarchy(currentPlan);
  const targetHierarchy = getPlanHierarchy(targetPlan);
  
  if (targetHierarchy > currentHierarchy) {
    return "Melhorar";
  } else if (targetHierarchy < currentHierarchy) {
    return "Diminuir";
  }
  return "Alterar";
};