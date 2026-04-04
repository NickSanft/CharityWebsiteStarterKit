'use client';

import { useState } from 'react';
import { Heart, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { StripeProvider } from './stripe-provider';
import { PaymentForm } from './payment-form';

const presetAmounts = siteConfig.donationAmounts;

type Step = 'details' | 'payment' | 'success';

export function DonationForm() {
  const [step, setStep] = useState<Step>('details');
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const amount = customAmount ? Math.round(parseFloat(customAmount) * 100) : selectedAmount * 100;
  const displayAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  async function handleProceedToPayment() {
    if (!donorEmail) {
      setError('Email is required');
      return;
    }
    if (amount < 100) {
      setError('Minimum donation is $1.00');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/donations/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          recurring: isRecurring,
          donorName: donorName || null,
          donorEmail,
          message: message || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground">
            Your {isRecurring ? 'monthly' : ''} donation of ${displayAmount.toFixed(2)} has been processed successfully.
            You will receive a confirmation email at {donorEmail}.
          </p>
          <Button variant="outline" onClick={() => { setStep('details'); setClientSecret(''); }}>
            Make Another Donation
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment' && clientSecret) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Complete Payment</CardTitle>
          <p className="text-muted-foreground">
            {isRecurring ? 'Monthly' : 'One-time'} donation of ${displayAmount.toFixed(2)}
          </p>
        </CardHeader>
        <CardContent>
          <StripeProvider clientSecret={clientSecret}>
            <PaymentForm
              onSuccess={() => setStep('success')}
              onBack={() => { setStep('details'); setClientSecret(''); }}
            />
          </StripeProvider>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="mt-4 text-2xl">Make a Donation</CardTitle>
        <p className="text-muted-foreground">
          Every dollar makes a difference.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* One-time vs Monthly Toggle */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-1">
          <button
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              !isRecurring ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setIsRecurring(false)}
          >
            One-Time
          </button>
          <button
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              isRecurring ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setIsRecurring(true)}
          >
            Monthly
          </button>
        </div>

        {/* Preset Amounts */}
        <div>
          <Label className="mb-2 block">Select an amount</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                className={cn(
                  'rounded-lg border-2 px-4 py-3 text-center font-semibold transition-all',
                  selectedAmount === amt && !customAmount
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <Label htmlFor="customAmount">Or enter a custom amount</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="customAmount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) setSelectedAmount(0);
              }}
            />
          </div>
        </div>

        {/* Donor Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="donorName">Name (optional)</Label>
            <Input
              id="donorName"
              placeholder="Your name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="donorEmail">Email</Label>
            <Input
              id="donorEmail"
              type="email"
              placeholder="your@email.com"
              required
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="message">Dedication or message (optional)</Label>
            <Textarea
              id="message"
              placeholder="In honor of..."
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">You are donating</p>
          <p className="mt-1 text-3xl font-bold text-primary">
            ${displayAmount.toFixed(2)}
            {isRecurring && <span className="text-lg font-normal text-muted-foreground">/month</span>}
          </p>
        </div>

        {/* Proceed Button */}
        <Button size="lg" className="w-full" onClick={handleProceedToPayment} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-5 w-5" />
          )}
          {loading ? 'Creating payment...' : 'Proceed to Payment'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Secure payment processing by Stripe. We never store your card details.
        </p>
      </CardContent>
    </Card>
  );
}
