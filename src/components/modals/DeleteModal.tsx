/**
 * Reusable delete confirmation modal component
 */

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { DeleteModalProps } from '@/types';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

const DeleteModal: React.FC<DeleteModalProps> = ({
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

  const footer = (
    <div className='p-4 sm:p-6 flex flex-col'>
      <Button
        type='button'
        variant='secondary'
        onClick={onClose}
        disabled={isLoading}
        className='w-full order-2 mt-3'
      >
        Cancel
      </Button>
      <Button
        type='button'
        variant='danger'
        onClick={handleConfirm}
        loading={isLoading}
        className='w-full order-1'
      >
        Delete
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <div className='space-y-4'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <AlertTriangle className='w-6 h-6 text-warning-600' />
          </div>
          <div className='flex-1'>
            <p className='text-gray-600'>
              {message}
              {itemName && (
                <span className='font-medium text-gray-900'> "{itemName}"</span>
              )}
              ? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
