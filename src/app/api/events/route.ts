import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const published = searchParams.get('published');

  const where: Record<string, unknown> = {};
  if (published === 'true') where.published = true;

  const events = await prisma.event.findMany({
    where,
    orderBy: { startDate: 'desc' },
    include: { _count: { select: { registrations: true } } },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, coverImage, location, virtualLink, startDate, endDate, capacity, published } = body;

  if (!title || !description || !location || !startDate || !endDate) {
    return NextResponse.json({ error: 'Title, description, location, and dates are required' }, { status: 400 });
  }

  let slug = body.slug || slugify(title);

  // Ensure unique slug
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const event = await prisma.event.create({
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

  return NextResponse.json(event, { status: 201 });
}
