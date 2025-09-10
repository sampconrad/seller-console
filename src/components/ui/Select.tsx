import { ChevronDown } from 'lucide-react';
import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', ...props }, ref) => {
    const baseClasses =
      'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors appearance-none bg-white';

    const stateClasses = error
      ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';

    const selectClasses = `${baseClasses} ${stateClasses} ${className}`;

    return (
      <div className='w-full'>
        {label && <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>}
        <div className='relative'>
          <select
            ref={ref}
            className={selectClasses}
            {...props}>
            {placeholder && (
              <option
                value=''
                disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
            <ChevronDown className='w-4 h-4 text-gray-400' />
          </div>
        </div>
        {error && <p className='mt-1 text-sm text-error-600'>{error}</p>}
        {helperText && !error && <p className='mt-1 text-sm text-gray-500'>{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
