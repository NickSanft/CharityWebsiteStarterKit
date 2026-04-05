import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
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
import { Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VolunteerStatusSelect } from './volunteer-status-select';
import { VolunteerTabs } from './volunteer-tabs';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getVolunteers() {
  return prisma.volunteer.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

const statusColors: Record<string, string> = {
  NEW: 'default',
  CONTACTED: 'secondary',
  ACTIVE: 'outline',
  INACTIVE: 'destructive',
};

export default async function VolunteersPage() {
  const volunteers = await getVolunteers();

  const counts = {
    all: volunteers.length,
    NEW: volunteers.filter((v) => v.status === 'NEW').length,
    CONTACTED: volunteers.filter((v) => v.status === 'CONTACTED').length,
    ACTIVE: volunteers.filter((v) => v.status === 'ACTIVE').length,
    INACTIVE: volunteers.filter((v) => v.status === 'INACTIVE').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteers</h1>
          <p className="text-muted-foreground">
            Manage your volunteer registrations.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-md bg-muted p-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {volunteers.length} total
            </span>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/api/volunteers/export" download>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
        </div>
      </div>

      <VolunteerTabs counts={counts}>
        {(['all', 'NEW', 'CONTACTED', 'ACTIVE', 'INACTIVE'] as const).map(
          (tab) => {
            const filtered =
              tab === 'all'
                ? volunteers
                : volunteers.filter((v) => v.status === tab);

            return (
              <div key={tab} data-tab={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {tab === 'all' ? 'All Volunteers' : `${tab.charAt(0)}${tab.slice(1).toLowerCase()} Volunteers`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filtered.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No volunteers in this category.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Interests</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                              Update Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((volunteer) => (
                            <TableRow key={volunteer.id}>
                              <TableCell className="font-medium">
                                <Link href={`/admin/volunteers/${volunteer.id}`} className="text-primary hover:underline">
                                  {volunteer.name}
                                </Link>
                              </TableCell>
                              <TableCell>{volunteer.email}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {(
                                    volunteer.interests as string[]
                                  ).map((interest: string) => (
                                    <Badge
                                      key={interest}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    (statusColors[volunteer.status] as
                                      | 'default'
                                      | 'secondary'
                                      | 'outline'
                                      | 'destructive') ?? 'default'
                                  }
                                >
                                  {volunteer.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatDate(volunteer.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <VolunteerStatusSelect
                                  volunteerId={volunteer.id}
                                  currentStatus={volunteer.status}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          },
        )}
      </VolunteerTabs>
    </div>
  );
}
