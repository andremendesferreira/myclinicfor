// src/app/(panel)/dashboard/plans/_utils/plan-hierarchy.tsx
// ✅ VERSÃO CORRIGIDA com TOP adicionado

import { Plan } from '@/generated/prisma';

export const getPlanHierarchy = (plan: Plan): number => {
  const hierarchy = {
    'FREE': 0,
    'BASIC': 1, 
    'PROFESSIONAL': 2,
    'PREMIUM': 3,
    'TOP': 4  // ✅ ADICIONADO - era isso que estava faltando!
  };
  return hierarchy[plan] || 0;
};

export const getButtonText = (currentPlan: Plan, targetPlan: Plan): string => {
  const currentHierarchy = getPlanHierarchy(currentPlan);
  const targetHierarchy = getPlanHierarchy(targetPlan);
  
  if (targetHierarchy > currentHierarchy) {
    return 'Fazer Upgrade';
  } else if (targetHierarchy < currentHierarchy) {
    return 'Fazer Downgrade';  
  } else {
    return 'Plano Atual';
  }
};

// ✅ FUNÇÕES ADICIONAIS úteis para o sistema de planos

export const canUpgrade = (currentPlan: Plan, targetPlan: Plan): boolean => {
  return getPlanHierarchy(targetPlan) > getPlanHierarchy(currentPlan);
};

export const canDowngrade = (currentPlan: Plan, targetPlan: Plan): boolean => {
  return getPlanHierarchy(targetPlan) < getPlanHierarchy(currentPlan);
};

export const getNextPlan = (currentPlan: Plan): Plan | null => {
  const hierarchy = getPlanHierarchy(currentPlan);
  const plans: Plan[] = ['FREE', 'BASIC', 'PROFESSIONAL', 'PREMIUM', 'TOP'];
  
  if (hierarchy < plans.length - 1) {
    return plans[hierarchy + 1];
  }
  
  return null; // Já está no plano mais alto
};

export const getPreviousPlan = (currentPlan: Plan): Plan | null => {
  const hierarchy = getPlanHierarchy(currentPlan);
  const plans: Plan[] = ['FREE', 'BASIC', 'PROFESSIONAL', 'PREMIUM', 'TOP'];
  
  if (hierarchy > 0) {
    return plans[hierarchy - 1];
  }
  
  return null; // Já está no plano mais baixo
};

export const getAllPlans = (): Plan[] => {
  return ['FREE', 'BASIC', 'PROFESSIONAL', 'PREMIUM', 'TOP'];
};

export const getPlanDisplayName = (plan: Plan): string => {
  const displayNames = {
    'FREE': 'Gratuito',
    'BASIC': 'Básico', 
    'PROFESSIONAL': 'Profissional',
    'PREMIUM': 'Premium',
    'TOP': 'Top (Prioridade)'
  };
  return displayNames[plan] || plan;
};

export const getPlanPrice = (plan: Plan): string => {
  const prices = {
    'FREE': 'R$ 0,00',
    'BASIC': 'R$ 24,99',
    'PROFESSIONAL': 'R$ 49,99', 
    'PREMIUM': 'R$ 79,99',
    'TOP': 'R$ 99,99'
  };
  return prices[plan] || 'Consultar';
};