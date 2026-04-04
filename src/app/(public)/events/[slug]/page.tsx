import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, MapPin, Users, Video, CalendarPlus } from 'lucide-react';
import { RegistrationForm } from './registration-form';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: { select: { registrations: true } },
      registrations: { select: { headcount: true } },
    },
  });

  if (!event || !event.published) {
    notFound();
  }

  const totalRegistered = event.registrations.reduce((sum, r) => sum + r.headcount, 0);
  const isFull = event.capacity !== null && totalRegistered >= event.capacity;
  const spotsLeft = event.capacity !== null ? event.capacity - totalRegistered : null;
  const isPast = event.endDate < new Date();

  const mapsUrl = event.location.toLowerCase() !== 'virtual'
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link href="/events">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>
      </Link>

      {event.coverImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {isPast && <Badge variant="secondary">Past Event</Badge>}
            {isFull && !isPast && <Badge variant="destructive">Event Full</Badge>}
            {spotsLeft !== null && spotsLeft > 0 && !isPast && (
              <Badge variant="outline">{spotsLeft} spots left</Badge>
            )}
          </div>

          <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.description}</ReactMarkdown>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatDateTime(event.startDate)}</p>
                  <p className="text-sm text-muted-foreground">to {formatDateTime(event.endDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  {mapsUrl ? (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {event.location}
                    </a>
                  ) : (
                    <p className="font-medium">{event.location}</p>
                  )}
                </div>
              </div>

              {event.virtualLink && (
                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    Join Online
                  </a>
                </div>
              )}

              {event.capacity !== null && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{totalRegistered} / {event.capacity} registered</p>
                    {spotsLeft !== null && spotsLeft > 0 && (
                      <p className="text-sm text-muted-foreground">{spotsLeft} spots remaining</p>
                    )}
                  </div>
                </div>
              )}

              <Button asChild variant="outline" className="w-full" size="sm">
                <a href={`/api/events/${event.id}/calendar`} download>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Add to Calendar
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Registration Form */}
          {!isPast && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Register</CardTitle>
              </CardHeader>
              <CardContent>
                {isFull ? (
                  <p className="text-sm text-muted-foreground">
                    This event is at full capacity. Please check back later for cancellations.
                  </p>
                ) : (
                  <RegistrationForm eventId={event.id} maxHeadcount={spotsLeft} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
