import { prisma } from '@/lib/prisma';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { EventTabs } from './event-tabs';

export const dynamic = 'force-dynamic';

type EventWithCount = {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  location: string;
  capacity: number | null;
  published: boolean;
  _count: { registrations: number };
};

function EventTable({ events }: { events: EventWithCount[] }) {
  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">No events found.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Registrations</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.title}</TableCell>
            <TableCell>{formatDateTime(event.startDate)}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>
              {event._count.registrations}
              {event.capacity !== null && ` / ${event.capacity}`}
            </TableCell>
            <TableCell>
              <Badge variant={event.published ? 'default' : 'secondary'}>
                {event.published ? 'Published' : 'Draft'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/events/${event.id}/registrations`}>Registrations</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
    select: {
      id: true, title: true, slug: true, startDate: true, location: true,
      capacity: true, published: true, _count: { select: { registrations: true } },
    },
  });

  const now = new Date();
  const upcoming = events.filter((e) => e.startDate >= now);
  const past = events.filter((e) => e.startDate < now);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Create and manage events.</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <EventTabs
        upcomingCount={upcoming.length}
        pastCount={past.length}
        upcomingContent={<EventTable events={upcoming} />}
        pastContent={<EventTable events={past} />}
      />
    </div>
  );
}
