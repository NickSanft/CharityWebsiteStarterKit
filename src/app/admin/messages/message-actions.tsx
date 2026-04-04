'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageActionsProps {
  messageId: string;
  isRead: boolean;
}

export function MessageActions({ messageId, isRead }: MessageActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const toggleRead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !isRead }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update message status.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update message status.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
        toast({ title: 'Message deleted' });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete message.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete message.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleRead}
        disabled={loading}
        title={isRead ? 'Mark as unread' : 'Mark as read'}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRead ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={deleteMessage}
        disabled={loading}
        title="Delete message"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
