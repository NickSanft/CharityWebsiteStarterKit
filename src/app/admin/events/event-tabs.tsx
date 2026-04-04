'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface EventTabsProps {
  upcomingCount: number;
  pastCount: number;
  upcomingContent: React.ReactNode;
  pastContent: React.ReactNode;
}

export function EventTabs({ upcomingCount, pastCount, upcomingContent, pastContent }: EventTabsProps) {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
        <TabsTrigger value="past">Past ({pastCount})</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <Card>
          <CardContent className="pt-6">{upcomingContent}</CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="past">
        <Card>
          <CardContent className="pt-6">{pastContent}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
