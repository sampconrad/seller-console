/**
 * Main application component
 */

import Header from '@/components/Header';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import LeadsList from '@/components/LeadsList';
import OpportunitiesList from '@/components/OpportunitiesList';
import OpportunityFormModal from '@/components/OpportunityFormModal';
import Footer from '@/components/ui/Footer';
import ToastContainer from '@/components/ui/ToastContainer';
import { AppProvider } from '@/context/AppContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { useLeads } from '@/hooks/useLeads';
import { Lead } from '@/types';
import React, { useState } from 'react';

const AppContent: React.FC = () => {
  const { importLeads, exportLeads } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities'>('leads');

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailPanelOpen(true);
  };

  const handleLeadConvert = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConversionModalOpen(true);
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
    setSelectedLead(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className='flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full'>
        {activeTab === 'leads' ? (
          <LeadsList
            onLeadSelect={handleLeadSelect}
            onImportClick={handleImportClick}
            onExportClick={handleExportClick}
          />
        ) : (
          <OpportunitiesList />
        )}
      </main>
      <Footer />
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        onConvert={handleLeadConvert}
      />
      <OpportunityFormModal
        isOpen={isConversionModalOpen}
        onClose={handleCloseConversionModal}
        mode='create'
        lead={selectedLead}
      />
      <ToastContainer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AppProvider>
  );
};

export default App;
