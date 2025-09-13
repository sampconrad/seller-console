/**
 * Tests for custom hooks
 */

import { act, renderHook } from '@testing-library/react';
import React from 'react';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { AppProvider } from '../context/AppContext';
import { NotificationProvider } from '../context/NotificationContext';
import { useDebounce } from '../hooks/useDebounce';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useSidebar } from '../hooks/useSidebar';

// Mock timers
beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

describe('useDebounce', () => {
  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset timer on value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Change value multiple times
    rerender({ value: 'first', delay: 500 });
    rerender({ value: 'second', delay: 500 });
    rerender({ value: 'third', delay: 500 });

    // Fast-forward less than delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('initial');

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('third');
  });
});

describe('useKeyboardNavigation', () => {
  it('should call handlers on key press', () => {
    const onEnter = vi.fn();
    const onEscape = vi.fn();
    const onArrowUp = vi.fn();

    renderHook(() =>
      useKeyboardNavigation({
        onEnter,
        onEscape,
        onArrowUp,
        enabled: true,
      })
    );

    // Test Enter key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
    });

    expect(onEnter).toHaveBeenCalledTimes(1);

    // Test Escape key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });

    expect(onEscape).toHaveBeenCalledTimes(1);

    // Test Arrow Up key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);
    });

    expect(onArrowUp).toHaveBeenCalledTimes(1);
  });

  it('should not call handlers when disabled', () => {
    const onEnter = vi.fn();

    renderHook(() =>
      useKeyboardNavigation({
        onEnter,
        enabled: false,
      })
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
    });

    expect(onEnter).not.toHaveBeenCalled();
  });
});

describe('useSidebar', () => {
  const mockProps = {
    activeTab: 'leads' as const,
    onTabChange: vi.fn(),
    onImportLeads: vi.fn(),
    onExportLeads: vi.fn(),
    onNewLead: vi.fn(),
    onGenerateReport: vi.fn(),
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(NotificationProvider, {
      children: React.createElement(AppProvider, { children }),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useSidebar(mockProps), { wrapper });

    expect(result.current.isImportModalOpen).toBe(false);
    expect(result.current.isExportModalOpen).toBe(false);
    expect(result.current.isMobileMenuOpen).toBe(false);
    expect(result.current.sidebarContentProps).toBeDefined();
  });

  it('should handle import format selection', () => {
    const { result } = renderHook(() => useSidebar(mockProps), { wrapper });

    act(() => {
      result.current.handleImportFormatSelect('json');
    });

    expect(mockProps.onImportLeads).toHaveBeenCalledWith('json');
    expect(result.current.isImportModalOpen).toBe(false);
  });

  it('should handle export format selection', () => {
    const { result } = renderHook(() => useSidebar(mockProps), { wrapper });

    act(() => {
      result.current.handleExportFormatSelect('csv');
    });

    expect(mockProps.onExportLeads).toHaveBeenCalledWith('csv');
    expect(result.current.isExportModalOpen).toBe(false);
  });

  it('should toggle mobile menu', () => {
    const { result } = renderHook(() => useSidebar(mockProps), { wrapper });

    expect(result.current.isMobileMenuOpen).toBe(false);

    act(() => {
      result.current.toggleMobileMenu();
    });

    expect(result.current.isMobileMenuOpen).toBe(true);
  });

  it('should close mobile menu', () => {
    const { result } = renderHook(() => useSidebar(mockProps), { wrapper });

    // First open the menu
    act(() => {
      result.current.toggleMobileMenu();
    });

    expect(result.current.isMobileMenuOpen).toBe(true);

    // Then close it
    act(() => {
      result.current.closeMobileMenu();
    });

    expect(result.current.isMobileMenuOpen).toBe(false);
  });

  it('should provide sidebar content props', () => {
    const { result } = renderHook(() => useSidebar(mockProps), { wrapper });

    expect(result.current.sidebarContentProps).toMatchObject({
      activeTab: 'leads',
      onTabChange: mockProps.onTabChange,
      onNewLead: mockProps.onNewLead,
      onGenerateReport: mockProps.onGenerateReport,
    });
  });
});
