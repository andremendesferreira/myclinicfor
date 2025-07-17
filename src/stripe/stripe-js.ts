import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
    if (!stripeJs) {
        throw new Error('Stripe.js failed to load');
    }
    return stripeJs;
}