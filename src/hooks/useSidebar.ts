/**
 * Custom hook for sidebar state management and handlers
 */

import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useLeads } from '@/hooks/useLeads';
import { useOpportunities } from '@/hooks/useOpportunities';
import { LeadStatus, OpportunityStage, SidebarProps } from '@/types';
import { useCallback, useMemo, useState } from 'react';

export const useSidebar = ({
  activeTab,
  onTabChange,
  onImportLeads,
  onExportLeads,
  onNewLead,
}: SidebarProps) => {
  const { filters: leadFilters, updateFilters: updateLeadFilters } = useLeads();
  const {
    filters: opportunityFilters,
    updateFilters: updateOpportunityFilters,
  } = useOpportunities();
  const { leadStatusOptions, opportunityStageOptions } = useFilterOptions();

  // Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Common handlers
  const handleImportClick = useCallback(() => setIsImportModalOpen(true), []);
  const handleExportClick = useCallback(() => setIsExportModalOpen(true), []);
  const handleFilter = useCallback(
    (status: LeadStatus | 'all') => updateLeadFilters({ status }),
    [updateLeadFilters]
  );
  const handleOpportunityFilter = useCallback(
    (stage: OpportunityStage | 'all') => updateOpportunityFilters({ stage }),
    [updateOpportunityFilters]
  );

  // Common SidebarContent props - memoized to prevent unnecessary re-renders
  const sidebarContentProps = useMemo(
    () => ({
      activeTab,
      onTabChange,
      leadStatusOptions,
      opportunityStageOptions,
      leadFilters,
      opportunityFilters,
      onLeadFilterChange: handleFilter,
      onOpportunityFilterChange: handleOpportunityFilter,
      onNewLead,
      onImportClick: handleImportClick,
      onExportClick: handleExportClick,
    }),
    [
      activeTab,
      onTabChange,
      leadStatusOptions,
      opportunityStageOptions,
      leadFilters,
      opportunityFilters,
      onNewLead,
      handleFilter,
      handleOpportunityFilter,
      handleImportClick,
      handleExportClick,
    ]
  );

  // Modal handlers
  const handleImportFormatSelect = useCallback(
    (format: 'json' | 'csv') => {
      onImportLeads(format);
      setIsImportModalOpen(false);
    },
    [onImportLeads]
  );

  const handleExportFormatSelect = useCallback(
    (format: 'json' | 'csv') => {
      onExportLeads(format);
      setIsExportModalOpen(false);
    },
    [onExportLeads]
  );

  // Mobile menu handlers
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return {
    // State
    isImportModalOpen,
    isExportModalOpen,
    isMobileMenuOpen,
    sidebarContentProps,

    // Handlers
    handleImportFormatSelect,
    handleExportFormatSelect,
    toggleMobileMenu,
    closeMobileMenu,

    // Modal controls
    setIsImportModalOpen,
    setIsExportModalOpen,
  };
};
