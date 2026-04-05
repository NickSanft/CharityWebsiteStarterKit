import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an amount in cents as a currency string.
 * @param amountInCents - The amount in cents
 * @param currency - ISO 4217 currency code (default: 'usd')
 * @returns Formatted currency string (e.g. "$12.50")
 */
export function formatCurrency(amountInCents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

/**
 * Format a date as a human-readable string (e.g. "January 1, 2025").
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a date with time (e.g. "January 1, 2025, 3:00 PM").
 * @param date - Date object or ISO string
 * @returns Formatted date-time string
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Convert text into a URL-friendly slug.
 * @param text - The text to slugify
 * @returns Lowercase, hyphen-separated slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a maximum length, appending "..." if truncated.
 * @param text - The text to truncate
 * @param length - Maximum character length
 * @returns Truncated string
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '...';
}
