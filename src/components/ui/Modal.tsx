import { useFocusManagement } from '@/hooks/useFocusManagement';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { ModalProps } from '@/types';
import { X } from 'lucide-react';
import React, { useRef } from 'react';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  const { containerRef } = useFocusManagement({
    enabled: isOpen,
    trapFocus: true,
    restoreFocus: true,
    initialFocusRef: closeButtonRef,
  });

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: onClose,
    enabled: isOpen,
  });

  // Handle body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4'>
        <div
          ref={containerRef}
          className='relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden'
          role='dialog'
          aria-modal='true'
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <h3
              id={ariaLabelledBy}
              className='text-lg font-semibold text-gray-900'>
              {title}
            </h3>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
              aria-label='Close modal'
              type='button'>
              <X
                className='w-6 h-6'
                aria-hidden='true'
              />
            </button>
          </div>

          {/* Content */}
          <div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
