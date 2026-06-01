// ============================================================
// AgentFlow — Utility Helpers
// ============================================================

import { format, formatDistanceToNow, isAfter } from 'date-fns';
import { id as idLocale, enUS } from 'date-fns/locale';

/**
 * Format currency in Indonesian Rupiah or USD
 */
export function formatCurrency(amount: number, locale: string = 'id'): string {
  if (locale === 'id') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, locale: string = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd MMM yyyy', {
    locale: locale === 'id' ? idLocale : enUS,
  });
}

/**
 * Get relative time string
 */
export function timeAgo(date: string | Date, locale: string = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, {
    addSuffix: true,
    locale: locale === 'id' ? idLocale : enUS,
  });
}

/**
 * Check if a date is past due
 */
export function isPastDue(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return isAfter(new Date(), d);
}

/**
 * Generate a unique invoice number
 */
export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `INV-${year}${month}-${seq}`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate tax (default 11% PPN Indonesia)
 */
export function calculateTax(amount: number, rate: number = 0.11): number {
  return Math.round(amount * rate);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * cn — simple className joiner (replaces clsx/twMerge for vanilla CSS)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
