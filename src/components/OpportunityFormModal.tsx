/**
 * Modal for converting leads to opportunities
 */

import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useLeads } from '@/hooks/useLeads';
import type { OpportunityFormData, OpportunityFormModalProps } from '@/types';
import { OpportunityStage } from '@/types';
import { handleAmountInputChange } from '@/utils/dataTransform';
import { convertValidationErrorsToMap, validateOpportunity } from '@/utils/validation';
import { DollarSign, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import Select from './ui/Select';

const OpportunityFormModal: React.FC<OpportunityFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lead,
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
  const [amountDisplay, setAmountDisplay] = useState('');

  // Reset form when modal opens/closes or data changes
  useEffect(() => {
    if (isOpen && lead) {
      setFormData({
        name: lead.name,
        stage: OpportunityStage.PROSPECTING,
        amount: undefined,
        accountName: lead.company,
      });
      setAmountDisplay('');
      setErrors({});
    } else {
      setFormData({
        name: '',
        stage: OpportunityStage.PROSPECTING,
        amount: undefined,
        accountName: '',
      });
      setAmountDisplay('');
      setErrors({});
    }
  }, [isOpen, lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateOpportunity(formData);
    if (validationErrors.length > 0) {
      setErrors(convertValidationErrorsToMap(validationErrors));
      return;
    }

    setIsSubmitting(true);
    try {
      if (lead) {
        await convertToOpportunity(lead.id, formData);
        onSuccess?.(); // Call success callback for conversion
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hooks
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAmountInputChange(
      e.target.value,
      (amount) => handleFieldChange('amount', amount),
      setAmountDisplay
    );
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      stage: OpportunityStage.PROSPECTING,
      amount: undefined,
      accountName: '',
    });
    setAmountDisplay('');
    setErrors({});
    onClose();
  };

  // Keyboard navigation for form
  useKeyboardNavigation({
    onEscape: handleCancel,
    onEnter: () => {
      // Submit form when Enter is pressed (but not in input fields)
      if (!isSubmitting) {
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      }
    },
    enabled: isOpen,
  });

  const stageOptions = [
    { value: OpportunityStage.PROSPECTING, label: 'Prospecting' },
    { value: OpportunityStage.QUALIFICATION, label: 'Qualification' },
    { value: OpportunityStage.PROPOSAL, label: 'Proposal' },
    { value: OpportunityStage.NEGOTIATION, label: 'Negotiation' },
    { value: OpportunityStage.CLOSED_WON, label: 'Closed Won' },
    { value: OpportunityStage.CLOSED_LOST, label: 'Closed Lost' },
  ];

  const title = 'Convert Lead to Opportunity';
  const submitText = 'Convert Lead';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}>
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
            type='text'
            value={amountDisplay}
            onChange={handleAmountChange}
            placeholder='0.00'
            error={errors.amount}
            leftIcon={<DollarSign className='w-4 h-4 text-gray-400' />}
          />
        </div>

        <div className='flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200'>
          <Button
            type='button'
            variant='secondary'
            onClick={handleCancel}
            className='w-full sm:w-auto order-2 sm:order-1 mt-3 sm:mt-0'>
            <X className='w-4 h-4 mr-2' />
            Cancel
          </Button>
          <Button
            type='submit'
            variant='primary'
            loading={isSubmitting}
            disabled={isSubmitting}
            className='w-full sm:w-auto order-1 sm:order-2'>
            {isSubmitting ? 'Saving...' : submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OpportunityFormModal;
