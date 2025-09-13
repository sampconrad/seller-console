/**
 * Modal for creating and editing leads
 */

import FormModal from '@/components/modals/FormModal';
import Input from '@/components/ui/Input';
import ScoreDial from '@/components/ui/ScoreDial';
import Select from '@/components/ui/Select';
import { useLeads } from '@/hooks/useLeads';
import type { Lead, LeadFormProps } from '@/types';
import { LeadStatus } from '@/types';
import { convertValidationErrorsToMap, validateLead } from '@/utils/validation';
import React, { useEffect, useState } from 'react';

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, lead, mode }) => {
  const { createLead, updateLead } = useLeads();
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    company: '',
    email: '',
    source: '',
    score: 1,
    status: LeadStatus.NEW,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or lead changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && lead) {
        setFormData(lead);
      } else {
        setFormData({
          name: '',
          company: '',
          email: '',
          source: '',
          score: 1,
          status: LeadStatus.NEW,
        });
      }
      setErrors({});
    }
  }, [isOpen, lead, mode]);

  const handleInputChange = (field: keyof Lead, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLead(formData as Lead);
    if (validationErrors.length > 0) {
      setErrors(convertValidationErrorsToMap(validationErrors));
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createLead(
          formData as Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
        );
      } else if (lead) {
        await updateLead(lead.id, formData);
      }

      onClose();
    } catch (error) {
      // Error handling is done in the hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      source: '',
      score: 1,
      status: LeadStatus.NEW,
    });
    setErrors({});
    onClose();
  };

  const statusOptions = [
    { value: LeadStatus.NEW, label: 'New' },
    { value: LeadStatus.CONTACTED, label: 'Contacted' },
    { value: LeadStatus.QUALIFIED, label: 'Qualified' },
    { value: LeadStatus.CONVERTED, label: 'Converted' },
    { value: LeadStatus.UNQUALIFIED, label: 'Unqualified' },
  ];

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'email', label: 'Email' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <FormModal
      isOpen={isOpen}
      title={mode === 'create' ? 'Create New Lead' : 'Edit Lead'}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitText={mode === 'create' ? 'Create Lead' : 'Save Changes'}
      isSubmitting={isSubmitting}
    >
      <div className='grid grid-cols-2 gap-4'>
        {/* Name */}
        <div className='col-span-2'>
          <Input
            id='name'
            label='Name'
            value={formData.name || ''}
            onChange={e => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder='Enter lead name'
            required
          />
        </div>

        {/* Company */}
        <div className='col-span-2'>
          <Input
            id='company'
            label='Company'
            value={formData.company || ''}
            onChange={e => handleInputChange('company', e.target.value)}
            error={errors.company}
            placeholder='Enter company name'
            required
          />
        </div>

        {/* Email */}
        <div className='col-span-2'>
          <Input
            id='email'
            label='Email'
            type='email'
            value={formData.email || ''}
            onChange={e => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder='Enter email address'
            required
          />
        </div>

        {/* Source */}
        <div className='col-span-2 xxs:col-span-1'>
          <Select
            id='source'
            label='Source'
            value={formData.source || ''}
            onChange={e => handleInputChange('source', e.target.value)}
            error={errors.source}
            options={sourceOptions}
            placeholder='Select source'
            required
          />
        </div>

        {/* Status */}
        <div className='col-span-2 xxs:col-span-1'>
          <Select
            id='status'
            label='Status'
            value={formData.status || LeadStatus.NEW}
            onChange={e =>
              handleInputChange('status', e.target.value as LeadStatus)
            }
            error={errors.status}
            options={statusOptions}
            required
          />
        </div>

        {/* Score */}
        <div className='col-span-2'>
          <ScoreDial
            label='Score'
            value={formData.score || 1}
            onChange={value => handleInputChange('score', value)}
            error={errors.score}
            min={1}
            max={100}
          />
        </div>
      </div>
    </FormModal>
  );
};

export default LeadForm;
