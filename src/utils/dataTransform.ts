/**
 * Data transformation utilities for sorting, filtering, and formatting
 */

import type { Lead, LeadFilters, SortConfig } from '@/types';

/**
 * Sort leads based on the provided configuration
 */
export const sortLeads = (leads: Lead[], sortConfig: SortConfig): Lead[] => {
  return [...leads].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    if (aValue === bValue) return 0;

    let comparison = 0;
    if (aValue < bValue) {
      comparison = -1;
    } else if (aValue > bValue) {
      comparison = 1;
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Filter leads based on search and status filters
 */
export const filterLeads = (leads: Lead[], filters: LeadFilters): Lead[] => {
  return leads.filter((lead) => {
    // Search filter (name or company)
    const searchMatch =
      !filters.search ||
      lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.company.toLowerCase().includes(filters.search.toLowerCase());

    // Status filter
    const statusMatch = filters.status === 'all' || lead.status === filters.status;

    return searchMatch && statusMatch;
  });
};

/**
 * Format currency values
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format date values
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format date and time values
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Get status badge color class
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    unqualified: 'bg-red-100 text-red-800',
    converted: 'bg-purple-100 text-purple-800',
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get stage badge color class
 */
export const getStageColor = (stage: string): string => {
  const stageColors: Record<string, string> = {
    prospecting: 'bg-blue-100 text-blue-800',
    qualification: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-orange-100 text-orange-800',
    negotiation: 'bg-purple-100 text-purple-800',
    closed_won: 'bg-green-100 text-green-800',
    closed_lost: 'bg-red-100 text-red-800',
  };

  return stageColors[stage] || 'bg-gray-100 text-gray-800';
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Calculate lead score color based on value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Format source values to be user-friendly
 */
export const formatSource = (source: string): string => {
  const sourceMap: Record<string, string> = {
    website: 'Website',
    referral: 'Referral',
    cold_call: 'Cold Call',
    email: 'Email',
    social_media: 'Social Media',
    advertisement: 'Advertisement',
    trade_show: 'Trade Show',
    other: 'Other',
  };
  return sourceMap[source] || source;
};

/**
 * Format stage values to be user-friendly
 */
export const formatStage = (stage: string): string => {
  const stageMap: Record<string, string> = {
    prospecting: 'Prospecting',
    qualification: 'Qualification',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
  };
  return stageMap[stage] || stage;
};

/**
 * Parse currency string to number (removes $ and commas)
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[$,]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Format currency with custom options
 */
export const formatCurrencyCustom = (value: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(value);
};
