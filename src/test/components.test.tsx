/**
 * Unit tests for React components
 */

import DeleteModal from '@/components/modals/DeleteModal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AppProvider } from '@/context/AppContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    <NotificationProvider>{children}</NotificationProvider>
  </AppProvider>
);

describe('UI Components', () => {
  describe('Button', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should call onClick handler', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render different variants', () => {
      const { rerender } = render(<Button variant='primary'>Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

      rerender(<Button variant='secondary'>Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-200');

      rerender(<Button variant='danger'>Danger</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-error-600');
    });
  });

  describe('Input', () => {
    it('should render input with label', () => {
      render(<Input id='test-input' label='Test Label' />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<Input error='This field is required' />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should display helper text', () => {
      render(<Input helperText='This is helpful' />);
      expect(screen.getByText('This is helpful')).toBeInTheDocument();
    });

    it('should handle value changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Badge', () => {
    it('should render badge with text', () => {
      render(<Badge>Success</Badge>);
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should render different variants', () => {
      const { rerender } = render(<Badge variant='success'>Success</Badge>);
      expect(screen.getByText('Success')).toHaveClass('bg-success-100');

      rerender(<Badge variant='error'>Error</Badge>);
      expect(screen.getByText('Error')).toHaveClass('bg-error-100');

      rerender(<Badge variant='warning'>Warning</Badge>);
      expect(screen.getByText('Warning')).toHaveClass('bg-warning-100');
    });

    it('should render different sizes', () => {
      const { rerender } = render(<Badge size='sm'>Small</Badge>);
      expect(screen.getByText('Small')).toHaveClass('text-xs');

      rerender(<Badge size='lg'>Large</Badge>);
      expect(screen.getByText('Large')).toHaveClass('text-sm');
    });
  });

  describe('DeleteModal', () => {
    const defaultProps = {
      isOpen: true,
      onClose: vi.fn(),
      onConfirm: vi.fn(),
      title: 'Delete Item',
      message: 'Are you sure you want to delete',
      itemName: 'Test Item',
    };

    it('should render modal when open', () => {
      render(<DeleteModal {...defaultProps} />);
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      render(<DeleteModal {...defaultProps} isOpen={false} />);
      const modal = screen.queryByText('Delete Item');
      expect(modal).not.toBeVisible();
    });

    it('should call onConfirm when delete button is clicked', () => {
      const onConfirm = vi.fn();
      render(<DeleteModal {...defaultProps} onConfirm={onConfirm} />);

      fireEvent.click(screen.getByText('Delete'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is clicked', () => {
      const onClose = vi.fn();
      render(<DeleteModal {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByText('Cancel'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should show loading state when isLoading is true', () => {
      render(<DeleteModal {...defaultProps} isLoading={true} />);
      expect(screen.getByText('Delete')).toBeDisabled();
      expect(screen.getByText('Cancel')).toBeDisabled();
    });
  });
});

describe('Integration Tests', () => {
  it('should render app without crashing', () => {
    render(
      <TestWrapper>
        <div>Test App</div>
      </TestWrapper>
    );
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });
});
