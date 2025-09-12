/**
 * Left sidebar dashboard control panel
 */

import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useLeads } from '@/hooks/useLeads';
import { useOpportunities } from '@/hooks/useOpportunities';
import { LeadStatus, OpportunityStage } from '@/types';
import { CircleDollarSign, Menu, Pin, TrendingUp, Users, X } from 'lucide-react';
import React, { useState } from 'react';
import FormatSelectionModal from './FormatSelectionModal';
import DataManagementSection from './ui/DataManagementSection';
import Footer from './ui/Footer';
import QuickFilter from './ui/QuickFilter';

interface DashboardPanelProps {
  activeTab: 'leads' | 'opportunities';
  onTabChange: (tab: 'leads' | 'opportunities') => void;
  onImportLeads: (format: 'json' | 'csv') => void;
  onExportLeads: (format: 'json' | 'csv') => void;
  onNewLead: () => void;
}

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

  const handleQuickFilter = (status: LeadStatus | 'all') => {
    updateLeadFilters({ status });
  };

  const handleOpportunityQuickFilter = (stage: OpportunityStage | 'all') => {
    updateOpportunityFilters({ stage });
  };

  return (
    <>
      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between'>
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
          {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
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
          <div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0'>
            <div className='flex items-center space-x-2'>
              <CircleDollarSign className='w-6 h-6 text-yellow-400' />
              <h1 className='text-lg font-semibold text-gray-900'>Seller Console</h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'>
              <X className='w-5 h-5' />
            </button>
          </div>
          <div className='flex-1 flex flex-col overflow-y-auto'>
            {/* Mobile Navigation */}
            <div className='p-6 space-y-2'>
              <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-4'>
                Navigation
              </h2>
              <button
                onClick={() => {
                  onTabChange('leads');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'leads'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}>
                <Users className='w-5 h-5' />
                <span className='font-medium'>Leads</span>
              </button>
              <button
                onClick={() => {
                  onTabChange('opportunities');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'opportunities'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}>
                <TrendingUp className='w-5 h-5' />
                <span className='font-medium'>Opportunities</span>
              </button>
            </div>

            {/* Mobile Quick Filters */}
            <div className='p-6 space-y-4'>
              <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Filters</h2>

              {activeTab === 'leads' ? (
                <QuickFilter
                  options={leadStatusOptions}
                  activeValue={leadFilters.status}
                  onFilterChange={(value) => {
                    handleQuickFilter(value as LeadStatus | 'all');
                    setIsMobileMenuOpen(false);
                  }}
                  type='lead'
                />
              ) : (
                <QuickFilter
                  options={opportunityStageOptions}
                  activeValue={opportunityFilters.stage}
                  onFilterChange={(value) => {
                    handleOpportunityQuickFilter(value as OpportunityStage | 'all');
                    setIsMobileMenuOpen(false);
                  }}
                  type='opportunity'
                />
              )}
            </div>

            {/* Mobile Data Management - Pushed to bottom */}
            <div className='p-6 mt-auto'>
              <DataManagementSection
                activeTab={activeTab}
                onNewLead={() => {
                  onNewLead();
                  setIsMobileMenuOpen(false);
                }}
                onImportClick={() => {
                  handleImportClick();
                  setIsMobileMenuOpen(false);
                }}
                onExportClick={() => {
                  handleExportClick();
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>

            {/* Mobile Footer */}
            <Footer />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className='w-80 bg-white border-r border-gray-200 h-screen sticky top-0 hidden lg:flex flex-col overflow-y-auto'>
        {/* Desktop Header */}
        <div className='p-6 border-b border-gray-200 flex items-center space-x-2'>
          <CircleDollarSign className='w-7 h-7 text-yellow-400' />
          <h1 className='text-xl font-semibold text-gray-900'>Seller Console</h1>
        </div>

        {/* Desktop Navigation */}
        <div className='p-6 space-y-2'>
          <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-4'>
            Navigation
          </h2>
          <button
            onClick={() => onTabChange('leads')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'leads'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50 border border-transparent'
            }`}>
            <Users className='w-5 h-5' />
            <span className='font-medium'>Leads</span>
          </button>
          <button
            onClick={() => onTabChange('opportunities')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'opportunities'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'text-gray-700 hover:bg-gray-50 border border-transparent'
            }`}>
            <TrendingUp className='w-5 h-5' />
            <span className='font-medium'>Opportunities</span>
          </button>
        </div>

        {/* Desktop Quick Filters */}
        <div className='p-6 space-y-4'>
          <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Filters</h2>

          {activeTab === 'leads' ? (
            <QuickFilter
              options={leadStatusOptions}
              activeValue={leadFilters.status}
              onFilterChange={(value) => handleQuickFilter(value as LeadStatus | 'all')}
              type='lead'
            />
          ) : (
            <QuickFilter
              options={opportunityStageOptions}
              activeValue={opportunityFilters.stage}
              onFilterChange={(value) =>
                handleOpportunityQuickFilter(value as OpportunityStage | 'all')
              }
              type='opportunity'
            />
          )}
        </div>

        {/* DDesktop ata Management Actions */}
        <div className='p-6 mt-auto'>
          <DataManagementSection
            activeTab={activeTab}
            onNewLead={onNewLead}
            onImportClick={handleImportClick}
            onExportClick={handleExportClick}
          />
        </div>

        {/* Desktop Footer */}
        <Footer />
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
