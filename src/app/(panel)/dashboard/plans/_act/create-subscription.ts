"use server";

import { auth } from "@/lib/auth";
import { stripe } from "@/stripe/stripe";
import prisma from "@/lib/prisma";
import { Plan } from "@/generated/prisma"


interface PlanProps {
    types: Plan;
}

export async function handleBilling(planId: string, {types}: PlanProps ) {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        const data = {
            success: false,
            type: "error",
            message: "Usuário não autenticado. Por favor, faça login para continuar."
        }
        return data;

    };

    if (!planId) {
        const data = {
            success: false,
            type: "error",
            message: "O código do plano não foi fornecido."
        }

        return data;
    }
    
    try {

        const userData = await prisma.user.findFirst({
            where: { id: userId },
        });

        let customerId = userData?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: userData?.email || undefined,
            });
            await prisma.user.update({
                where: { id: userId },
                data: { stripe_customer_id: customer.id },
            });
            if (!customer.id) {
                const data = {
                    success: false,
                    type: "error",
                    message: "Erro ao criar cliente no Stripe. Tente novamente mais tarde."
                }
                return data;
            }
            customerId = customer.id;
        };

        if (planId === "free-plan") {
            try {
                const verifiedPlan = await prisma.subscription.findFirst({
                    where: { userId, status: "active", plan: types },
                });
                if (!verifiedPlan) {
                    await prisma.subscription.create({
                        data: {
                            status: "active",
                            priceId: planId,
                            plan: types,
                            userId: userId,
                        }
                    });

                    const data = {
                        success: true,
                        type: "success",
                        message: "Plano gratuito ativado com sucesso."
                    }
                    console.log("Usuário atualizado para plano gratuito.");
                    return data;

                } else {
                    const data = {
                        success: true,
                        type: "info",
                        message: "Você já está no plano gratuito."
                    }
                    console.log("Usuário já está no plano gratuito.");
                    return data;
                }

            } catch (err) {
                const data = {
                    success: false,
                    type: "error",
                    message: "Erro ao atualizar usuário para plano gratuito. Tente novamente mais tarde."
                }
                if (err instanceof Error) {
                    console.error('Erro ao atualizar usuário para plano gratuito:', err.message);
                } else {
                    console.error('Erro ao atualizar usuário para plano gratuito:', err);
                }
                return data;
            }
        }

        let price:string = '';

        switch (types) {
            case "BASIC":
                price = process.env.STRIPE_PLAN_BASIC_PRICE as string || "basic-plan";
                break;
            case "PROFESSIONAL":
                price = process.env.STRIPE_PLAN_PROFESSIONAL_PRICE as string || "professional-plan";
                break;
            case "PREMIUM":
                price = process.env.STRIPE_PLAN_PREMIUM_PRICE as string || "premium-plan";
                break;
            default:
                price = process.env.STRIPE_PLAN_FREE_PRICE as string || "free-plan";
        }

        const stripeInstance = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            mode: 'subscription',
            line_items: [{
                price: price,
                quantity: 1,
            }],
            metadata: {
                userId: userId,
                plan: planId,
                type: types,
                createdAt: new Date().toISOString(),
            },
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });

        if (!stripeInstance) {
            const data = {
                success: false,
                type: "error",
                message: "Erro ao tentar carregar plataforma pagamentos. Tente novamente mais tarde."
            }
            console.error("Instância do Stripe não inicializada.");
            return data;
        }

        const data = {
            sessionId: stripeInstance.id,
            success: true,
            type: "success",
            message: "Redirecionando para plataforma de assinaturas.", 
        }

        return data;
        
    } catch (err){
        const data = {
            success: false,
            type: "error",
            message: "Erro ao processar pagamento. Tente novamente mais tarde."}
        if (err instanceof Error) {
            console.error('Error during billing process:', err.message);
        } else {
            console.error('Error during billing process:', err);
        }
        return data;
    }
}