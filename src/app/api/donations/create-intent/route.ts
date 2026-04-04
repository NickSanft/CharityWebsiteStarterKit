import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 },
    );
  }

  const body = await request.json();
  const { amount, recurring, donorName, donorEmail } = body;
  const donorMessage = body.message || '';

  // Validate
  if (!amount || amount < 100) {
    return NextResponse.json(
      { error: 'Minimum donation is $1.00' },
      { status: 400 },
    );
  }

  if (!donorEmail) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 },
    );
  }

  try {
    if (recurring) {
      // For recurring: create a customer, then a subscription with an incomplete payment
      const customer = await stripe.customers.create({
        email: donorEmail,
        name: donorName || undefined,
        metadata: { message: donorMessage },
      });

      const price = await stripe.prices.create({
        unit_amount: amount,
        currency: 'usd',
        recurring: { interval: 'month' },
        product_data: {
          name: 'Monthly Donation',
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          donorName: donorName || '',
          donorEmail,
          message: donorMessage,
        },
      });

      // Extract client secret from the expanded invoice -> payment_intent
      const latestInvoice = subscription.latest_invoice as Record<string, unknown> | null;
      const paymentIntent = latestInvoice?.payment_intent as Record<string, unknown> | null;
      const clientSecret = paymentIntent?.client_secret as string | null;

      if (!clientSecret) {
        return NextResponse.json(
          { error: 'Failed to create subscription payment' },
          { status: 500 },
        );
      }

      return NextResponse.json({
        clientSecret,
        subscriptionId: subscription.id,
      });
    } else {
      // One-time payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: {
          donorName: donorName || '',
          donorEmail,
          message: donorMessage,
        },
        receipt_email: donorEmail,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch (err) {
    console.error('Stripe error:', err);
    const errMessage = err instanceof Error ? err.message : 'Payment processing failed';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
