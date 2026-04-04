import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
    });

    if (!volunteer) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error('Failed to fetch volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const validStatuses = ['NEW', 'CONTACTED', 'ACTIVE', 'INACTIVE'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 },
      );
    }

    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error('Failed to update volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to update volunteer' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.volunteer.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to delete volunteer' },
      { status: 500 },
    );
  }
}
