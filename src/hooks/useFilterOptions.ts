/**
 * Custom hook for generating filter options for leads and opportunities
 */

import { useApp } from '@/context/AppContext';
import { FilterOption, LeadStatus, OpportunityStage } from '@/types';
import { useMemo } from 'react';

export const useFilterOptions = () => {
  const { state } = useApp();

  const leadStatusOptions = useMemo((): FilterOption[] => {
    const leads = state.leads;
    return [
      { value: 'all', label: 'All Leads', count: leads.length },
      {
        value: LeadStatus.NEW,
        label: 'New',
        count: leads.filter((lead) => lead.status === LeadStatus.NEW).length,
      },
      {
        value: LeadStatus.CONTACTED,
        label: 'Contacted',
        count: leads.filter((lead) => lead.status === LeadStatus.CONTACTED).length,
      },
      {
        value: LeadStatus.QUALIFIED,
        label: 'Qualified',
        count: leads.filter((lead) => lead.status === LeadStatus.QUALIFIED).length,
      },
      {
        value: LeadStatus.UNQUALIFIED,
        label: 'Unqualified',
        count: leads.filter((lead) => lead.status === LeadStatus.UNQUALIFIED).length,
      },
      {
        value: LeadStatus.CONVERTED,
        label: 'Converted',
        count: leads.filter((lead) => lead.status === LeadStatus.CONVERTED).length,
      },
    ];
  }, [state.leads]);

  const opportunityStageOptions = useMemo((): FilterOption[] => {
    const opportunities = state.opportunities;
    return [
      { value: 'all', label: 'All Opportunities', count: opportunities.length },
      {
        value: OpportunityStage.PROSPECTING,
        label: 'Prospecting',
        count: opportunities.filter((opp) => opp.stage === OpportunityStage.PROSPECTING).length,
      },
      {
        value: OpportunityStage.QUALIFICATION,
        label: 'Qualification',
        count: opportunities.filter((opp) => opp.stage === OpportunityStage.QUALIFICATION).length,
      },
      {
        value: OpportunityStage.PROPOSAL,
        label: 'Proposal',
        count: opportunities.filter((opp) => opp.stage === OpportunityStage.PROPOSAL).length,
      },
      {
        value: OpportunityStage.NEGOTIATION,
        label: 'Negotiation',
        count: opportunities.filter((opp) => opp.stage === OpportunityStage.NEGOTIATION).length,
      },
      {
        value: OpportunityStage.CLOSED_WON,
        label: 'Closed Won',
        count: opportunities.filter((opp) => opp.stage === OpportunityStage.CLOSED_WON).length,
      },
      {
        value: OpportunityStage.CLOSED_LOST,
        label: 'Closed Lost',
        count: opportunities.filter((opp) => opp.stage === OpportunityStage.CLOSED_LOST).length,
      },
    ];
  }, [state.opportunities]);

  return {
    leadStatusOptions,
    opportunityStageOptions,
  };
};
