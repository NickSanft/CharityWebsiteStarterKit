import { DonationForm } from '@/components/donations/donation-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support our mission with a one-time or monthly donation.',
};

export default function DonatePage() {
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
          <DonationForm />

          {/* Impact Info */}
          <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center">
              <p className="text-2xl font-bold text-primary">$10</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Provides school supplies for one child
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <p className="text-2xl font-bold text-primary">$50</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Funds a week of after-school programming
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <p className="text-2xl font-bold text-primary">$100</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Supports a family with emergency assistance
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
