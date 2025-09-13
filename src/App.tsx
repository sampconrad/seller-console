/**
 * Main application component
 */

import DashboardPanel from '@/components/DashboardPanel';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import LeadsList from '@/components/LeadsList';
import OpportunitiesList from '@/components/OpportunitiesList';
import OpportunityFormModal from '@/components/OpportunityFormModal';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ToastContainer from '@/components/ui/ToastContainer';
import { AppProvider } from '@/context/AppContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { useLeads } from '@/hooks/useLeads';
import { ServiceProvider } from '@/services/ServiceContainer';
import { Lead } from '@/types';
import React, { useRef, useState } from 'react';

const AppContent: React.FC = () => {
  const { importLeads, exportLeads } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities'>('leads');
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
    input.onchange = async (e) => {
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

  return (
    <div className='h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden'>
      <DashboardPanel
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onImportLeads={handleImportClick}
        onExportLeads={handleExportClick}
        onNewLead={handleNewLead}
      />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-h-0 min-w-0 max-w-full'>
        <main className='flex-1 px-4 sm:px-6 lg:px-8 py-4 lg:py-8 w-full min-w-0 max-w-full overflow-hidden'>
          {activeTab === 'leads' ? (
            <LeadsList
              onLeadSelect={handleLeadSelect}
              onNewLeadRef={newLeadRef}
            />
          ) : (
            <OpportunitiesList />
          )}
        </main>
      </div>
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        onConvert={handleLeadConvert}
      />
      <OpportunityFormModal
        isOpen={isConversionModalOpen}
        onClose={handleCloseConversionModal}
        onSuccess={handleConversionSuccess}
        lead={selectedLead}
      />
      <ToastContainer />
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
