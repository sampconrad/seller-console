import SidebarDataManagement from '@/components/sidebar/SidebarDataManagement';
import SidebarFilters from '@/components/sidebar/SidebarFilters';
import SidebarNavigation from '@/components/sidebar/SidebarNavigation';
import Footer from '@/components/ui/Footer';
import { SidebarContentProps } from '@/types';
import React from 'react';

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
