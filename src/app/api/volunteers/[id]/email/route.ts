import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { subject, message } = await request.json();

  if (!subject || !message) {
    return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
  }

  const volunteer = await prisma.volunteer.findUnique({ where: { id } });
  if (!volunteer) {
    return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
  }

  await sendEmail({
    to: volunteer.email,
    subject,
    html: `<p>Hi ${volunteer.name},</p>${message.split('\n').map((line: string) => `<p>${line}</p>`).join('')}`,
  });

  return NextResponse.json({ success: true });
}
