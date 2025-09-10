/**
 * Main application component
 */

import LeadDetailPanel from '@/components/LeadDetailPanel';
import LeadsList from '@/components/LeadsList';
import OpportunitiesList from '@/components/OpportunitiesList';
import OpportunityConversionModal from '@/components/OpportunityConversionModal';
import Footer from '@/components/ui/Footer';
import ToastContainer from '@/components/ui/ToastContainer';
import { AppProvider } from '@/context/AppContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { useLeads } from '@/hooks/useLeads';
import { Lead } from '@/types';
import { Pin } from 'lucide-react';
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
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <Pin className='w-6 h-6 text-primary-600 mr-2' />
              <h1 className='text-md sm:text-xl font-bold text-gray-900'>Seller Console</h1>
            </div>
            <nav className='flex space-x-0 sm:space-x-8'>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'leads'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                Leads
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'opportunities'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                <span className='hidden sm:inline'>Opportunities</span>
                <span className='sm:hidden'>Opps</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

      {/* Footer */}
      <Footer />

      {/* Lead Detail Panel */}
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        onConvert={handleLeadConvert}
      />

      {/* Opportunity Conversion Modal */}
      <OpportunityConversionModal
        lead={selectedLead}
        isOpen={isConversionModalOpen}
        onClose={handleCloseConversionModal}
      />

      {/* Toast Notifications */}
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
