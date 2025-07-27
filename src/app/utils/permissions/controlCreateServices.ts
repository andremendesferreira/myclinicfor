"use service"

import prisma from "@/lib/prisma";
import { Subscription } from "@/generated/prisma";
import { Session } from "next-auth";
import { getPlan } from "./get-plans";
import { PLANS } from "../plansConst";
import { ResultPermissionProps } from "./verify-permission"

export async function controlCreateServices(subscription: Subscription | null, session: Session):Promise<ResultPermissionProps>{

    try{
        const userId = session?.user?.id;

        if (!userId){
            console.log("Falha na verificação da quantidade de serviços ativos")
            return {
                    hasPermission: false,
                    planId: subscription?.plan,
                    expired: true,
                    plan: null,
                    menuLayout: 99,
                    available: 0,
                }
        }

        //Contar serviços ativos.
        const serviceCount = await prisma.service.count({
            where: {
                userId: userId,
                status: true,
            } 
        })

        // console.log(subscription)

        if (subscription && (subscription.status === "active" || subscription.status === "Downgrade")){
            const plan = subscription.plan;
            const planLmt = await getPlan(plan);

            console.log("Limites do plano", planLmt);

            let verifyService: boolean;
            let available: number = 0;

            if (planLmt === null || serviceCount >= planLmt.maxServices){
                //Limite de serviço não encontrado ou limite de serviços atingido conforme o plano.
                verifyService = false;
            } else {
                verifyService = true;
                available = (planLmt.maxServices - serviceCount)
            }

            return {
                    hasPermission: verifyService,
                    planId: subscription.plan,
                    expired: false,
                    plan: PLANS[subscription.plan],
                    menuLayout: planLmt.menuLayout,
                    available: available,
            }
        } else {
            return {
                    hasPermission: false,
                    planId: subscription?.plan,
                    expired: true,
                    plan: null,
                    menuLayout: 99,
                    available: 0,
            }
        }

    }catch(err){
        console.log(err);
            return {
                    hasPermission: false,
                    planId: subscription?.plan,
                    expired: true,
                    plan: null,
                    menuLayout: 99,
                    available: 0,
            }
    }
}