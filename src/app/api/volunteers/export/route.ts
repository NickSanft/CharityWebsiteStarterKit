import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['Name', 'Email', 'Phone', 'Interests', 'Availability', 'Status', 'Message', 'Signed Up'];

  const rows = volunteers.map((v) => {
    const interests = Array.isArray(v.interests)
      ? (v.interests as string[]).join('; ')
      : '';
    return [
      v.name,
      v.email,
      v.phone || '',
      interests,
      v.availability || '',
      v.status,
      (v.message || '').replace(/"/g, '""'),
      v.createdAt.toISOString().split('T')[0],
    ];
  });

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="volunteers-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
