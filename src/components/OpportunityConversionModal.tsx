/**
 * Modal for converting a lead to an opportunity
 */

import { useLeads } from '@/hooks/useLeads';
import type { Lead, OpportunityFormData } from '@/types';
import { OpportunityStage } from '@/types';
import { validateOpportunity } from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import Select from './ui/Select';

interface OpportunityConversionModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const OpportunityConversionModal: React.FC<OpportunityConversionModalProps> = ({
  lead,
  isOpen,
  onClose,
}) => {
  const { convertToOpportunity } = useLeads();
  const [formData, setFormData] = useState<OpportunityFormData>({
    name: '',
    stage: OpportunityStage.PROSPECTING,
    amount: undefined,
    accountName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when lead changes
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        stage: OpportunityStage.PROSPECTING,
        amount: undefined,
        accountName: lead.company,
      });
      setErrors({});
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    // Validate form data
    const validationErrors = validateOpportunity(formData);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsSubmitting(true);
    try {
      await convertToOpportunity(lead.id, formData);
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof OpportunityFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const stageOptions = [
    { value: OpportunityStage.PROSPECTING, label: 'Prospecting' },
    { value: OpportunityStage.QUALIFICATION, label: 'Qualification' },
    { value: OpportunityStage.PROPOSAL, label: 'Proposal' },
    { value: OpportunityStage.NEGOTIATION, label: 'Negotiation' },
    { value: OpportunityStage.CLOSED_WON, label: 'Closed Won' },
    { value: OpportunityStage.CLOSED_LOST, label: 'Closed Lost' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Convert Lead to Opportunity'>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Opportunity Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder='Enter opportunity name'
            error={errors.name}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Account Name</label>
          <Input
            value={formData.accountName}
            onChange={(e) => handleFieldChange('accountName', e.target.value)}
            placeholder='Enter account name'
            error={errors.accountName}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Stage</label>
          <Select
            value={formData.stage}
            onChange={(e) => handleFieldChange('stage', e.target.value)}
            options={stageOptions}
            error={errors.stage}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Amount (Optional)</label>
          <Input
            type='number'
            min='0'
            step='0.01'
            value={formData.amount || ''}
            onChange={(e) =>
              handleFieldChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)
            }
            placeholder='Enter amount'
            error={errors.amount}
          />
        </div>

        <div className='flex justify-end space-x-3 pt-4'>
          <Button
            type='button'
            variant='secondary'
            onClick={onClose}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='primary'
            loading={isSubmitting}>
            Convert Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OpportunityConversionModal;
