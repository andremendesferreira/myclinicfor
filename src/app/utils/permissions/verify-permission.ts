"use server"

import { auth } from "@/lib/auth";
import { PlanDetailProps } from "./get-plans";
import prisma from "@/lib/prisma";
import { controlCreateServices } from "./controlCreateServices";

// Verificar o perfil de usuário

export type PLAN_TYPE_PROP = "FREE" | "BASIC" | "PROFESSIONAL" | "PREMIUM" | "EXPIRED";
type TypeCheck = "service";

export interface ResultPermissionProps{
    hasPermission: boolean;
    planId?: PLAN_TYPE_PROP;
    expired: boolean;
    plan: PlanDetailProps | null;
    menuLayout: number | 99;
    available: number | 0;
}

interface VerifyPermissionProps {
    type: TypeCheck
}

export async function verifyPermission({ type }: VerifyPermissionProps): Promise<ResultPermissionProps>{

    const session = await auth();
    const userId = session?.user?.id;
    if(!userId){
        return {
            hasPermission: false,
            planId: "EXPIRED",
            expired: true,
            plan: null,
            menuLayout: 99,
            available: 0,
        }
    }

    const subscription = await prisma.subscription.findFirst({
        where: {
            userId: userId
        }
    })

    switch(type){

        case "service": 

            const permission = await controlCreateServices(subscription, session);
            console.log(permission)

            return permission;

        default: {
            return {
                hasPermission: false,
                planId: "EXPIRED",
                expired: true,
                plan: null,
                menuLayout: 99,
                available: 0,
            }
        }
    }
}