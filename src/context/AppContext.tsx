import { apiService } from '@/services/api';
import { storageService } from '@/services/storage';
import type {
  AppState,
  Lead,
  LeadFilters,
  LeadStatus,
  Notification,
  Opportunity,
  OpportunityFilters,
  SortConfig,
} from '@/types';
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LEADS'; payload: Lead[] }
  | { type: 'SET_OPPORTUNITIES'; payload: Opportunity[] }
  | { type: 'SET_SELECTED_LEAD'; payload: Lead | null }
  | { type: 'UPDATE_FILTERS'; payload: Partial<LeadFilters> }
  | { type: 'UPDATE_OPPORTUNITY_FILTERS'; payload: Partial<OpportunityFilters> }
  | { type: 'UPDATE_SEARCH'; payload: string }
  | { type: 'UPDATE_OPPORTUNITY_SEARCH'; payload: string }
  | { type: 'UPDATE_SORT'; payload: SortConfig }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_LEAD'; payload: Lead }
  | { type: 'ADD_OPPORTUNITY'; payload: Opportunity }
  | { type: 'UPDATE_OPPORTUNITY'; payload: Opportunity }
  | { type: 'DELETE_OPPORTUNITY'; payload: string };

const initialState: AppState = {
  leads: [],
  opportunities: [],
  selectedLead: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
  },
  opportunityFilters: {
    search: '',
    stage: 'all',
  },
  sortConfig: {
    field: 'score',
    direction: 'desc',
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_LEADS':
      return { ...state, leads: action.payload };

    case 'SET_OPPORTUNITIES':
      return { ...state, opportunities: action.payload };

    case 'SET_SELECTED_LEAD':
      return { ...state, selectedLead: action.payload };

    case 'UPDATE_FILTERS':
      const newFilters = { ...state.filters, ...action.payload };
      storageService.setFilters(newFilters);
      return { ...state, filters: newFilters };

    case 'UPDATE_OPPORTUNITY_FILTERS':
      const newOpportunityFilters = { ...state.opportunityFilters, ...action.payload };
      storageService.setOpportunityFilters(newOpportunityFilters);
      return { ...state, opportunityFilters: newOpportunityFilters };

    case 'UPDATE_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
      };

    case 'UPDATE_OPPORTUNITY_SEARCH':
      return {
        ...state,
        opportunityFilters: { ...state.opportunityFilters, search: action.payload },
      };

    case 'UPDATE_SORT':
      storageService.setSortConfig(action.payload);
      return { ...state, sortConfig: action.payload };

    case 'ADD_NOTIFICATION':
      return { ...state };

    case 'REMOVE_NOTIFICATION':
      return { ...state };

    case 'UPDATE_LEAD':
      const updatedLeads = state.leads.map((lead) =>
        lead.id === action.payload.id ? action.payload : lead
      );
      storageService.setLeads(updatedLeads);
      return { ...state, leads: updatedLeads };

    case 'ADD_OPPORTUNITY':
      const newOpportunities = [...state.opportunities, action.payload];
      storageService.setOpportunities(newOpportunities);
      return { ...state, opportunities: newOpportunities };

    case 'UPDATE_OPPORTUNITY':
      const updatedOpportunities = state.opportunities.map((opp) =>
        opp.id === action.payload.id ? action.payload : opp
      );
      storageService.setOpportunities(updatedOpportunities);
      return { ...state, opportunities: updatedOpportunities };

    case 'DELETE_OPPORTUNITY':
      const filteredOpportunities = state.opportunities.filter((opp) => opp.id !== action.payload);
      storageService.setOpportunities(filteredOpportunities);
      return { ...state, opportunities: filteredOpportunities };

    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    if (isInitialized) return;

    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Load persisted state
        const savedFilters = storageService.getFilters();
        const savedOpportunityFilters = storageService.getOpportunityFilters();
        const savedSortConfig = storageService.getSortConfig();

        dispatch({ type: 'UPDATE_FILTERS', payload: savedFilters });
        dispatch({ type: 'UPDATE_OPPORTUNITY_FILTERS', payload: savedOpportunityFilters });
        dispatch({ type: 'UPDATE_SORT', payload: savedSortConfig });

        // Load data from API
        const [leadsResponse, opportunitiesResponse] = await Promise.all([
          apiService.getLeads(),
          apiService.getOpportunities(),
        ]);

        // If no leads exist and sample data hasn't been loaded yet, load sample data
        if (leadsResponse.data.length === 0 && !storageService.hasSampleDataBeenLoaded()) {
          try {
            const sampleData = await import('@/data/sampleLeads.json');
            const sampleLeads = sampleData.default.map((lead) => ({
              ...lead,
              status: lead.status as LeadStatus,
              createdAt: new Date(lead.createdAt),
              updatedAt: new Date(lead.updatedAt),
            }));
            dispatch({ type: 'SET_LEADS', payload: sampleLeads });
            storageService.setLeads(sampleLeads);
            storageService.setSampleDataLoaded();
          } catch (error) {
            console.warn('Could not load sample data:', error);
            dispatch({ type: 'SET_LEADS', payload: leadsResponse.data });
          }
        } else {
          dispatch({ type: 'SET_LEADS', payload: leadsResponse.data });
        }

        dispatch({ type: 'SET_OPPORTUNITIES', payload: opportunitiesResponse.data });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to load data',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        setIsInitialized(true);
      }
    };

    loadInitialData();
  }, [isInitialized]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
