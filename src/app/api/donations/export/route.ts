import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['Date', 'Donor Name', 'Email', 'Amount', 'Currency', 'Recurring', 'Status', 'Message', 'Stripe Payment ID'];

  const rows = donations.map((d) => [
    d.createdAt.toISOString().split('T')[0],
    d.donorName || 'Anonymous',
    d.donorEmail,
    (d.amount / 100).toFixed(2),
    d.currency.toUpperCase(),
    d.recurring ? 'Yes' : 'No',
    d.status,
    (d.message || '').replace(/"/g, '""'),
    d.stripePaymentId,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="donations-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
