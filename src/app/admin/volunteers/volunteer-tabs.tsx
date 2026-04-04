'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

interface VolunteerTabsProps {
  counts: {
    all: number;
    NEW: number;
    CONTACTED: number;
    ACTIVE: number;
    INACTIVE: number;
  };
  children: React.ReactNode;
}

export function VolunteerTabs({ counts, children }: VolunteerTabsProps) {
  const tabs = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'NEW', label: 'New', count: counts.NEW },
    { value: 'CONTACTED', label: 'Contacted', count: counts.CONTACTED },
    { value: 'ACTIVE', label: 'Active', count: counts.ACTIVE },
    { value: 'INACTIVE', label: 'Inactive', count: counts.INACTIVE },
  ];

  const childArray = React.Children.toArray(children);

  return (
    <Tabs defaultValue="all">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label} ({tab.count})
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={tab.value} value={tab.value}>
          {childArray[index]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
