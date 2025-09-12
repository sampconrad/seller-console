/**
 * Reusable quick filter button component
 */

import { getQuickFilterColors } from '@/utils/dataTransform';
import React, { memo, useCallback } from 'react';

interface QuickFilterOption {
  value: string;
  label: string;
  count: number;
}

interface QuickFilterProps {
  options: QuickFilterOption[];
  activeValue: string;
  onFilterChange: (value: string) => void;
  type: 'lead' | 'opportunity';
  className?: string;
}

const QuickFilter: React.FC<QuickFilterProps> = memo(
  ({ options, activeValue, onFilterChange, type, className = '' }) => {
    const handleFilterChange = useCallback(
      (value: string) => {
        onFilterChange(value);
      },
      [onFilterChange]
    );

    return (
      <div className={`space-y-2 ${className}`}>
        {options.map((option) => {
          const isActive = activeValue === option.value;
          const colors = getQuickFilterColors(type, option.value, isActive);

          return (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${colors.button}`}>
              <span>{option.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.count}`}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);

QuickFilter.displayName = 'QuickFilter';

export default QuickFilter;
