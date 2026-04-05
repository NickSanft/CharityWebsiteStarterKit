'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Trash2, Loader2 } from 'lucide-react';

interface VolunteerActionsProps {
  volunteerId: string;
  volunteerEmail: string;
  volunteerName: string;
}

export function VolunteerActions({ volunteerId, volunteerEmail, volunteerName }: VolunteerActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [emailOpen, setEmailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  async function handleSendEmail() {
    if (!subject || !message) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/volunteers/${volunteerId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });
      if (res.ok) {
        toast({ title: 'Email sent successfully' });
        setEmailOpen(false);
        setSubject('');
        setMessage('');
      } else {
        toast({ title: 'Failed to send email', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to send email', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/volunteers/${volunteerId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Volunteer deleted' });
        router.push('/admin/volunteers');
        router.refresh();
      } else {
        toast({ title: 'Failed to delete', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to {volunteerName}</DialogTitle>
            <DialogDescription>Send a message to {volunteerEmail}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input id="email-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Message</Label>
              <Textarea id="email-body" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Write your message..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmail} disabled={loading || !subject || !message}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Volunteer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {volunteerName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
