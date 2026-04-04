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
import { DollarSign, TrendingUp, RefreshCw, Calendar } from 'lucide-react';
import { DonationFilters } from './donation-filters';

export const dynamic = 'force-dynamic';

async function getDonationStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [totalAgg, monthAgg, yearAgg, recurringCount, donations] = await Promise.all([
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
    prisma.donation.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startOfYear },
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
    thisYear: yearAgg._sum.amount ?? 0,
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
  const { totalRaised, thisMonth, thisYear, recurringDonors, donations } =
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
      label: 'This Year',
      value: formatCurrency(thisYear),
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
          <p className="text-muted-foreground">
            Track and manage donation activity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Donations</CardTitle>
            <DonationFilters />
          </div>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No donations recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Message</TableHead>
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
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {donation.message || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
