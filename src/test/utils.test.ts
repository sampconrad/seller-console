/**
 * Unit tests for utility functions
 */

import { LeadStatus } from '@/types';
import {
  filterLeads,
  formatCurrency,
  formatDate,
  generateId,
  sortLeads,
} from '@/utils/dataTransform';
import {
  validateAmount,
  validateEmail,
  validateLead,
  validateRequired,
  validateScore,
} from '@/utils/validation';
import { describe, expect, it } from 'vitest';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should validate required strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('  test  ')).toBe(true);
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    it('should validate required numbers', () => {
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(42)).toBe(true);
      expect(validateRequired(undefined)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateScore', () => {
    it('should validate score values', () => {
      expect(validateScore(0)).toBe(true);
      expect(validateScore(50)).toBe(true);
      expect(validateScore(100)).toBe(true);
      expect(validateScore(-1)).toBe(false);
      expect(validateScore(101)).toBe(false);
      expect(validateScore(50.5)).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate amount values', () => {
      expect(validateAmount(0)).toBe(true);
      expect(validateAmount(100.5)).toBe(true);
      expect(validateAmount(undefined)).toBe(true);
      expect(validateAmount(-1)).toBe(false);
      expect(validateAmount(NaN)).toBe(false);
    });
  });

  describe('validateLead', () => {
    it('should validate complete lead data', () => {
      const validLead = {
        name: 'John Doe',
        company: 'Acme Corp',
        email: 'john@acme.com',
        source: 'Website',
        score: 85,
        status: LeadStatus.NEW,
      };

      const errors = validateLead(validLead);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid lead data', () => {
      const invalidLead = {
        name: '',
        company: 'Acme Corp',
        email: 'invalid-email',
        source: 'Website',
        score: 150,
        status: LeadStatus.NEW,
      };

      const errors = validateLead(invalidLead);
      expect(errors).toHaveLength(3);
      expect(errors.some(e => e.field === 'name')).toBe(true);
      expect(errors.some(e => e.field === 'email')).toBe(true);
      expect(errors.some(e => e.field === 'score')).toBe(true);
    });
  });
});

describe('Data Transform Utils', () => {
  const sampleLeads = [
    {
      id: '1',
      name: 'Alice',
      company: 'Company A',
      email: 'alice@companya.com',
      source: 'Website',
      score: 80,
      status: LeadStatus.NEW,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Bob',
      company: 'Company B',
      email: 'bob@companyb.com',
      source: 'Referral',
      score: 90,
      status: LeadStatus.CONTACTED,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  describe('sortLeads', () => {
    it('should sort leads by score descending', () => {
      const sorted = sortLeads(sampleLeads, {
        field: 'score',
        direction: 'desc',
      });
      expect(sorted[0].score).toBe(90);
      expect(sorted[1].score).toBe(80);
    });

    it('should sort leads by score ascending', () => {
      const sorted = sortLeads(sampleLeads, {
        field: 'score',
        direction: 'asc',
      });
      expect(sorted[0].score).toBe(80);
      expect(sorted[1].score).toBe(90);
    });
  });

  describe('filterLeads', () => {
    it('should filter leads by search term', () => {
      const filtered = filterLeads(sampleLeads, {
        search: 'alice',
        status: 'all',
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Alice');
    });

    it('should filter leads by status', () => {
      const filtered = filterLeads(sampleLeads, {
        search: '',
        status: LeadStatus.CONTACTED,
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe(LeadStatus.CONTACTED);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });
});
