/**
 * Data transformation utilities for sorting, filtering, and formatting
 */

import type { Lead, LeadFilters, Opportunity, OpportunitySortConfig, SortConfig } from '@/types';

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
 * Sort opportunities based on the provided configuration
 */
export const sortOpportunities = (
  opportunities: Opportunity[],
  sortConfig: OpportunitySortConfig
): Opportunity[] => {
  return [...opportunities].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
    if (bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

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
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

/**
 * Get stage badge color class
 */
export const getStageColor = (stage: string): string => {
  return STAGE_COLORS[stage as keyof typeof STAGE_COLORS] || STAGE_COLORS.default;
};

// Pre-defined color objects to avoid creating new objects on every call
const INACTIVE_COLORS = {
  button: 'text-gray-700 hover:bg-gray-50 border border-transparent',
  count: 'bg-gray-100 text-gray-600',
};

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  unqualified: 'bg-red-100 text-red-800',
  converted: 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800',
};

const STAGE_COLORS = {
  prospecting: 'bg-blue-100 text-blue-800',
  qualification: 'bg-yellow-100 text-yellow-800',
  proposal: 'bg-orange-100 text-orange-800',
  negotiation: 'bg-purple-100 text-purple-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

const SCORE_COLORS = {
  high: 'text-green-600', // >= 80
  medium: 'text-yellow-600', // >= 60
  low: 'text-orange-600', // >= 40
  veryLow: 'text-red-600', // < 40
};

const LEAD_COLORS = {
  new: {
    button: 'bg-gray-50 text-gray-700 border border-gray-200',
    count: 'bg-gray-100 text-gray-600',
  },
  contacted: {
    button: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    count: 'bg-yellow-100 text-yellow-600',
  },
  qualified: {
    button: 'bg-green-50 text-green-700 border border-green-200',
    count: 'bg-green-100 text-green-600',
  },
  unqualified: {
    button: 'bg-red-50 text-red-700 border border-red-200',
    count: 'bg-red-100 text-red-600',
  },
  converted: {
    button: 'bg-purple-50 text-purple-700 border border-purple-200',
    count: 'bg-purple-100 text-purple-600',
  },
  all: {
    button: 'bg-blue-50 text-blue-700 border border-blue-200',
    count: 'bg-blue-100 text-blue-600',
  },
};

const OPPORTUNITY_COLORS = {
  prospecting: {
    button: 'bg-gray-50 text-gray-700 border border-gray-200',
    count: 'bg-gray-100 text-gray-600',
  },
  qualification: {
    button: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    count: 'bg-yellow-100 text-yellow-600',
  },
  proposal: {
    button: 'bg-orange-50 text-orange-700 border border-orange-200',
    count: 'bg-orange-100 text-orange-600',
  },
  negotiation: {
    button: 'bg-purple-50 text-purple-700 border border-purple-200',
    count: 'bg-purple-100 text-purple-600',
  },
  closed_won: {
    button: 'bg-green-50 text-green-700 border border-green-200',
    count: 'bg-green-100 text-green-600',
  },
  closed_lost: {
    button: 'bg-red-50 text-red-700 border border-red-200',
    count: 'bg-red-100 text-red-600',
  },
  all: {
    button: 'bg-blue-50 text-blue-700 border border-blue-200',
    count: 'bg-blue-100 text-blue-600',
  },
};

/**
 * Get quick filter button and count colors for leads and opportunities
 */
export const getQuickFilterColors = (
  type: 'lead' | 'opportunity',
  value: string,
  isActive: boolean
) => {
  if (!isActive) {
    return INACTIVE_COLORS;
  }

  if (type === 'lead') {
    return LEAD_COLORS[value as keyof typeof LEAD_COLORS] || LEAD_COLORS.all;
  } else {
    return OPPORTUNITY_COLORS[value as keyof typeof OPPORTUNITY_COLORS] || OPPORTUNITY_COLORS.all;
  }
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
  if (score >= 80) return SCORE_COLORS.high;
  if (score >= 60) return SCORE_COLORS.medium;
  if (score >= 40) return SCORE_COLORS.low;
  return SCORE_COLORS.veryLow;
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
export const formatCurrencyCustom = (
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(value);
};

/**
 * Format number as currency without currency symbol (for use with icon)
 */
export const formatNumber = (
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(value);
};

/**
 * Handle amount input change with validation
 * Returns the cleaned value and numeric value
 */
export const handleAmountInputChange = (
  value: string,
  onAmountChange: (amount: number | undefined) => void,
  onDisplayChange: (display: string) => void
) => {
  // Remove any non-numeric characters except dots
  let cleanedValue = value.replace(/[^0-9.]/g, '');

  // Ensure only one dot
  const dotCount = (cleanedValue.match(/\./g) || []).length;
  if (dotCount > 1) {
    const firstDotIndex = cleanedValue.indexOf('.');
    cleanedValue =
      cleanedValue.substring(0, firstDotIndex + 1) +
      cleanedValue.substring(firstDotIndex + 1).replace(/\./g, '');
  }

  // Limit to 2 decimal places
  if (cleanedValue.includes('.')) {
    const parts = cleanedValue.split('.');
    if (parts[1] && parts[1].length > 2) {
      cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
    }
  }

  // Update display value
  onDisplayChange(cleanedValue);

  // Update numeric value
  if (cleanedValue) {
    const numericValue = parseCurrency(cleanedValue);
    onAmountChange(numericValue);
  } else {
    onAmountChange(undefined);
  }
};
