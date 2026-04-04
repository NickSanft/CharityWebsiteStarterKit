import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });

  if (format === 'csv') {
    const headers = ['Name', 'Email', 'Phone', 'Guests', 'Registered At'];
    const rows = registrations.map((r) => [
      r.name,
      r.email,
      r.phone || '',
      r.headcount.toString(),
      r.createdAt.toISOString().split('T')[0],
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations-${id}.csv"`,
      },
    });
  }

  return NextResponse.json(registrations);
}
