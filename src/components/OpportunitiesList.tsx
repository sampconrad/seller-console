/**
 * Opportunities list component with management functionality
 */

import { useDebounce } from '@/hooks/useDebounce';
import { useOpportunities } from '@/hooks/useOpportunities';
import type { Opportunity, TableColumn } from '@/types';
import { OpportunityStage } from '@/types';
import {
  formatDate,
  formatNumber,
  formatStage,
  getStageColor,
  sortOpportunities,
} from '@/utils/dataTransform';
import { Calendar, DollarSign, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Filters from './Filters';
import FormatSelectionModal from './FormatSelectionModal';
import OpportunityDetailPanel from './OpportunityDetailPanel';
import Pagination from './Pagination';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Table from './ui/Table';

const OpportunitiesList: React.FC = () => {
  const {
    opportunities,
    loading,
    filters,
    sortConfig,
    updateFilters,
    updateSearch,
    updateSort,
    deleteOpportunity,
    exportOpportunities,
  } = useOpportunities();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filtering state
  const [searchValue, setSearchValue] = useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);

  const handleOpportunityClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailPanelOpen(true);
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

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedOpportunity(null);
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

  // Sort filtered opportunities
  const sortedOpportunities = sortOpportunities(filteredOpportunities, sortConfig);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters.stage]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOpportunities = sortedOpportunities.slice(startIndex, endIndex);

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
          <span className={`font-medium ${value ? 'text-green-600' : 'text-gray-500'}`}>
            {value ? formatNumber(value as number) : 'Not specified'}
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
        totalItems={sortedOpportunities.length}
        itemLabel='opportunity'
      />

      <Table
        data={paginatedOpportunities}
        columns={columns}
        onSort={(field, direction) => updateSort(field, direction)}
        sortField={sortConfig.field}
        sortDirection={sortConfig.direction}
        loading={loading}
        emptyMessage='No opportunities found. Convert some leads to get started.'
        onRowClick={handleOpportunityClick}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedOpportunities.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
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

      <OpportunityDetailPanel
        opportunity={selectedOpportunity}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
      />
    </div>
  );
};

export default OpportunitiesList;
