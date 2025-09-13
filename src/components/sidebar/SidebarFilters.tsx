import Filter from '@/components/ui/Filter';
import { LeadStatus, OpportunityStage, SidebarFiltersProps } from '@/types';
import React from 'react';

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  activeTab,
  leadStatusOptions,
  opportunityStageOptions,
  leadFilters,
  opportunityFilters,
  onLeadFilterChange,
  onOpportunityFilterChange,
  onMobileClose,
}) => {
  const handleLeadFilterChange = (value: string) => {
    onLeadFilterChange(value as LeadStatus | 'all');
    onMobileClose?.();
  };

  const handleOpportunityFilterChange = (value: string) => {
    onOpportunityFilterChange(value as OpportunityStage | 'all');
    onMobileClose?.();
  };

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
        Filters
      </h2>

      {activeTab === 'leads' ? (
        <Filter
          options={leadStatusOptions}
          activeValue={leadFilters.status}
          onFilterChange={handleLeadFilterChange}
          type='lead'
        />
      ) : (
        <Filter
          options={opportunityStageOptions}
          activeValue={opportunityFilters.stage}
          onFilterChange={handleOpportunityFilterChange}
          type='opportunity'
        />
      )}
    </div>
  );
};

export default SidebarFilters;
