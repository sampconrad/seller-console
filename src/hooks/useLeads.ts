/**
 * Custom hook for managing leads data and operations
 */

import { useApp } from '@/context/AppContext';
import { useNotifications } from '@/context/NotificationContext';
import { apiService } from '@/services/api';
import { fileService } from '@/services/fileService';
import { storageService } from '@/services/storage';
import type { ExportOptions, ImportResult, Lead, LeadFilters, OpportunityFormData } from '@/types';
import { filterLeads, sortLeads } from '@/utils/dataTransform';
import { useCallback, useMemo } from 'react';

export const useLeads = () => {
  const { state, dispatch } = useApp();
  const { addNotification } = useNotifications();

  // Compute filtered and sorted leads
  const leads = useMemo(() => {
    const filtered = filterLeads(state.leads, state.filters);
    return sortLeads(filtered, state.sortConfig);
  }, [state.leads, state.filters, state.sortConfig]);

  // Update filters (saves to localStorage)
  const updateFilters = useCallback(
    (filters: Partial<LeadFilters>) => {
      dispatch({ type: 'UPDATE_FILTERS', payload: filters });
    },
    [dispatch]
  );

  // Update search only (doesn't save to localStorage)
  const updateSearch = useCallback(
    (search: string) => {
      dispatch({ type: 'UPDATE_SEARCH', payload: search });
    },
    [dispatch]
  );

  // Update sort configuration
  const updateSort = useCallback(
    (field: keyof Lead, direction: 'asc' | 'desc') => {
      dispatch({ type: 'UPDATE_SORT', payload: { field, direction } });
    },
    [dispatch]
  );

  // Update lead with optimistic updates
  const updateLead = useCallback(
    async (id: string, updates: Partial<Lead>) => {
      const originalLead = state.leads.find((lead) => lead.id === id);
      if (!originalLead) return;

      // Optimistic update
      const optimisticLead = { ...originalLead, ...updates, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_LEAD', payload: optimisticLead });

      try {
        const response = await apiService.updateLead(id, updates);
        dispatch({ type: 'UPDATE_LEAD', payload: response.data });
        addNotification({
          type: 'success',
          title: 'Lead Updated',
          message: 'Lead has been successfully updated.',
        });
      } catch (error) {
        // Rollback on failure
        dispatch({ type: 'UPDATE_LEAD', payload: originalLead });
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: error instanceof Error ? error.message : 'Failed to update lead',
        });
      }
    },
    [state.leads, dispatch, addNotification]
  );

  // Convert lead to opportunity
  const convertToOpportunity = useCallback(
    async (leadId: string, opportunityData: OpportunityFormData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const response = await apiService.createOpportunity(leadId, opportunityData);

        dispatch({ type: 'ADD_OPPORTUNITY', payload: response.data });

        // Refresh the leads list since the converted lead was removed
        const updatedLeads = storageService.getLeads();
        dispatch({ type: 'SET_LEADS', payload: updatedLeads });

        addNotification({
          type: 'success',
          title: 'Lead Converted',
          message: 'Lead has been successfully converted to an opportunity.',
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Conversion Failed',
          message: error instanceof Error ? error.message : 'Failed to convert lead',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.leads, dispatch, addNotification]
  );

  // Delete lead
  const deleteLead = useCallback(
    async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const leads = state.leads.filter((lead) => lead.id !== id);
        storageService.setLeads(leads);
        dispatch({ type: 'SET_LEADS', payload: leads });

        addNotification({
          type: 'success',
          title: 'Lead Deleted',
          message: 'Lead has been successfully deleted.',
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Delete Failed',
          message: error instanceof Error ? error.message : 'Failed to delete lead',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.leads, dispatch, addNotification]
  );

  // Import leads from file
  const importLeads = useCallback(
    async (file: File): Promise<ImportResult> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const result = await fileService.importLeads(file);

        if (result.success && result.data.length > 0) {
          await apiService.importLeads(result.data);
          // Get the complete leads list after import
          const allLeads = storageService.getLeads();
          dispatch({ type: 'SET_LEADS', payload: allLeads });

          addNotification({
            type: 'success',
            title: 'Import Successful',
            message: `Successfully imported ${result.importedCount} leads.`,
          });
        } else if (result.errors.length > 0) {
          addNotification({
            type: 'warning',
            title: 'Import Completed with Errors',
            message: `Imported ${result.importedCount} leads with ${result.errors.length} errors.`,
          });
        }

        return result;
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Import Failed',
          message: error instanceof Error ? error.message : 'Failed to import leads',
        });
        return {
          success: false,
          data: [],
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          importedCount: 0,
        };
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [dispatch, addNotification]
  );

  // Export leads
  const exportLeads = useCallback(
    async (options: ExportOptions) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const response = await apiService.exportLeads();
        fileService.exportData(response.data, options);

        addNotification({
          type: 'success',
          title: 'Export Successful',
          message: 'Leads have been exported successfully.',
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Export Failed',
          message: error instanceof Error ? error.message : 'Failed to export leads',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [dispatch, addNotification]
  );

  // Create new lead
  const createLead = useCallback(
    async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const response = await apiService.createLead(leadData);

        // Get the complete leads list after creation
        const allLeads = storageService.getLeads();
        dispatch({ type: 'SET_LEADS', payload: allLeads });

        addNotification({
          type: 'success',
          title: 'Lead Created',
          message: 'Lead has been created successfully.',
        });

        return response;
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Creation Failed',
          message: error instanceof Error ? error.message : 'Failed to create lead',
        });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [dispatch, addNotification]
  );

  return {
    leads,
    allLeads: state.leads,
    loading: state.isLoading,
    error: state.error,
    filters: state.filters,
    sortConfig: state.sortConfig,
    updateFilters,
    updateSearch,
    updateSort,
    updateLead,
    createLead,
    deleteLead,
    convertToOpportunity,
    importLeads,
    exportLeads,
  };
};
