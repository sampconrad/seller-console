import { apiService } from '@/services/api';
import { fileService } from '@/services/fileService';
import { storageService } from '@/services/storage';
import { ErrorInfo, ReactNode } from 'react';

// Core entity types
export interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface State {
  hasError: boolean;
  error?: Error;
}
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
  opportunityFilters: OpportunityFilters;
  sortConfig: SortConfig;
  opportunitySortConfig: OpportunitySortConfig;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
}

export interface OpportunityFilters {
  search: string;
  stage: OpportunityStage | 'all';
}

export interface SortConfig {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

export interface OpportunitySortConfig {
  field: keyof Opportunity;
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
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
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
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
}

export interface SidebarDataManagementProps {
  activeTab: 'leads' | 'opportunities';
  onNewLead: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onGenerateReport?: () => void;
  className?: string;
}

export interface FooterProps {
  className?: string;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterProps {
  options: FilterOption[];
  activeValue: string;
  onFilterChange: (value: string) => void;
  type: 'lead' | 'opportunity';
  className?: string;
}

export interface ScoreDialProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export interface SidebarProps {
  activeTab: 'leads' | 'opportunities';
  onTabChange: (tab: 'leads' | 'opportunities') => void;
  onImportLeads: (format: 'json' | 'csv') => void;
  onExportLeads: (format: 'json' | 'csv') => void;
  onNewLead: () => void;
  onGenerateReport?: () => void;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export interface FormatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormatSelect: (format: 'json' | 'csv') => void;
  title: string;
  description: string;
}

export interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (lead: Lead) => void;
}

export interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  mode: 'create' | 'edit';
}

export interface LeadsTableProps {
  onLeadSelect: (lead: Lead) => void;
  onNewLeadRef?: React.MutableRefObject<(() => void) | null>;
}

export interface OpportunityDetailPanelProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface OpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  lead: Lead | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchboxProps {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear?: () => void;
  searchPlaceholder?: string;
  totalItems: number;
  itemLabel: string;
  className?: string;
  // Pagination data for "Showing X to Y of Z results"
  currentPage?: number;
  itemsPerPage?: number;
}

export interface SidebarContentProps {
  activeTab: 'leads' | 'opportunities';
  onTabChange: (tab: 'leads' | 'opportunities') => void;
  leadStatusOptions: FilterOption[];
  opportunityStageOptions: FilterOption[];
  leadFilters: { status: LeadStatus | 'all' };
  opportunityFilters: { stage: OpportunityStage | 'all' };
  onLeadFilterChange: (value: LeadStatus | 'all') => void;
  onOpportunityFilterChange: (value: OpportunityStage | 'all') => void;
  onNewLead: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onGenerateReport?: () => void;
  onMobileClose?: () => void;
}

export interface SidebarFiltersProps {
  activeTab: 'leads' | 'opportunities';
  leadStatusOptions: FilterOption[];
  opportunityStageOptions: FilterOption[];
  leadFilters: { status: LeadStatus | 'all' };
  opportunityFilters: { stage: OpportunityStage | 'all' };
  onLeadFilterChange: (value: LeadStatus | 'all') => void;
  onOpportunityFilterChange: (value: OpportunityStage | 'all') => void;
  onMobileClose?: () => void;
}

export interface SidebarHeaderProps {
  variant: 'mobile' | 'desktop';
  onClose?: () => void;
}

export interface SidebarNavigationProps {
  activeTab: 'leads' | 'opportunities';
  onTabChange: (tab: 'leads' | 'opportunities') => void;
  onMobileClose?: () => void;
}

export interface SidebarWrapperProps {
  variant: 'mobile' | 'desktop';
  children: React.ReactNode;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export interface FilterChartProps {
  filterOptions: FilterOption[];
  title: string;
  type: 'lead' | 'opportunity';
  onSegmentClick?: (value: string) => void;
}

export interface MobileHeaderProps {
  activeTab: string;
  tabs: TabConfig[];
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  className?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export interface FocusManagementOptions {
  enabled?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ServiceContainer {
  apiService: typeof apiService;
  fileService: typeof fileService;
  storageService: typeof storageService;
}

export interface ReportData {
  leads: Lead[];
  opportunities: Opportunity[];
  leadStatusOptions: Array<{ value: string; label: string; count: number }>;
  opportunityStageOptions: Array<{
    value: string;
    label: string;
    count: number;
  }>;
  generatedAt: Date;
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
  convertToOpportunity: (
    leadId: string,
    opportunityData: OpportunityFormData
  ) => Promise<void>;
  importLeads: (file: File) => Promise<ImportResult>;
  exportLeads: (options: ExportOptions) => void;
}

export interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  filters: OpportunityFilters;
  sortConfig: OpportunitySortConfig;
  updateFilters: (filters: Partial<OpportunityFilters>) => void;
  updateSearch: (search: string) => void;
  updateSort: (field: keyof Opportunity, direction: 'asc' | 'desc') => void;
  updateOpportunity: (
    id: string,
    updates: Partial<Opportunity>
  ) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
}

// Keyboard navigation types
export interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  enabled?: boolean;
}
