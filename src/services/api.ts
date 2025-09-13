/**
 * Mock API service with simulated latency
 */

import type {
  ApiResponse,
  Lead,
  Opportunity,
  OpportunityFormData,
} from '@/types';
import { generateId } from '@/utils/dataTransform';
import { storageService } from './storage';

/**
 * Simulate network latency
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock API service class
 */
class ApiService {
  private async simulateRequest<T>(
    data: T,
    shouldError = false
  ): Promise<ApiResponse<T>> {
    // Simulate network latency (500-1500ms)
    const latency = Math.random() * 1000 + 500;
    await delay(latency);

    if (shouldError) {
      throw new Error('Network request failed. Please try again.');
    }

    return {
      data,
      success: true,
    };
  }

  // Lead operations
  async getLeads(): Promise<ApiResponse<Lead[]>> {
    const leads = storageService.getLeads();
    return this.simulateRequest(leads);
  }

  async updateLead(
    id: string,
    updates: Partial<Lead>
  ): Promise<ApiResponse<Lead>> {
    const leads = storageService.getLeads();
    const leadIndex = leads.findIndex(lead => lead.id === id);

    if (leadIndex === -1) {
      throw new Error('Lead not found');
    }

    const updatedLead = {
      ...leads[leadIndex],
      ...updates,
      updatedAt: new Date(),
    };

    leads[leadIndex] = updatedLead;
    storageService.setLeads(leads);

    return this.simulateRequest(updatedLead);
  }

  async createLead(
    leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Lead>> {
    const leads = storageService.getLeads();

    const newLead: Lead = {
      ...leadData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    leads.push(newLead);
    storageService.setLeads(leads);

    return this.simulateRequest(newLead);
  }

  async createOpportunity(
    leadId: string,
    opportunityData: OpportunityFormData
  ): Promise<ApiResponse<Opportunity>> {
    const leads = storageService.getLeads();
    const lead = leads.find(l => l.id === leadId);

    if (!lead) {
      throw new Error('Lead not found');
    }

    const opportunity: Opportunity = {
      id: generateId(),
      name: opportunityData.name,
      stage: opportunityData.stage,
      amount: opportunityData.amount,
      accountName: opportunityData.accountName,
      leadId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate the request first (without random failure for conversions)
    const response = await this.simulateRequest(opportunity, false);

    // Only save data if the request succeeds
    // Remove the lead from the leads list since it's been converted
    const updatedLeads = leads.filter(l => l.id !== leadId);

    // Add opportunity
    const opportunities = storageService.getOpportunities();
    opportunities.push(opportunity);

    storageService.setLeads(updatedLeads);
    storageService.setOpportunities(opportunities);

    return response;
  }

  // Opportunity operations
  async getOpportunities(): Promise<ApiResponse<Opportunity[]>> {
    const opportunities = storageService.getOpportunities();
    return this.simulateRequest(opportunities);
  }

  async updateOpportunity(
    id: string,
    updates: Partial<Opportunity>
  ): Promise<ApiResponse<Opportunity>> {
    const opportunities = storageService.getOpportunities();
    const opportunityIndex = opportunities.findIndex(opp => opp.id === id);

    if (opportunityIndex === -1) {
      throw new Error('Opportunity not found');
    }

    const updatedOpportunity = {
      ...opportunities[opportunityIndex],
      ...updates,
      updatedAt: new Date(),
    };

    opportunities[opportunityIndex] = updatedOpportunity;
    storageService.setOpportunities(opportunities);

    return this.simulateRequest(updatedOpportunity);
  }

  async deleteOpportunity(id: string): Promise<ApiResponse<void>> {
    const opportunities = storageService.getOpportunities();
    const filteredOpportunities = opportunities.filter(opp => opp.id !== id);

    if (filteredOpportunities.length === opportunities.length) {
      throw new Error('Opportunity not found');
    }

    storageService.setOpportunities(filteredOpportunities);

    return this.simulateRequest(undefined as any);
  }

  // Import/Export operations
  async importLeads(leads: Lead[]): Promise<ApiResponse<Lead[]>> {
    const existingLeads = storageService.getLeads();
    const newLeads = leads.map(lead => ({
      ...lead,
      id: generateId(),
      createdAt: new Date(lead.createdAt),
      updatedAt: new Date(lead.updatedAt),
    }));

    const allLeads = [...existingLeads, ...newLeads];
    storageService.setLeads(allLeads);

    return this.simulateRequest(newLeads);
  }

  async exportLeads(): Promise<ApiResponse<Lead[]>> {
    const leads = storageService.getLeads();
    return this.simulateRequest(leads);
  }

  async exportOpportunities(): Promise<ApiResponse<Opportunity[]>> {
    const opportunities = storageService.getOpportunities();
    return this.simulateRequest(opportunities);
  }
}

export const apiService = new ApiService();
