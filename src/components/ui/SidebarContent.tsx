import { SidebarContentProps } from '@/types';
import React from 'react';
import Footer from './Footer';
import SidebarFilters from './SidebarFilters';
import SidebarNavigation from './SidebarNavigation';
import SidebarDataManagement from './SidebarDataManagement';

const SidebarContent: React.FC<SidebarContentProps> = ({
  activeTab,
  onTabChange,
  leadStatusOptions,
  opportunityStageOptions,
  leadFilters,
  opportunityFilters,
  onLeadFilterChange,
  onOpportunityFilterChange,
  onNewLead,
  onImportClick,
  onExportClick,
  onMobileClose,
}) => {
  const handleNewLead = () => {
    onNewLead();
    onMobileClose?.();
  };

  const handleImportClick = () => {
    onImportClick();
    onMobileClose?.();
  };

  const handleExportClick = () => {
    onExportClick();
    onMobileClose?.();
  };

  return (
    <div className='flex-1 flex flex-col overflow-y-auto'>
      <SidebarNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        onMobileClose={onMobileClose}
      />

      <SidebarFilters
        activeTab={activeTab}
        leadStatusOptions={leadStatusOptions}
        opportunityStageOptions={opportunityStageOptions}
        leadFilters={leadFilters}
        opportunityFilters={opportunityFilters}
        onLeadFilterChange={onLeadFilterChange}
        onOpportunityFilterChange={onOpportunityFilterChange}
        onMobileClose={onMobileClose}
      />

      <div className='p-6 mt-auto'>
        <SidebarDataManagement
          activeTab={activeTab}
          onNewLead={handleNewLead}
          onImportClick={handleImportClick}
          onExportClick={handleExportClick}
        />
      </div>

      <Footer />
    </div>
  );
};

export default SidebarContent;
