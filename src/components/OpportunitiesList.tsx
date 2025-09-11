/**
 * Opportunities list component with management functionality
 */

import { useDebounce } from '@/hooks/useDebounce';
import { useOpportunities } from '@/hooks/useOpportunities';
import type { Opportunity, TableColumn } from '@/types';
import { OpportunityStage } from '@/types';
import { formatCurrency, formatDate, formatStage, getStageColor } from '@/utils/dataTransform';
import { Calendar, DollarSign, Edit2, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Filters from './Filters';
import FormatSelectionModal from './FormatSelectionModal';
import OpportunityFormModal from './OpportunityFormModal';
import Pagination from './Pagination';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Table from './ui/Table';

const OpportunitiesList: React.FC = () => {
  const {
    opportunities,
    loading,
    filters,
    updateFilters,
    updateSearch,
    deleteOpportunity,
    exportOpportunities,
  } = useOpportunities();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filtering state
  const [searchValue, setSearchValue] = useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);

  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setIsEditModalOpen(true);
  };

  const handleDelete = (opportunity: Opportunity) => {
    setOpportunityToDelete(opportunity);
    setIsDeleteModalOpen(true);
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

  // Update search filter when debounced value changes (doesn't save to localStorage)
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
  };

  const handleStageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ stage: e.target.value as OpportunityStage | 'all' });
  };

  // Filter opportunities based on search and stage
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      opportunity.accountName.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStage = filters.stage === 'all' || opportunity.stage === filters.stage;

    return matchesSearch && matchesStage;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters.stage]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const stageOptions = [
    { value: 'all', label: 'All Stages' },
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
      width: '300px',
      render: (value, opportunity) => (
        <div className='w-full min-w-0'>
          <div
            className='font-medium text-gray-900 truncate'
            title={value as string}>
            {value}
          </div>
          <div
            className='text-sm text-gray-500 truncate'
            title={opportunity.accountName}>
            {opportunity.accountName}
          </div>
          <div
            className='text-xs text-gray-400 font-mono truncate'
            title={`#${opportunity.id}`}>
            #{opportunity.id}
          </div>
        </div>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      width: '160px',
      render: (value) => (
        <Badge className={getStageColor(value as string)}>
          {formatStage(value as string).toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      width: '170px',
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
      width: '150px',
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
      width: '120px',
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
      <div className='w-full text-center sm:text-left'>
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
          Export Opps
        </Button>
      </div>

      <Filters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        searchPlaceholder='Search opportunities...'
        filterValue={filters.stage}
        onFilterChange={handleStageFilterChange}
        filterOptions={stageOptions}
        totalItems={filteredOpportunities.length}
        itemLabel='opportunity'
      />

      <Table
        data={paginatedOpportunities}
        columns={columns}
        loading={loading}
        emptyMessage='No opportunities found. Convert some leads to get started.'
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredOpportunities.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

      <OpportunityFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingOpportunity(null);
        }}
        mode='edit'
        opportunity={editingOpportunity}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Opportunity'
        message='Are you sure you want to delete the opportunity'
        itemName={opportunityToDelete?.name}
      />

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
