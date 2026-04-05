import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { formatDateTime } from '@/lib/utils';
import { eventRegistrationEmail } from '@/lib/email-templates';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { name, email, phone, headcount = 1 } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  if (headcount < 1 || headcount > 10) {
    return NextResponse.json({ error: 'Headcount must be between 1 and 10' }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: { select: { headcount: true } },
    },
  });

  if (!event || !event.published) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  // Check capacity
  if (event.capacity !== null) {
    const totalRegistered = event.registrations.reduce((sum, r) => sum + r.headcount, 0);
    if (totalRegistered + headcount > event.capacity) {
      return NextResponse.json(
        { error: 'Not enough spots available' },
        { status: 400 },
      );
    }
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      eventId: id,
      name,
      email,
      phone: phone || null,
      headcount,
    },
  });

  // Send confirmation email (fire and forget)
  sendEmail({
    to: email,
    subject: `Registration Confirmed: ${event.title}`,
    html: eventRegistrationEmail(
      name,
      event.title,
      `${formatDateTime(event.startDate)} — ${formatDateTime(event.endDate)}`,
      event.location,
      headcount,
      event.virtualLink,
    ),
  }).catch(console.error);

  return NextResponse.json(registration, { status: 201 });
}
