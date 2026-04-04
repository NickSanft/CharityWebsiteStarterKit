'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2 } from 'lucide-react';

interface RegistrationFormProps {
  eventId: string;
  maxHeadcount: number | null;
}

export function RegistrationForm({ eventId, maxHeadcount }: RegistrationFormProps) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || null,
          headcount: parseInt(formData.get('headcount') as string) || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
        <p className="font-medium">You&apos;re registered!</p>
        <p className="text-sm text-muted-foreground">Check your email for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="reg-name">Name</Label>
        <Input id="reg-name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <Input id="reg-email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-phone">Phone (optional)</Label>
        <Input id="reg-phone" name="phone" type="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-headcount">Number of Guests</Label>
        <Input
          id="reg-headcount"
          name="headcount"
          type="number"
          min={1}
          max={maxHeadcount ?? 10}
          defaultValue={1}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Registering...' : 'Register Now'}
      </Button>
    </form>
  );
}
