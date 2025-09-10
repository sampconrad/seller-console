import React from 'react';

interface ScoreDialProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const ScoreDial: React.FC<ScoreDialProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
  label,
  error,
  disabled = false,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className='block text-sm font-medium text-gray-700'>{label}</label>}

      <div className='space-y-2'>
        <input
          type='range'
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed'
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
          }}
        />

        <div className='flex justify-between text-xs text-gray-500'>
          <span>{min}</span>
          <span className='font-medium text-gray-900'>{value}%</span>
          <span>{max}</span>
        </div>

        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
    </div>
  );
};

export default ScoreDial;
