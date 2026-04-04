import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.orgName || !body.contactEmail) {
      return NextResponse.json(
        { error: 'Organization name and contact email are required' },
        { status: 400 },
      );
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        orgName: body.orgName,
        tagline: body.tagline ?? null,
        logoUrl: body.logoUrl ?? null,
        primaryColor: body.primaryColor ?? '#2563eb',
        secondaryColor: body.secondaryColor ?? '#16a34a',
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone ?? null,
        address: body.address ?? null,
        socialLinks: body.socialLinks ?? {},
      },
      create: {
        id: 'default',
        orgName: body.orgName,
        contactEmail: body.contactEmail,
        tagline: body.tagline ?? null,
        logoUrl: body.logoUrl ?? null,
        primaryColor: body.primaryColor ?? '#2563eb',
        secondaryColor: body.secondaryColor ?? '#16a34a',
        contactPhone: body.contactPhone ?? null,
        address: body.address ?? null,
        socialLinks: body.socialLinks ?? {},
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 },
    );
  }
}
