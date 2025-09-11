/**
 * Slide-over panel for opportunity details with inline editing
 */

import { useOpportunities } from '@/hooks/useOpportunities';
import type { Opportunity } from '@/types';
import { OpportunityStage } from '@/types';
import { formatDateTime, formatNumber, formatStage, getStageColor, handleAmountInputChange } from '@/utils/dataTransform';
import { convertValidationErrorsToMap, validateOpportunity } from '@/utils/validation';
import {
  Building,
  Calendar,
  X as Cancel,
  DollarSign,
  Edit2,
  GripVertical,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface OpportunityDetailPanelProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

const OpportunityDetailPanel: React.FC<OpportunityDetailPanelProps> = ({ 
  opportunity, 
  isOpen, 
  onClose 
}) => {
  const { updateOpportunity, deleteOpportunity } = useOpportunities();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Opportunity>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [amountDisplay, setAmountDisplay] = useState('');

  // Drag functionality
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTransform, setDragStartTransform] = useState(0);
  const [currentTransform, setCurrentTransform] = useState(0);

  // Reset form when opportunity changes
  useEffect(() => {
    if (opportunity) {
      setFormData(opportunity);
      setAmountDisplay(opportunity.amount ? opportunity.amount.toString() : '');
      setErrors({});
      setIsEditing(false);
    }
  }, [opportunity]);

  // Reset transform when panel opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentTransform(0);
    }
  }, [isOpen]);

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (!panelRef.current) return;

      setIsDragging(true);
      setDragStartX(e.clientX);
      setDragStartTransform(currentTransform);

      // Prevent text selection during drag
      e.preventDefault();
    },
    [currentTransform]
  );

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !panelRef.current) return;

      const deltaX = e.clientX - dragStartX;
      const newTransform = Math.max(0, Math.min(384, dragStartTransform + deltaX)); // 384px is panel width
      setCurrentTransform(newTransform);
    },
    [isDragging, dragStartX, dragStartTransform]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // If dragged more than 50% of panel width, close it
    if (currentTransform > 192) {
      // 50% of 384px
      onClose();
    } else {
      // Snap back to open position
      setCurrentTransform(0);
    }
  }, [isDragging, currentTransform, onClose]);

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Don't reset formData - keep the current state (which includes any saved changes)
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!opportunity) return;

    // Validate form data
    const validationErrors = validateOpportunity(formData);
    if (validationErrors.length > 0) {
      setErrors(convertValidationErrorsToMap(validationErrors));
      return;
    }

    setIsSaving(true);
    try {
      await updateOpportunity(opportunity.id, formData);
      // Update formData with the saved values to reflect changes immediately
      setFormData(formData);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!opportunity) return;

    try {
      await deleteOpportunity(opportunity.id);
      setIsDeleteModalOpen(false);
      onClose(); // Close the panel after successful deletion
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleFieldChange = (field: keyof Opportunity, value: any) => {
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

  const stageOptions = [
    { value: OpportunityStage.PROSPECTING, label: 'Prospecting' },
    { value: OpportunityStage.QUALIFICATION, label: 'Qualification' },
    { value: OpportunityStage.PROPOSAL, label: 'Proposal' },
    { value: OpportunityStage.NEGOTIATION, label: 'Negotiation' },
    { value: OpportunityStage.CLOSED_WON, label: 'Closed Won' },
    { value: OpportunityStage.CLOSED_LOST, label: 'Closed Lost' },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className='fixed inset-y-0 right-0 max-w-full w-96 bg-white shadow-xl transform'
        style={{
          transform: `translateX(${isDragging ? currentTransform : isOpen ? 0 : 384}px)`,
          transition: isDragging ? 'none' : 'transform 300ms ease-in-out',
        }}>
        {/* Draggable Lip - Hidden on mobile and when panel is closed */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-8 h-24 bg-gray-200 hover:bg-gray-300 rounded-l-lg cursor-grab active:cursor-grabbing items-center justify-center group transition-colors duration-200 hidden sm:flex ${
            !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onMouseDown={handleDragStart}>
          <GripVertical className='w-4 h-4 text-gray-500 group-hover:text-gray-700' />
        </div>
        <div className='h-full flex flex-col'>
          {/* Header */}
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Details</h2>
              <div className='flex items-center space-x-2'>
                {!isEditing ? (
                  <>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleDeleteClick}>
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleEdit}>
                      <Edit2 className='w-4 h-4 mr-2' />
                      Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleCancel}>
                      <Cancel className='w-4 h-4 mr-2' />
                      Cancel
                    </Button>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={handleSave}
                      loading={isSaving}
                      disabled={isSaving}>
                      {!isSaving && <Save className='w-4 h-4 mr-2' />}
                      {isSaving ? 'Saving' : 'Save'}
                    </Button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-600 transition-colors'>
                  <X className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto p-6 space-y-6'>
            {!opportunity ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-gray-500'>No opportunity selected</div>
              </div>
            ) : (
              <>
                {/* Opportunity ID */}
                <div className='pb-2 border-b border-gray-200'>
                  <div className='text-sm text-gray-500'>Opportunity ID</div>
                  <div className='text-lg font-mono text-gray-900'>{opportunity.id}</div>
                </div>

                {/* Stage */}
                {!isEditing && (
                  <div className='flex items-center justify-between'>
                    <Badge className={getStageColor(formData.stage || opportunity.stage)}>
                      {formatStage(formData.stage || opportunity.stage).toUpperCase()}
                    </Badge>
                  </div>
                )}

                {/* Basic Information */}
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                    {isEditing ? (
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        error={errors.name}
                      />
                    ) : (
                      <p className='text-gray-900'>{formData.name || opportunity.name}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Account Name</label>
                    {isEditing ? (
                      <Input
                        value={formData.accountName || ''}
                        onChange={(e) => handleFieldChange('accountName', e.target.value)}
                        error={errors.accountName}
                      />
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <Building className='w-4 h-4 text-gray-400' />
                        <p className='text-gray-900'>{formData.accountName || opportunity.accountName}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Amount</label>
                    {isEditing ? (
                      <div className='relative'>
                        <Input
                          type='text'
                          value={amountDisplay}
                          onChange={handleAmountChange}
                          placeholder='0.00'
                          error={errors.amount}
                          leftIcon={<DollarSign className='w-4 h-4 text-gray-400' />}
                        />
                      </div>
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <DollarSign className='w-4 h-4 text-gray-400' />
                        <p className={`font-medium ${(formData.amount || opportunity.amount) ? 'text-green-600' : 'text-gray-500'}`}>
                          {formData.amount || opportunity.amount 
                            ? formatNumber(formData.amount || opportunity.amount!)
                            : 'Not specified'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Stage</label>
                    {isEditing ? (
                      <Select
                        value={formData.stage || opportunity.stage}
                        onChange={(e) => handleFieldChange('stage', e.target.value)}
                        options={stageOptions}
                        error={errors.stage}
                      />
                    ) : (
                      <p className='text-gray-900'>{formatStage(formData.stage || opportunity.stage)}</p>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className='pt-4 border-t border-gray-200 space-y-2'>
                  <div className='flex items-center space-x-2 text-sm text-gray-500'>
                    <Calendar className='w-4 h-4' />
                    <span>Created: {formatDateTime(opportunity.createdAt)}</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-500'>
                    <Calendar className='w-4 h-4' />
                    <span>Updated: {formatDateTime(opportunity.updatedAt)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Opportunity'
        message='Are you sure you want to delete the opportunity'
        itemName={opportunity?.name}
      />
    </div>
  );
};

export default OpportunityDetailPanel;
