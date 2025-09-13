/**
 * Main application component
 */

import ErrorBoundary from '@/components/error/ErrorBoundary';
import OpportunityForm from '@/components/forms/OpportunityForm';
import LeadDetailPanel from '@/components/panels/LeadDetailPanel';
import Sidebar from '@/components/sidebar/Sidebar';
import LeadsTable from '@/components/tables/LeadsTable';
import OpportunitiesTable from '@/components/tables/OpportunitiesTable';
import Toast from '@/components/ui/Toast';
import { AppProvider, useApp } from '@/context/AppContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useLeads } from '@/hooks/useLeads';
import { ServiceProvider } from '@/services/ServiceContainer';
import { Lead } from '@/types';
import React, { useRef, useState } from 'react';

const AppContent: React.FC = () => {
  const { importLeads, exportLeads } = useLeads();
  const { leadStatusOptions, opportunityStageOptions } = useFilterOptions();
  const { state } = useApp();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities'>(
    'leads'
  );
  const newLeadRef = useRef<(() => void) | null>(null);

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailPanelOpen(true);
  };

  const handleLeadConvert = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConversionModalOpen(true);
  };

  const handleConversionSuccess = () => {
    setIsDetailPanelOpen(false);
    setSelectedLead(null);
    setIsConversionModalOpen(false);
  };

  const handleImportClick = async (format: 'json' | 'csv') => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = format === 'json' ? '.json' : '.csv';
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await importLeads(file);
      }
    };
    input.click();
  };

  const handleExportClick = async (format: 'json' | 'csv') => {
    await exportLeads({ format, includeOpportunities: false });
  };

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedLead(null);
  };

  const handleCloseConversionModal = () => {
    setIsConversionModalOpen(false);
  };

  const handleNewLead = () => {
    if (newLeadRef.current) {
      newLeadRef.current();
    }
  };

  const handleGenerateReport = async () => {
    try {
      const { PDFService } = await import('@/services/pdfService'); // Lazy loading PDF service to reduce initial bundle size

      const reportData = {
        leads: state.leads,
        opportunities: state.opportunities,
        leadStatusOptions,
        opportunityStageOptions,
        generatedAt: new Date(),
      };

      await PDFService.generateReport(reportData);
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
    }
  };

  return (
    <div className='h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden'>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onImportLeads={handleImportClick}
        onExportLeads={handleExportClick}
        onNewLead={handleNewLead}
        onGenerateReport={handleGenerateReport}
      />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-h-0 min-w-0 max-w-full'>
        <main className='flex-1 px-4 sm:px-6 lg:px-8 py-4 lg:py-8 w-full min-w-0 max-w-full overflow-hidden'>
          {activeTab === 'leads' ? (
            <LeadsTable
              onLeadSelect={handleLeadSelect}
              onNewLeadRef={newLeadRef}
            />
          ) : (
            <OpportunitiesTable />
          )}
        </main>
      </div>
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        onConvert={handleLeadConvert}
      />
      <OpportunityForm
        isOpen={isConversionModalOpen}
        onClose={handleCloseConversionModal}
        onSuccess={handleConversionSuccess}
        lead={selectedLead}
      />
      <Toast />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ServiceProvider>
        <AppProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AppProvider>
      </ServiceProvider>
    </ErrorBoundary>
  );
};

export default App;
