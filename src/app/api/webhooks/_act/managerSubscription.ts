import prisma from "@/lib/prisma";
import { stripe } from '@/stripe/stripe'
import { Plan } from '@/generated/prisma';

/**
 * Salvar, atualizar ou deletar informações das assinaturas (subscription) no banco de dados, sincronizando com a Stripe.
 */
export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  action: string,
  type?: Plan
) {
    const findUser = await prisma.user.findFirst({
        where: {
            stripe_customer_id: customerId
        },
        include: {
            subscription: true,
        }
    })
    
    if (!findUser) {
        return Response.json({ error: "Falha na ação de assinatura." }, { status: 400 })
    }

    switch (action) {

        // Ação de criação de nova assinatura
        case 'create':

            // Verificação se a nova assinatura não é o caso de uma atualização do plano FREE
            const verifySubscription: any = Array.isArray(findUser.subscription) && findUser.subscription.length > 0
            ? findUser.subscription[0].id
            : (findUser.subscription && (findUser.subscription as any).id)
                ? (findUser.subscription as any).id
                : undefined;

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            const subscriptionData = {
                id: subscription.id,
                userId: findUser.id,
                status: subscription.status,
                priceId: subscription.items.data[0].price.id,
                plan: type ?? "FREE"
            }

            try {
                if (!verifySubscription) {
                    await prisma.subscription.create({
                            data: subscriptionData
                        })
                    return;
                } else {
                    const subscriptionUpdate = {
                        status: subscription.status,
                        priceId: subscription.items.data[0].price.id,
                        plan: type ?? "FREE"
                    }
                    await prisma.subscription.update({
                        where: {
                            id: verifySubscription
                        },
                        data: subscriptionUpdate
                    })
                    return;
                }

            } catch (err) {
                console.log("ERRO AO SALVAR NO BANCO A ASSINATURA")
                console.log(err);
            }

        break;

        // Caso de atualização de plano.
        case 'update':

        try{
            // Verificação de inscrição
            const findSubscription = await prisma.subscription.findFirst({
                where: {
                    id: subscriptionId,
                }
            })

            // Sair caso não exista uma inscrição
            if (!findSubscription) return;

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            await prisma.subscription.update({
                where: {
                    id: findSubscription.id
                },
                data: {
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id,
                    plan: type
                }
            });

            return;

        }catch(err){
            console.log("FALHA AO ATUALIZAR ASSINATURA NO BANCO")
            console.log(err)
        }

        break;

        case 'delete':

            try{
                await prisma.subscription.delete({
                where: {
                    userId: findUser.id
                }
            });

            return;

            }catch(err){
                console.log("FALHA AO DELETAR ASSINATURA NO BANCO")
                console.log(err)
            }

        break;

        default:
            console.log("Ação não definida:", action);
    }

}