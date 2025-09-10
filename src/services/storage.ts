/**
 * Local storage service for persisting application state
 */

import type { Lead, LeadFilters, LeadStatus, Opportunity, SortConfig } from '@/types';

const STORAGE_KEYS = {
  LEADS: 'coverpin_leads',
  OPPORTUNITIES: 'coverpin_opportunities',
  FILTERS: 'coverpin_filters',
  SORT_CONFIG: 'coverpin_sort_config',
  SAMPLE_DATA_LOADED: 'coverpin_sample_data_loaded',
} as const;

/**
 * Generic storage service with error handling
 */
class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
    }
  }

  // Leads
  getLeads(): Lead[] {
    const leads = this.getItem(STORAGE_KEYS.LEADS, []);
    // Convert string dates to Date objects
    return leads.map((lead: any) => ({
      ...lead,
      createdAt: new Date(lead.createdAt),
      updatedAt: new Date(lead.updatedAt),
    }));
  }

  setLeads(leads: Lead[]): void {
    this.setItem(STORAGE_KEYS.LEADS, leads);
  }

  // Opportunities
  getOpportunities(): Opportunity[] {
    const opportunities = this.getItem(STORAGE_KEYS.OPPORTUNITIES, []);
    // Convert string dates to Date objects
    return opportunities.map((opportunity: any) => ({
      ...opportunity,
      createdAt: new Date(opportunity.createdAt),
      updatedAt: new Date(opportunity.updatedAt),
    }));
  }

  setOpportunities(opportunities: Opportunity[]): void {
    this.setItem(STORAGE_KEYS.OPPORTUNITIES, opportunities);
  }

  // Filters (only save status, not search)
  getFilters(): LeadFilters {
    const savedFilters = this.getItem(STORAGE_KEYS.FILTERS, { status: 'all' });
    return {
      search: '', // Always start with empty search
      status: savedFilters.status as LeadStatus | 'all',
    };
  }

  setFilters(filters: LeadFilters): void {
    // Only save the status filter, not the search
    this.setItem(STORAGE_KEYS.FILTERS, { status: filters.status });
  }

  // Sort config
  getSortConfig(): SortConfig {
    return this.getItem(STORAGE_KEYS.SORT_CONFIG, {
      field: 'score',
      direction: 'desc',
    });
  }

  setSortConfig(sortConfig: SortConfig): void {
    this.setItem(STORAGE_KEYS.SORT_CONFIG, sortConfig);
  }

  // Sample data flag methods
  hasSampleDataBeenLoaded(): boolean {
    return this.getItem(STORAGE_KEYS.SAMPLE_DATA_LOADED, false);
  }

  setSampleDataLoaded(): void {
    this.setItem(STORAGE_KEYS.SAMPLE_DATA_LOADED, true);
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
