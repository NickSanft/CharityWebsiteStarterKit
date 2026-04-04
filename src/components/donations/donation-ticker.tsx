import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Heart } from 'lucide-react';

export async function DonationTicker() {
  let recentDonations: { amount: number; currency: string; createdAt: Date; donorName: string | null }[] = [];

  try {
    recentDonations = await prisma.donation.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        amount: true,
        currency: true,
        createdAt: true,
        donorName: true,
      },
    });
  } catch {
    // Database not available
  }

  if (recentDonations.length === 0) return null;

  function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Heart className="h-4 w-4 text-primary" />
        Recent Donations
      </h4>
      <ul className="space-y-2">
        {recentDonations.map((donation, i) => {
          const name = donation.donorName
            ? donation.donorName.split(' ')[0].charAt(0) + '***'
            : 'Anonymous';
          return (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{name}</span>
              <span className="flex items-center gap-2">
                <span className="font-medium text-primary">
                  {formatCurrency(donation.amount, donation.currency)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(donation.createdAt)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
