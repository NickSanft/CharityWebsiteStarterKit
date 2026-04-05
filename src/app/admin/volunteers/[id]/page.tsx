import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { VolunteerStatusSelect } from '../volunteer-status-select';
import { VolunteerActions } from './volunteer-actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VolunteerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const volunteer = await prisma.volunteer.findUnique({ where: { id } });

  if (!volunteer) notFound();

  const interests = Array.isArray(volunteer.interests)
    ? (volunteer.interests as string[])
    : typeof volunteer.interests === 'string'
      ? JSON.parse(volunteer.interests as string)
      : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/volunteers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Volunteers
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{volunteer.name}</h1>
          <p className="text-muted-foreground">Volunteer since {formatDate(volunteer.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <VolunteerStatusSelect volunteerId={volunteer.id} currentStatus={volunteer.status} />
          <VolunteerActions volunteerId={volunteer.id} volunteerEmail={volunteer.email} volunteerName={volunteer.name} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${volunteer.email}`} className="text-primary hover:underline">
                {volunteer.email}
              </a>
            </div>
            {volunteer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${volunteer.phone}`} className="hover:underline">
                  {volunteer.phone}
                </a>
              </div>
            )}
            {volunteer.availability && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>{volunteer.availability}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interests & Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interests & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {interests.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Areas of Interest</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest: string) => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              <Badge variant={
                volunteer.status === 'ACTIVE' ? 'default' :
                volunteer.status === 'NEW' ? 'secondary' :
                volunteer.status === 'CONTACTED' ? 'outline' : 'destructive'
              }>
                {volunteer.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm">{formatDateTime(volunteer.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message */}
      {volunteer.message && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{volunteer.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
