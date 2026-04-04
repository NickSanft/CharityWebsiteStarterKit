import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EventForm } from '@/components/events/event-form';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
      <EventForm
        event={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          description: event.description,
          coverImage: event.coverImage || '',
          location: event.location,
          virtualLink: event.virtualLink || '',
          startDate: event.startDate.toISOString().slice(0, 16),
          endDate: event.endDate.toISOString().slice(0, 16),
          capacity: event.capacity?.toString() || '',
          published: event.published,
        }}
      />
    </div>
  );
}
