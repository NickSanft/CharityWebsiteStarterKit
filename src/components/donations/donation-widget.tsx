'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const quickAmounts = [10, 25, 50];

export function DonationWidget() {
  const [selected, setSelected] = useState(25);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Make a Difference</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setSelected(amt)}
            className={cn(
              'rounded-md border py-2 text-sm font-medium transition-colors',
              selected === amt
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50',
            )}
          >
            ${amt}
          </button>
        ))}
      </div>
      <Button asChild className="w-full">
        <Link href={`/donate`}>
          Donate ${selected}
        </Link>
      </Button>
    </div>
  );
}
