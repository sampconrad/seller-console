/**
 * Opportunities list component with management functionality
 */

import { useOpportunities } from '@/hooks/useOpportunities';
import type { Opportunity, TableColumn } from '@/types';
import { OpportunityStage } from '@/types';
import { formatCurrency, formatDate, getStageColor } from '@/utils/dataTransform';
import { Calendar, DollarSign, Upload, Edit2, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FormatSelectionModal from './FormatSelectionModal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import Select from './ui/Select';
import Table from './ui/Table';

const OpportunitiesList: React.FC = () => {
  const { opportunities, loading, updateOpportunity, deleteOpportunity, exportOpportunities } =
    useOpportunities();
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);
  const [formData, setFormData] = useState<Partial<Opportunity>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData(opportunity);
    setIsEditModalOpen(true);
  };

  const handleDelete = (opportunity: Opportunity) => {
    setOpportunityToDelete(opportunity);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingOpportunity) return;

    setIsSaving(true);
    try {
      await updateOpportunity(editingOpportunity.id, formData);
      setIsEditModalOpen(false);
      setEditingOpportunity(null);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!opportunityToDelete) return;

    try {
      await deleteOpportunity(opportunityToDelete.id);
      setIsDeleteModalOpen(false);
      setOpportunityToDelete(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExportFormatSelect = (format: 'json' | 'csv') => {
    exportOpportunities({ format, includeOpportunities: true });
  };

  const stageOptions = [
    { value: OpportunityStage.PROSPECTING, label: 'Prospecting' },
    { value: OpportunityStage.QUALIFICATION, label: 'Qualification' },
    { value: OpportunityStage.PROPOSAL, label: 'Proposal' },
    { value: OpportunityStage.NEGOTIATION, label: 'Negotiation' },
    { value: OpportunityStage.CLOSED_WON, label: 'Closed Won' },
    { value: OpportunityStage.CLOSED_LOST, label: 'Closed Lost' },
  ];

  const columns: TableColumn<Opportunity>[] = [
    {
      key: 'name',
      label: 'Opportunity',
      sortable: true,
      render: (value, opportunity) => (
        <div>
          <div className='font-medium text-gray-900'>{value}</div>
          <div className='text-sm text-gray-500'>{opportunity.accountName}</div>
          <div className='text-xs text-gray-400 font-mono'>#{opportunity.id}</div>
        </div>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      render: (value) => (
        <Badge className={getStageColor(value as string)}>{(value as string).toUpperCase()}</Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <div className='flex items-center space-x-1'>
          <DollarSign className='w-4 h-4 text-gray-400' />
          <span className='font-medium'>
            {value ? formatCurrency(value as number) : 'Not specified'}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <div className='flex items-center space-x-1'>
          <Calendar className='w-4 h-4 text-gray-400' />
          <span>{formatDate(value as Date)}</span>
        </div>
      ),
    },
    {
      key: 'id' as keyof Opportunity,
      label: 'Actions',
      render: (_, opportunity) => (
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => handleEdit(opportunity)}
            className='text-primary-600 hover:text-primary-800 transition-colors mr-2'
            title='Edit opportunity'>
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDelete(opportunity)}
            className='text-error-600 hover:text-error-800 transition-colors'
            title='Delete opportunity'>
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='w-full'>
        <h1 className='text-2xl font-bold text-gray-900'>Opportunities</h1>
        <p className='text-gray-600'>Manage your converted opportunities</p>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 w-full'>
        <Button
          variant='secondary'
          onClick={handleExport}
          disabled={opportunities.length === 0}
          className='w-full sm:w-auto'>
          <Upload className='w-4 h-4 mr-2' />
          Export
        </Button>
      </div>

      {/* Table */}
      <Table
        data={opportunities}
        columns={columns}
        loading={loading}
        emptyMessage='No opportunities found. Convert some leads to get started.'
      />

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Opportunity'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Opportunity Name</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Account Name</label>
            <Input
              value={formData.accountName || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountName: e.target.value }))}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Stage</label>
            <Select
              value={formData.stage || OpportunityStage.PROSPECTING}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, stage: e.target.value as OpportunityStage }))
              }
              options={stageOptions}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Amount</label>
            <Input
              type='number'
              min='0'
              step='0.01'
              value={formData.amount || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: e.target.value ? parseFloat(e.target.value) : undefined,
                }))
              }
            />
          </div>

          <div className='flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setIsEditModalOpen(false)}
              className='w-full sm:w-auto order-2 sm:order-1 mt-3 sm:mt-0'>
              <X className='w-4 h-4 mr-2' />
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              onClick={handleSaveEdit}
              className='w-full sm:w-auto order-1 sm:order-2'
              loading={isSaving}
              disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Opportunity'
        message='Are you sure you want to delete the opportunity'
        itemName={opportunityToDelete?.name}
      />

      {/* Export Format Selection Modal */}
      <FormatSelectionModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onFormatSelect={handleExportFormatSelect}
        title='Export Opportunities'
        description='Choose the format for exporting opportunities'
      />
    </div>
  );
};

export default OpportunitiesList;
