import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/stripe/stripe';
import { manageSubscription } from './_act/managerSubscription';
import { Plan } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  console.log("WEBHOOK INICIANDO...");
  console.log("Received Stripe webhook:", signature);

  const text = await request.text();

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  )

  if (!event) {
    return NextResponse.error();
  }

  switch (event.type) {

    // Cadastrar nova assinatura
    case 'checkout.session.completed':
        
        const session = event.data.object as Stripe.Checkout.Session;
      
        const type = session?.metadata?.type ? session?.metadata?.type : "FREE";

        if (session.subscription && session.customer) {
            await manageSubscription(
                session.subscription.toString(),
                session.customer.toString(),
                'create',
                type as Plan
            );
        }

        revalidatePath("/dashboard/plans");

    break;

    // Alterar assinatura existente
    case 'customer.subscription.updated':

        const updatedSubscription = event.data.object as Stripe.Subscription;
        const updatedType = updatedSubscription?.metadata?.type ? updatedSubscription?.metadata?.type : "FREE";

        await manageSubscription(
            updatedSubscription.id,
            updatedSubscription.customer.toString(),
            'update',
            updatedType as Plan
        );

      revalidatePath("/dashboard/plans");

    break;
    
    // Cancelar assinatura atual
    case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("Cancelar assinatura atual:", deletedSubscription);
        await manageSubscription(
            deletedSubscription.id,
            deletedSubscription.customer.toString(),
            'delete',
        );
        revalidatePath("/dashboard/plans");
    break;

    default:
      console.log("Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}