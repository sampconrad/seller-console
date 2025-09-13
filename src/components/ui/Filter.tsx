import { FilterProps } from '@/types';
import { getFilterColors } from '@/utils/dataTransform';
import React, { memo, useCallback } from 'react';

const Filter: React.FC<FilterProps> = memo(
  ({ options, activeValue, onFilterChange, type, className = '' }) => {
    const handleFilterChange = useCallback(
      (value: string) => {
        onFilterChange(value);
      },
      [onFilterChange]
    );

    return (
      <div className={`space-y-2 ${className}`}>
        {options.map(option => {
          const isActive = activeValue === option.value;
          const colors = getFilterColors(type, option.value, isActive);

          return (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${colors.button}`}
            >
              <span>{option.label}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors.count}`}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);

Filter.displayName = 'Filter';

export default Filter;
