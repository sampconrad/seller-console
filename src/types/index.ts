// Core entity types
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  leadId: string; // Reference to original lead
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  UNQUALIFIED = 'unqualified',
  CONVERTED = 'converted',
}

export enum OpportunityStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

// UI State types
export interface AppState {
  leads: Lead[];
  opportunities: Opportunity[];
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  filters: LeadFilters;
  sortConfig: SortConfig;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
}

export interface SortConfig {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

// Form types
export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: LeadStatus;
}

export interface OpportunityFormData {
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// File import/export types
export interface ImportResult {
  success: boolean;
  data: Lead[];
  errors: string[];
  importedCount: number;
}

export interface ExportOptions {
  format: 'json' | 'csv';
  includeOpportunities: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Component prop types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface HeaderProps {
  activeTab: 'leads' | 'opportunities';
  onTabChange: (tab: 'leads' | 'opportunities') => void;
}

// Hook return types
export interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  filters: LeadFilters;
  sortConfig: SortConfig;
  updateFilters: (filters: Partial<LeadFilters>) => void;
  updateSort: (field: keyof Lead, direction: 'asc' | 'desc') => void;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  convertToOpportunity: (leadId: string, opportunityData: OpportunityFormData) => Promise<void>;
  importLeads: (file: File) => Promise<ImportResult>;
  exportLeads: (options: ExportOptions) => void;
}

export interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
}
