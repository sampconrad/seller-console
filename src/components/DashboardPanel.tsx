/**
 * Left sidebar dashboard control panel
 */

import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useLeads } from '@/hooks/useLeads';
import { useOpportunities } from '@/hooks/useOpportunities';
import { DashboardPanelProps, LeadStatus, OpportunityStage } from '@/types';
import { Menu, TrendingUp, Users, X } from 'lucide-react';
import React, { useState } from 'react';
import FormatSelectionModal from './FormatSelectionModal';
import SidebarContent from './ui/SidebarContent';
import SidebarHeader from './ui/SidebarHeader';

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  activeTab,
  onTabChange,
  onImportLeads,
  onExportLeads,
  onNewLead,
}) => {
  const { filters: leadFilters, updateFilters: updateLeadFilters } = useLeads();
  const { filters: opportunityFilters, updateFilters: updateOpportunityFilters } =
    useOpportunities();
  const { leadStatusOptions, opportunityStageOptions } = useFilterOptions();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const handleImportFormatSelect = (format: 'json' | 'csv') => {
    onImportLeads(format);
  };

  const handleExportFormatSelect = (format: 'json' | 'csv') => {
    onExportLeads(format);
  };

  const handleFilter = (status: LeadStatus | 'all') => {
    updateLeadFilters({ status });
  };

  const handleOpportunityFilter = (stage: OpportunityStage | 'all') => {
    updateOpportunityFilters({ stage });
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div
        className={`lg:hidden border-b border-gray-200 px-4 py-3 flex items-center justify-between ${
          activeTab === 'leads' ? 'bg-blue-50' : 'bg-green-50'
        }`}>
        <div className='flex items-center space-x-2'>
          {activeTab === 'leads' ? (
            <>
              <Users className='w-5 h-5 text-blue-600' />
              <h1 className='text-lg font-semibold text-gray-900'>Leads</h1>
            </>
          ) : (
            <>
              <TrendingUp className='w-5 h-5 text-green-600' />
              <h1 className='text-lg font-semibold text-gray-900'>Opportunities</h1>
            </>
          )}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'>
          {isMobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      {/* Mobile Sidemenu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}>
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden='true'
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}>
          <SidebarHeader
            variant='mobile'
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <SidebarContent
            activeTab={activeTab}
            onTabChange={onTabChange}
            leadStatusOptions={leadStatusOptions}
            opportunityStageOptions={opportunityStageOptions}
            leadFilters={leadFilters}
            opportunityFilters={opportunityFilters}
            onLeadFilterChange={handleFilter}
            onOpportunityFilterChange={handleOpportunityFilter}
            onNewLead={onNewLead}
            onImportClick={handleImportClick}
            onExportClick={handleExportClick}
            onMobileClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className='w-80 bg-white border-r border-gray-200 h-screen sticky top-0 hidden lg:flex flex-col overflow-y-auto'>
        <SidebarHeader variant='desktop' />
        <SidebarContent
          activeTab={activeTab}
          onTabChange={onTabChange}
          leadStatusOptions={leadStatusOptions}
          opportunityStageOptions={opportunityStageOptions}
          leadFilters={leadFilters}
          opportunityFilters={opportunityFilters}
          onLeadFilterChange={handleFilter}
          onOpportunityFilterChange={handleOpportunityFilter}
          onNewLead={onNewLead}
          onImportClick={handleImportClick}
          onExportClick={handleExportClick}
        />
      </div>

      {/* Import Format Selection Modal */}
      <FormatSelectionModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onFormatSelect={handleImportFormatSelect}
        title='Import Leads'
        description='Select the format for importing leads data.'
      />

      {/* Export Format Selection Modal */}
      <FormatSelectionModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onFormatSelect={handleExportFormatSelect}
        title='Export Leads'
        description='Select the format for exporting leads data.'
      />
    </>
  );
};

export default DashboardPanel;
