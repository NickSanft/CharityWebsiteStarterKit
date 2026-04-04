import type { Post, Event, Volunteer, Donation, ContactSubmission, SiteSettings } from '@prisma/client';

// Re-export Prisma types for convenience
export type { Post, Event, Volunteer, Donation, ContactSubmission, SiteSettings };

// Extended types with relations
export type PostWithAuthor = Post & {
  author: { id: string; name: string };
};

export type EventWithRegistrationCount = Event & {
  _count: { registrations: number };
};

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard stats
export interface DashboardStats {
  totalPosts: number;
  upcomingEvents: number;
  newVolunteersThisMonth: number;
  donationsThisMonth: number;
  totalDonationsThisMonth: number;
}
