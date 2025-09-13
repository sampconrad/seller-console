/**
 * Custom hook for managing opportunities data and operations
 */

import { useApp } from '@/context/AppContext';
import { useNotifications } from '@/context/NotificationContext';
import { useServices } from '@/services/ServiceContainer';
import type { Opportunity, OpportunityFilters } from '@/types';
import { useCallback } from 'react';

export const useOpportunities = () => {
  const { state, dispatch } = useApp();
  const { addNotification } = useNotifications();
  const { apiService } = useServices();

  // Update filters (saves to localStorage)
  const updateFilters = useCallback(
    (filters: Partial<OpportunityFilters>) => {
      dispatch({ type: 'UPDATE_OPPORTUNITY_FILTERS', payload: filters });
    },
    [dispatch]
  );

  // Update search only (doesn't save to localStorage)
  const updateSearch = useCallback(
    (search: string) => {
      dispatch({ type: 'UPDATE_OPPORTUNITY_SEARCH', payload: search });
    },
    [dispatch]
  );

  // Update sort configuration
  const updateSort = useCallback(
    (field: keyof Opportunity, direction: 'asc' | 'desc') => {
      dispatch({
        type: 'UPDATE_OPPORTUNITY_SORT',
        payload: { field, direction },
      });
    },
    [dispatch]
  );

  // Update opportunity with optimistic updates
  const updateOpportunity = useCallback(
    async (id: string, updates: Partial<Opportunity>) => {
      const originalOpportunity = state.opportunities.find(
        opp => opp.id === id
      );
      if (!originalOpportunity) return;

      // Optimistic update
      const optimisticOpportunity = {
        ...originalOpportunity,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_OPPORTUNITY', payload: optimisticOpportunity });

      try {
        const response = await apiService.updateOpportunity(id, updates);
        dispatch({ type: 'UPDATE_OPPORTUNITY', payload: response.data });
        addNotification({
          type: 'success',
          title: 'Opportunity Updated',
          message: 'Opportunity has been successfully updated.',
        });
      } catch (error) {
        // Rollback on failure
        dispatch({ type: 'UPDATE_OPPORTUNITY', payload: originalOpportunity });
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to update opportunity',
        });
      }
    },
    [state.opportunities, dispatch, addNotification, apiService]
  );

  // Delete opportunity
  const deleteOpportunity = useCallback(
    async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        await apiService.deleteOpportunity(id);
        dispatch({ type: 'DELETE_OPPORTUNITY', payload: id });

        addNotification({
          type: 'success',
          title: 'Opportunity Deleted',
          message: 'Opportunity has been successfully deleted.',
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Delete Failed',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to delete opportunity',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [dispatch, addNotification, apiService]
  );

  return {
    opportunities: state.opportunities,
    loading: state.isLoading,
    error: state.error,
    filters: state.opportunityFilters,
    sortConfig: state.opportunitySortConfig,
    updateFilters,
    updateSearch,
    updateSort,
    updateOpportunity,
    deleteOpportunity,
  };
};
