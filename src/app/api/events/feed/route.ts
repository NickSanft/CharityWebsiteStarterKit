import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export async function GET() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: 'asc' },
  });

  const vevents = events.map((event) => [
    'BEGIN:VEVENT',
    `UID:${event.id}@opengood`,
    `DTSTART:${formatIcsDate(event.startDate)}`,
    `DTEND:${formatIcsDate(event.endDate)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description.slice(0, 500))}`,
    `LOCATION:${escapeIcs(event.location)}`,
    event.virtualLink ? `URL:${event.virtualLink}` : '',
    `DTSTAMP:${formatIcsDate(new Date())}`,
    'END:VEVENT',
  ].filter(Boolean).join('\r\n')).join('\r\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenGood//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:OpenGood Events',
    vevents,
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="events.ics"',
    },
  });
}
