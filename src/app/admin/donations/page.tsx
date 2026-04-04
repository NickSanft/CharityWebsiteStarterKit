import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDonationStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalAgg, monthAgg, recurringCount, donations] = await Promise.all([
    prisma.donation.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.donation.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.donation.count({
      where: { recurring: true, status: 'COMPLETED' },
    }),
    prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    totalRaised: totalAgg._sum.amount ?? 0,
    thisMonth: monthAgg._sum.amount ?? 0,
    recurringDonors: recurringCount,
    donations,
  };
}

const statusColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  COMPLETED: 'default',
  PENDING: 'secondary',
  FAILED: 'destructive',
  REFUNDED: 'outline',
};

export default async function DonationsPage() {
  const { totalRaised, thisMonth, recurringDonors, donations } =
    await getDonationStats();

  const summaryCards = [
    {
      label: 'Total Raised',
      value: formatCurrency(totalRaised),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'This Month',
      value: formatCurrency(thisMonth),
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Recurring Donors',
      value: recurringDonors.toString(),
      icon: RefreshCw,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
        <p className="text-muted-foreground">
          Track and manage donation activity.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">
          Stripe integration is coming in Phase 2. Currently displaying existing
          donation records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`rounded-md p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No donations recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">
                      {donation.donorName ?? 'Anonymous'}
                    </TableCell>
                    <TableCell>{donation.donorEmail}</TableCell>
                    <TableCell>
                      {formatCurrency(donation.amount, donation.currency)}
                    </TableCell>
                    <TableCell>
                      {donation.recurring ? (
                        <Badge variant="outline">Recurring</Badge>
                      ) : (
                        <Badge variant="secondary">One-time</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[donation.status] ?? 'default'}>
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(donation.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
