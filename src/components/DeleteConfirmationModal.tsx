/**
 * Reusable delete confirmation modal component
 */

import { AlertTriangle } from 'lucide-react';
import React from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

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

        <div className='flex justify-end space-x-3 pt-4'>
          <Button
            variant='secondary'
            onClick={onClose}
            disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={handleConfirm}
            loading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
