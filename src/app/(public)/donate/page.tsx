'use client';

import { useState } from 'react';
import { Heart, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

const presetAmounts = siteConfig.donationAmounts;

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [isRecurring, setIsRecurring] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Support Our Mission
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Your generous contribution helps us continue our work and create
            lasting change in the community.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl">Make a Donation</CardTitle>
                <p className="text-muted-foreground">
                  Every dollar makes a difference. Choose an amount below to get
                  started.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* One-time vs Monthly Toggle */}
                <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-1">
                  <button
                    className={cn(
                      'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                      !isRecurring
                        ? 'bg-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => setIsRecurring(false)}
                  >
                    One-Time
                  </button>
                  <button
                    className={cn(
                      'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                      isRecurring
                        ? 'bg-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => setIsRecurring(true)}
                  >
                    Monthly
                  </button>
                </div>

                {/* Preset Amounts */}
                <div>
                  <p className="mb-3 text-sm font-medium">Select an amount:</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSelectedAmount(amount)}
                        className={cn(
                          'rounded-lg border-2 px-4 py-4 text-center font-semibold transition-all',
                          selectedAmount === amount
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        ${amount}
                        {isRecurring && (
                          <span className="block text-xs font-normal text-muted-foreground">
                            /month
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Summary */}
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    You are donating
                  </p>
                  <p className="mt-1 text-3xl font-bold text-primary">
                    ${selectedAmount}
                    {isRecurring && (
                      <span className="text-lg font-normal text-muted-foreground">
                        /month
                      </span>
                    )}
                  </p>
                </div>

                {/* Donate Button (disabled placeholder) */}
                <Button size="lg" className="w-full" disabled>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </Button>

                {/* Coming Soon Notice */}
                <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Secure payment processing via Stripe is coming soon.
                  </p>
                  <Badge variant="secondary" className="ml-1">
                    Phase 2
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Impact Info */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-primary">$10</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Provides school supplies for one child
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-primary">$50</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Funds a week of after-school programming
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-primary">$100</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supports a family with emergency assistance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
