/**
 * Validation utilities for form inputs and data integrity
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (
  value: string | number | undefined
): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
};

export const validateScore = (score: number): boolean => {
  return score >= 0 && score <= 100 && Number.isInteger(score);
};

export const validateAmount = (amount: number | undefined): boolean => {
  if (amount === undefined) return true; // Optional field
  return amount >= 0 && Number.isFinite(amount);
};

export const validateLead = (lead: Partial<Lead>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateRequired(lead.name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!validateRequired(lead.company)) {
    errors.push({ field: 'company', message: 'Company is required' });
  }

  if (!validateRequired(lead.email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (lead.email && !validateEmail(lead.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  if (!validateRequired(lead.source)) {
    errors.push({ field: 'source', message: 'Source is required' });
  }

  if (lead.score !== undefined && !validateScore(lead.score)) {
    errors.push({
      field: 'score',
      message: 'Score must be an integer between 0 and 100',
    });
  }

  return errors;
};

export const validateOpportunity = (
  opportunity: Partial<Opportunity>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateRequired(opportunity.name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!validateRequired(opportunity.accountName)) {
    errors.push({ field: 'accountName', message: 'Account name is required' });
  }

  if (opportunity.amount !== undefined && !validateAmount(opportunity.amount)) {
    errors.push({
      field: 'amount',
      message: 'Amount must be a positive number',
    });
  }

  return errors;
};

/**
 * Convert validation errors array to error map for form handling
 */
export const convertValidationErrorsToMap = (
  errors: ValidationError[]
): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  errors.forEach(error => {
    errorMap[error.field] = error.message;
  });
  return errorMap;
};

import type { Lead, Opportunity, ValidationError } from '@/types';
