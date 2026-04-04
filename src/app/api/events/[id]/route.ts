import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: true,
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, description, coverImage, location, virtualLink, startDate, endDate, capacity, published } = body;

  if (!title || !description || !location || !startDate || !endDate) {
    return NextResponse.json({ error: 'Title, description, location, and dates are required' }, { status: 400 });
  }

  let slug = body.slug || slugify(title);

  // Ensure unique slug (excluding self)
  const existing = await prisma.event.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      coverImage: coverImage || null,
      location,
      virtualLink: virtualLink || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      capacity: capacity ? parseInt(capacity) : null,
      published: published ?? false,
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
