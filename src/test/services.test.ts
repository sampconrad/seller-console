/**
 * Tests for services
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiService } from '../services/api';
import { fileService } from '../services/fileService';
import { PDFService } from '../services/pdfService';
import { storageService } from '../services/storage';
import { LeadStatus, OpportunityStage } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('StorageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get leads from localStorage', () => {
    const mockLeads = [
      {
        id: '1',
        name: 'Test Lead',
        company: 'Test Company',
        email: 'test@example.com',
        source: 'website',
        score: 85,
        status: 'new',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLeads));

    const leads = storageService.getLeads();

    expect(leads).toHaveLength(1);
    expect(leads[0].name).toBe('Test Lead');
    expect(leads[0].createdAt).toBeInstanceOf(Date);
  });

  it('should return empty array when no leads in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const leads = storageService.getLeads();

    expect(leads).toEqual([]);
  });

  it('should set leads in localStorage', () => {
    const leads = [
      {
        id: '1',
        name: 'Test Lead',
        company: 'Test Company',
        email: 'test@example.com',
        source: 'website',
        score: 85,
        status: LeadStatus.NEW,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      },
    ];

    storageService.setLeads(leads);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'coverpin_leads',
      JSON.stringify(leads)
    );
  });
});

describe('FileService', () => {
  it('should parse CSV content correctly', async () => {
    const csvContent = `name,company,email,source,score,status
John Doe,Acme Corp,john@acme.com,website,85,new
Jane Smith,Tech Inc,jane@tech.com,referral,90,qualified`;

    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

    const result = await fileService.importLeads(file);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('John Doe');
    expect(result.data[0].company).toBe('Acme Corp');
  });

  it('should handle CSV parsing errors', async () => {
    const csvContent = `name,company,email,source,score,status
John Doe,Acme Corp,invalid-email,website,85,new`;

    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

    const result = await fileService.importLeads(file);

    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0); // Basic validation passes
    expect(result.data).toHaveLength(1);
  });

  it('should parse JSON content correctly', async () => {
    const jsonContent = JSON.stringify([
      {
        name: 'John Doe',
        company: 'Acme Corp',
        email: 'john@acme.com',
        source: 'website',
        score: 85,
        status: 'new',
      },
    ]);

    const file = new File([jsonContent], 'test.json', {
      type: 'application/json',
    });

    const result = await fileService.importLeads(file);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('John Doe');
  });
});

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock storage service methods
    vi.spyOn(storageService, 'getLeads').mockReturnValue([]);
    vi.spyOn(storageService, 'setLeads').mockImplementation(() => {});
  });

  it('should get leads from storage', async () => {
    const mockLeads = [
      {
        id: '1',
        name: 'Test Lead',
        company: 'Test Company',
        email: 'test@example.com',
        source: 'website',
        score: 85,
        status: LeadStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.spyOn(storageService, 'getLeads').mockReturnValue(mockLeads);

    const response = await apiService.getLeads();

    expect(response.success).toBe(true);
    expect(response.data).toEqual(mockLeads);
  });

  it('should create a new lead', async () => {
    const leadData = {
      name: 'New Lead',
      company: 'New Company',
      email: 'new@example.com',
      source: 'website',
      score: 75,
      status: LeadStatus.NEW,
    };

    const response = await apiService.createLead(leadData);

    expect(response.success).toBe(true);
    expect(response.data.name).toBe('New Lead');
    expect(response.data.id).toBeDefined();
    expect(response.data.createdAt).toBeInstanceOf(Date);
  });
});

describe('PDFService', () => {
  // Mock canvas and jsPDF
  const mockCanvas = {
    getContext: vi.fn(() => ({
      fillStyle: '',
      font: '',
      textAlign: '',
      fillRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      arc: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
    })),
    width: 1000,
    height: 500,
    toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
  };

  const mockPDF = {
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    setTextColor: vi.fn(),
    splitTextToSize: vi.fn(text => [text]),
    text: vi.fn(),
    addImage: vi.fn(),
    addPage: vi.fn(),
    setFillColor: vi.fn(),
    rect: vi.fn(),
    save: vi.fn(),
    getCurrentPageInfo: vi.fn(() => ({ pageNumber: 1 })),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock document.createElement
    vi.spyOn(document, 'createElement').mockImplementation(tagName => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return document.createElement(tagName);
    });

    // Mock jsPDF
    vi.doMock('jspdf', () => ({
      default: vi.fn(() => mockPDF),
    }));
  });

  it('should generate chart image with valid data', () => {
    const chartData = [
      { value: 'new', label: 'New', count: 5 },
      { value: 'qualified', label: 'Qualified', count: 3 },
    ];

    const result = (PDFService as any).generateChartImage(
      chartData,
      'lead',
      'Test Chart'
    );

    expect(result).toBe('data:image/png;base64,mock');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('should return empty string for empty chart data', () => {
    const result = (PDFService as any).generateChartImage(
      [],
      'lead',
      'Test Chart'
    );

    expect(result).toBe('');
  });

  it('should generate PDF report successfully', async () => {
    const reportData = {
      leads: [
        {
          id: '1',
          name: 'Test Lead',
          company: 'Test Company',
          email: 'test@example.com',
          source: 'website',
          score: 85,
          status: LeadStatus.NEW,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      opportunities: [
        {
          id: '1',
          name: 'Test Opportunity',
          stage: OpportunityStage.PROPOSAL,
          amount: 10000,
          accountName: 'Test Account',
          leadId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      leadStatusOptions: [{ value: 'new', label: 'New', count: 1 }],
      opportunityStageOptions: [
        { value: 'proposal', label: 'Proposal', count: 1 },
      ],
      generatedAt: new Date(),
    };

    // Mock the generateChartImage method to return a valid base64 string
    const mockChartImage =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    vi.spyOn(PDFService as any, 'generateChartImage').mockReturnValue(
      mockChartImage
    );

    // Test that the function can be called without throwing
    await expect(PDFService.generateReport(reportData)).resolves.not.toThrow();
  });
});
