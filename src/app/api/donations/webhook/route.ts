import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 },
    );
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('Webhook signature error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId =
          typeof paymentIntent.customer === 'string'
            ? paymentIntent.customer
            : null;

        await prisma.donation.upsert({
          where: { stripePaymentId: paymentIntent.id },
          update: { status: 'COMPLETED' },
          create: {
            stripePaymentId: paymentIntent.id,
            stripeCustomerId: customerId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            recurring: false,
            donorName: paymentIntent.metadata.donorName || null,
            donorEmail:
              paymentIntent.metadata.donorEmail ||
              paymentIntent.receipt_email ||
              'unknown@example.com',
            message: paymentIntent.metadata.message || null,
            status: 'COMPLETED',
          },
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Cast through unknown for Stripe v22 type compatibility
        const invoiceObj = invoice as unknown as Record<string, unknown>;
        const subscriptionId = invoiceObj.subscription as string | null;
        const paymentIntentId = invoiceObj.payment_intent as string | null;
        const customerId = invoiceObj.customer as string | null;
        const amountPaid = (invoiceObj.amount_paid as number) || 0;
        const currency = (invoiceObj.currency as string) || 'usd';
        const customerEmail = invoiceObj.customer_email as string | null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await prisma.donation.upsert({
            where: { stripePaymentId: paymentIntentId || (invoice as { id: string }).id },
            update: { status: 'COMPLETED' },
            create: {
              stripePaymentId: paymentIntentId || (invoice as { id: string }).id,
              stripeCustomerId: customerId,
              amount: amountPaid,
              currency,
              recurring: true,
              donorName: subscription.metadata.donorName || null,
              donorEmail:
                subscription.metadata.donorEmail ||
                customerEmail ||
                'unknown@example.com',
              message: subscription.metadata.message || null,
              status: 'COMPLETED',
            },
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : null;

        if (paymentIntentId) {
          await prisma.donation.updateMany({
            where: { stripePaymentId: paymentIntentId },
            data: { status: 'REFUNDED' },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.donation.upsert({
          where: { stripePaymentId: paymentIntent.id },
          update: { status: 'FAILED' },
          create: {
            stripePaymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            recurring: false,
            donorName: paymentIntent.metadata.donorName || null,
            donorEmail:
              paymentIntent.metadata.donorEmail ||
              paymentIntent.receipt_email ||
              'unknown@example.com',
            message: paymentIntent.metadata.message || null,
            status: 'FAILED',
          },
        });
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
