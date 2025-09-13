/**
 * Modal for selecting export/import format
 */

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ImportExportModalProps } from '@/types';
import { FileText, Table } from 'lucide-react';
import React from 'react';

const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onFormatSelect,
  title,
  description,
}) => {
  const handleFormatSelect = (format: 'json' | 'csv') => {
    onFormatSelect(format);
    onClose();
  };

  const footer = (
    <div className='p-6 flex flex-col'>
      <Button
        type='button'
        variant='secondary'
        onClick={onClose}
        className='w-full order-1'
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <div className='space-y-4'>
        <p className='text-gray-600'>{description}</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* JSON Option */}
          <button
            onClick={() => handleFormatSelect('json')}
            className='p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left'
          >
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <FileText className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>JSON</h3>
                <p className='text-sm text-gray-500'>Structured data format</p>
              </div>
            </div>
          </button>

          {/* CSV Option */}
          <button
            onClick={() => handleFormatSelect('csv')}
            className='p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left'
          >
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Table className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>CSV</h3>
                <p className='text-sm text-gray-500'>Spreadsheet format</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportExportModal;
