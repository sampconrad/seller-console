/**
 * File import/export service for JSON and CSV formats
 */

import type { ExportOptions, ImportResult, Lead, Opportunity } from '@/types';

/**
 * Parse CSV content to Lead objects
 */
const parseCSV = (csvContent: string): Lead[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const requiredFields = ['name', 'company', 'email', 'source', 'score', 'status'];

  // Validate required fields are present
  const missingFields = requiredFields.filter((field) => !headers.includes(field));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const leads: Lead[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map((v) => v.trim());
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const leadData: any = {};
      headers.forEach((header, index) => {
        leadData[header] = values[index];
      });

      // Convert and validate data
      const lead: Lead = {
        id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
        name: leadData.name,
        company: leadData.company,
        email: leadData.email,
        source: leadData.source,
        score: parseInt(leadData.score, 10),
        status: leadData.status as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Basic validation
      if (!lead.name || !lead.company || !lead.email) {
        errors.push(`Row ${i + 1}: Missing required fields`);
        continue;
      }

      if (isNaN(lead.score) || lead.score < 0 || lead.score > 100) {
        errors.push(`Row ${i + 1}: Invalid score value`);
        continue;
      }

      leads.push(lead);
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return leads;
};

/**
 * Parse JSON content to Lead objects
 */
const parseJSON = (jsonContent: string): Lead[] => {
  try {
    const data = JSON.parse(jsonContent);

    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of lead objects');
    }

    return data.map((item, index) => {
      if (!item.name || !item.company || !item.email) {
        throw new Error(`Item ${index + 1}: Missing required fields`);
      }

      return {
        id: item.id || Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
        name: item.name,
        company: item.company,
        email: item.email,
        source: item.source || 'Unknown',
        score: item.score || 0,
        status: item.status || 'new',
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      };
    });
  } catch (error) {
    throw new Error(
      `Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Convert Lead objects to CSV format
 */
const leadsToCSV = (leads: Lead[]): string => {
  const headers = ['ID', 'Name', 'Company', 'Email', 'Source', 'Score', 'Status', 'Created At'];
  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.company,
    lead.email,
    lead.source,
    lead.score.toString(),
    lead.status,
    lead.createdAt.toISOString(),
  ]);

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};

/**
 * Convert Opportunity objects to CSV format
 */
const opportunitiesToCSV = (opportunities: Opportunity[]): string => {
  const headers = ['ID', 'Name', 'Stage', 'Amount', 'Account Name', 'Lead ID', 'Created At'];
  const rows = opportunities.map((opp) => [
    opp.id,
    opp.name,
    opp.stage,
    opp.amount?.toString() || '',
    opp.accountName,
    opp.leadId,
    opp.createdAt.toISOString(),
  ]);

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};

/**
 * File service class
 */
class FileService {
  /**
   * Import leads from file
   */
  async importLeads(file: File): Promise<ImportResult> {
    try {
      const content = await this.readFileContent(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      let leads: Lead[];
      const errors: string[] = [];

      try {
        if (fileExtension === 'csv') {
          leads = parseCSV(content);
        } else if (fileExtension === 'json') {
          leads = parseJSON(content);
        } else {
          throw new Error('Unsupported file format. Please use CSV or JSON files.');
        }
      } catch (parseError) {
        return {
          success: false,
          data: [],
          errors: [parseError instanceof Error ? parseError.message : 'Parse error'],
          importedCount: 0,
        };
      }

      return {
        success: true,
        data: leads,
        errors,
        importedCount: leads.length,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        importedCount: 0,
      };
    }
  }

  /**
   * Export data to file
   */
  exportData(data: Lead[] | Opportunity[], options: ExportOptions): void {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (options.format === 'csv') {
      if (Array.isArray(data) && data.length > 0 && 'leadId' in data[0]) {
        // Opportunities
        content = opportunitiesToCSV(data as Opportunity[]);
        filename = 'opportunities.csv';
      } else {
        // Leads
        content = leadsToCSV(data as Lead[]);
        filename = 'leads.csv';
      }
      mimeType = 'text/csv';
    } else {
      // JSON
      content = JSON.stringify(data, null, 2);
      if (Array.isArray(data) && data.length > 0 && 'leadId' in data[0]) {
        filename = 'opportunities.json';
      } else {
        filename = 'leads.json';
      }
      mimeType = 'application/json';
    }

    this.downloadFile(content, filename, mimeType);
  }

  /**
   * Read file content as text
   */
  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  }

  /**
   * Download file to user's device
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const fileService = new FileService();
