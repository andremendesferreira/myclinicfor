"use server"

import { Plan } from '@/generated/prisma';

export interface PlanDetailProps {
    maxServices: number;
    menuLayout: number;
}

type PlansProps = {
    FREE: PlanDetailProps;
    BASIC: PlanDetailProps;
    PREMIUM: PlanDetailProps;
    PROFESSIONAL: PlanDetailProps;
}

const PLAN_CONTROL : PlansProps = {
     FREE: {
        maxServices: 2,
        menuLayout: 0,
    },
    BASIC: {
        maxServices: 5,
        menuLayout: 1,
    },
    PROFESSIONAL: {
        maxServices: 25,
        menuLayout: 2,
    },
    PREMIUM: {
        maxServices: 50,
        menuLayout: 3
    }

}

export async function getPlan(planId: Plan){
    return PLAN_CONTROL[planId];
}