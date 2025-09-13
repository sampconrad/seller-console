/**
 * Opportunities list component with management functionality
 */

import Pagination from '@/components/layout/Pagination';
import Searchbox from '@/components/layout/Searchbox';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import OpportunityDetailPanel from '@/components/panels/OpportunityDetailPanel';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import { useDebounce } from '@/hooks/useDebounce';
import { useOpportunities } from '@/hooks/useOpportunities';
import type { Opportunity, TableColumn } from '@/types';
import {
  formatDate,
  formatNumber,
  formatStage,
  getStageColor,
  sortOpportunities,
} from '@/utils/dataTransform';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';

const OpportunitiesTable: React.FC = memo(() => {
  const {
    opportunities,
    loading,
    filters,
    sortConfig,
    updateSearch,
    updateSort,
    deleteOpportunity,
  } = useOpportunities();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] =
    useState<Opportunity | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
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

  // Filter opportunities based on search and stage
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch =
      opportunity.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      opportunity.accountName
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

    const matchesStage =
      filters.stage === 'all' || opportunity.stage === filters.stage;

    return matchesSearch && matchesStage;
  });

  // Sort filtered opportunities
  const sortedOpportunities = sortOpportunities(
    filteredOpportunities,
    sortConfig
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters.stage]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOpportunities = sortedOpportunities.slice(
    startIndex,
    endIndex
  );

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

  const columns: TableColumn<Opportunity>[] = [
    {
      key: 'name',
      label: 'Opportunity',
      sortable: true,
      width: '200px',
      render: (value, opportunity) => (
        <div className='w-full'>
          <div className='font-medium text-gray-900'>{value}</div>
          <div className='text-sm text-gray-500'>{opportunity.accountName}</div>
          <div className='text-xs text-gray-400 font-mono'>
            #{opportunity.id}
          </div>
        </div>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      width: '200px',
      render: value => (
        <Badge className={getStageColor(value as string)}>
          {formatStage(value as string).toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      width: '200px',
      render: value => (
        <div className='flex items-center space-x-1'>
          <DollarSign className='w-4 h-4 text-gray-400' />
          <span
            className={`font-medium ${value ? 'text-green-600' : 'text-gray-500'}`}
          >
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
      render: value => (
        <div className='flex items-center space-x-1'>
          <Calendar className='w-4 h-4 text-gray-400' />
          <span className='inline'>{formatDate(value as Date)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className='h-full flex flex-col max-w-full'>
      {/* Header - Hidden on mobile, shown on lg+ */}
      <div className='hidden lg:block w-full text-left mb-6'>
        <div className='flex items-center space-x-3 mb-2'>
          <TrendingUp className='w-8 h-8 text-green-600' />
          <h1 className='text-2xl font-bold text-gray-900'>Opportunities</h1>
        </div>
        <p className='text-base text-gray-600'>
          Manage your converted opportunities
        </p>
      </div>

      <Searchbox
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        searchPlaceholder='Search opportunities by name or company...'
        totalItems={sortedOpportunities.length}
        itemLabel='opportunity'
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Table Container - Takes remaining space */}
      <div className='flex-1 min-h-0 flex flex-col'>
        <div className='flex-1 overflow-hidden'>
          <Table
            data={paginatedOpportunities}
            columns={columns}
            onSort={(field, direction) => updateSort(field, direction)}
            sortField={sortConfig.field}
            sortDirection={sortConfig.direction}
            loading={loading}
            emptyMessage='No opportunities found. Convert some leads to get started.'
            onRowClick={handleOpportunityClick}
            className='h-full'
          />
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Opportunity'
        message='Are you sure you want to delete the opportunity'
        itemName={opportunityToDelete?.name}
      />

      <OpportunityDetailPanel
        opportunity={selectedOpportunity}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
      />
    </div>
  );
});

OpportunitiesTable.displayName = 'OpportunitiesTable';

export default OpportunitiesTable;
