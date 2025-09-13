/**
 * Slide-over panel for lead details with inline editing
 */

import ConfirmationModal from '@/components/modals/ConfirmationModal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ScoreDial from '@/components/ui/ScoreDial';
import Select from '@/components/ui/Select';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useLeads } from '@/hooks/useLeads';
import type { Lead } from '@/types';
import { LeadDetailPanelProps, LeadStatus } from '@/types';
import {
  formatDateTime,
  formatSource,
  getScoreColor,
  getStatusColor,
} from '@/utils/dataTransform';
import { convertValidationErrorsToMap, validateLead } from '@/utils/validation';
import {
  Building,
  Calendar,
  X as Cancel,
  Edit2,
  GripVertical,
  Mail,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  lead,
  isOpen,
  onClose,
  onConvert,
}) => {
  const { updateLead, deleteLead } = useLeads();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Drag functionality
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTransform, setDragStartTransform] = useState(0);
  const [currentTransform, setCurrentTransform] = useState(0);

  // Reset form when lead changes
  useEffect(() => {
    if (lead) {
      setFormData(lead);
      setErrors({});
      setIsEditing(false);
    }
  }, [lead]);

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
      const newTransform = Math.max(
        0,
        Math.min(384, dragStartTransform + deltaX)
      ); // 384px is panel width
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

  // Keyboard navigation for detail panel
  useKeyboardNavigation({
    onEscape: () => {
      if (isEditing) {
        handleCancel();
      } else {
        onClose();
      }
    },
    onEnter: () => {
      if (isEditing && !isSaving) {
        handleSave();
      }
    },
    enabled: isOpen,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(lead || {});
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!lead) return;

    // Validate form data
    const validationErrors = validateLead(formData);
    if (validationErrors.length > 0) {
      setErrors(convertValidationErrorsToMap(validationErrors));
      return;
    }

    setIsSaving(true);
    try {
      await updateLead(lead.id, formData);
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
    if (!lead) return;

    try {
      await deleteLead(lead.id);
      setIsDeleteModalOpen(false);
      onClose(); // Close the panel after successful deletion
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleFieldChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const statusOptions = [
    { value: LeadStatus.NEW, label: 'New' },
    { value: LeadStatus.CONTACTED, label: 'Contacted' },
    { value: LeadStatus.QUALIFIED, label: 'Qualified' },
    { value: LeadStatus.UNQUALIFIED, label: 'Unqualified' },
    { value: LeadStatus.CONVERTED, label: 'Converted' },
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
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
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
        }}
      >
        {/* Draggable Lip - Hidden on mobile and when panel is closed */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-8 h-24 bg-gray-200 hover:bg-gray-300 rounded-l-lg cursor-grab active:cursor-grabbing items-center justify-center group transition-colors duration-200 hidden sm:flex ${
            !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onMouseDown={handleDragStart}
        >
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
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </Button>
                    <Button variant='ghost' size='sm' onClick={handleEdit}>
                      <Edit2 className='w-4 h-4 mr-2' />
                      Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant='ghost' size='sm' onClick={handleCancel}>
                      <Cancel className='w-4 h-4 mr-2' />
                      Cancel
                    </Button>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={handleSave}
                      loading={isSaving}
                      disabled={isSaving}
                    >
                      {!isSaving && <Save className='w-4 h-4 mr-2' />}
                      {isSaving ? 'Saving' : 'Save'}
                    </Button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto p-6 space-y-6'>
            {!lead ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-gray-500'>No lead selected</div>
              </div>
            ) : (
              <>
                {/* Lead ID */}
                <div className='pb-2 border-b border-gray-200'>
                  <div className='text-sm text-gray-500'>Lead ID</div>
                  <div className='text-lg font-mono text-gray-900'>
                    {lead.id}
                  </div>
                </div>

                {/* Status and Score */}
                {!isEditing && (
                  <div className='flex items-center justify-between'>
                    <Badge
                      className={getStatusColor(formData.status || lead.status)}
                    >
                      {(formData.status || lead.status).toUpperCase()}
                    </Badge>
                    <div className='flex items-center space-x-1'>
                      <Star className='w-4 h-4 text-yellow-500' />
                      <span
                        className={`font-medium ${getScoreColor(formData.score || lead.score)}`}
                      >
                        {formData.score || lead.score}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.name || ''}
                        onChange={e =>
                          handleFieldChange('name', e.target.value)
                        }
                        error={errors.name}
                      />
                    ) : (
                      <p className='text-gray-900'>
                        {formData.name || lead.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Company
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.company || ''}
                        onChange={e =>
                          handleFieldChange('company', e.target.value)
                        }
                        error={errors.company}
                      />
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <Building className='w-4 h-4 text-gray-400' />
                        <p className='text-gray-900'>
                          {formData.company || lead.company}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type='email'
                        value={formData.email || ''}
                        onChange={e =>
                          handleFieldChange('email', e.target.value)
                        }
                        error={errors.email}
                      />
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <Mail className='w-4 h-4 text-gray-400' />
                        <p className='text-gray-900'>
                          {formData.email || lead.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Source
                    </label>
                    {isEditing ? (
                      <Select
                        value={formData.source || ''}
                        onChange={e =>
                          handleFieldChange('source', e.target.value)
                        }
                        error={errors.source}
                        options={sourceOptions}
                        placeholder='Select source'
                      />
                    ) : (
                      <p className='text-gray-900'>
                        {formatSource(formData.source || lead.source)}
                      </p>
                    )}
                  </div>

                  <div>
                    {isEditing && (
                      <>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Status
                        </label>
                        <Select
                          value={formData.status || lead.status}
                          onChange={e =>
                            handleFieldChange('status', e.target.value)
                          }
                          options={statusOptions}
                          error={errors.status}
                        />
                      </>
                    )}
                  </div>

                  <div>
                    {isEditing && (
                      <ScoreDial
                        label='Score'
                        value={formData.score || lead.score}
                        onChange={value => handleFieldChange('score', value)}
                        error={errors.score}
                        min={1}
                        max={100}
                      />
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className='pt-4 border-t border-gray-200 space-y-2'>
                  <div className='flex items-center space-x-2 text-sm text-gray-500'>
                    <Calendar className='w-4 h-4' />
                    <span>Created: {formatDateTime(lead.createdAt)}</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-500'>
                    <Calendar className='w-4 h-4' />
                    <span>Updated: {formatDateTime(lead.updatedAt)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {lead &&
            (formData.status || lead.status) !== LeadStatus.CONVERTED && (
              <div className='px-6 py-4 border-t border-gray-200'>
                <Button
                  variant='primary'
                  onClick={() => onConvert({ ...lead, ...formData })}
                  disabled={isEditing}
                  className='w-full'
                >
                  Convert to Opportunity
                </Button>
              </div>
            )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Lead'
        message='Are you sure you want to delete the lead'
        itemName={lead?.name}
      />
    </div>
  );
};

export default LeadDetailPanel;
