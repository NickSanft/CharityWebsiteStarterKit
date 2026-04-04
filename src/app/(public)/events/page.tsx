import { prisma } from '@/lib/prisma';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events and activities.',
};

export default async function EventsPage() {
  const now = new Date();

  const [upcomingEvents, pastEvents] = await Promise.all([
    prisma.event.findMany({
      where: { published: true, startDate: { gte: now } },
      orderBy: { startDate: 'asc' },
      include: { _count: { select: { registrations: true } } },
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { lt: now } },
      orderBy: { startDate: 'desc' },
      take: 6,
      include: { _count: { select: { registrations: true } } },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Events</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Join us at our upcoming events and activities.
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event._count.registrations} / {event.capacity} registered
                      </span>
                      {event._count.registrations >= event.capacity && (
                        <Badge variant="destructive" className="ml-1">Full</Badge>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Past Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <CardHeader>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
