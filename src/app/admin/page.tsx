import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Users, Heart } from 'lucide-react';
import type { DashboardStats } from '@/types';

export const dynamic = 'force-dynamic';

async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalPosts, upcomingEvents, newVolunteersThisMonth, donationsAgg] =
    await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.event.count({ where: { startDate: { gt: now } } }),
      prisma.volunteer.count({
        where: {
          createdAt: { gte: startOfMonth },
          status: 'NEW',
        },
      }),
      prisma.donation.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

  return {
    totalPosts,
    upcomingEvents,
    newVolunteersThisMonth,
    donationsThisMonth: donationsAgg._count,
    totalDonationsThisMonth: donationsAgg._sum.amount ?? 0,
  };
}

async function getRecentContacts() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
}

export default async function AdminDashboardPage() {
  const [stats, recentContacts] = await Promise.all([
    getDashboardStats(),
    getRecentContacts(),
  ]);

  const cards = [
    {
      label: 'Published Posts',
      value: stats.totalPosts.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Upcoming Events',
      value: stats.upcomingEvents.toString(),
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'New Volunteers',
      value: stats.newVolunteersThisMonth.toString(),
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Donations This Month',
      value: formatCurrency(stats.totalDonationsThisMonth),
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your organization&apos;s activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
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
          <CardTitle>Recent Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentContacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No contact submissions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {contact.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.subject ?? 'No subject'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(contact.createdAt)}
                    </span>
                    <Badge variant={contact.read ? 'secondary' : 'default'}>
                      {contact.read ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
