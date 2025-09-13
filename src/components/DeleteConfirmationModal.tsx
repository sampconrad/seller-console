/**
 * Reusable delete confirmation modal component
 */

import { AlertTriangle } from 'lucide-react';
import React from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { DeleteConfirmationModalProps } from '@/types';

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}>
      <div className='space-y-4'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <AlertTriangle className='w-6 h-6 text-warning-600' />
          </div>
          <div className='flex-1'>
            <p className='text-gray-600'>
              {message}
              {itemName && <span className='font-medium text-gray-900'> "{itemName}"</span>}? This
              action cannot be undone.
            </p>
          </div>
        </div>

        <div className='flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4'>
          <Button
            variant='secondary'
            onClick={onClose}
            disabled={isLoading}
            className='w-full sm:w-auto mt-3 sm:mt-0'>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={handleConfirm}
            loading={isLoading}
            className='w-full sm:w-auto'>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
