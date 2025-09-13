/**
 * Doughnut chart component for visualizing filter options distribution
 */

import { FilterChartProps } from '@/types';
import { getStageChartColor, getStatusChartColor } from '@/utils/dataTransform';
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const FilterChart: React.FC<FilterChartProps> = ({
  filterOptions,
  title,
  type,
  onSegmentClick,
}) => {
  // Filter out "all" option and sort by count descending
  const chartData = filterOptions
    .filter(option => option.value !== 'all')
    .sort((a, b) => b.count - a.count);

  // Generate colors based on the data and type
  const getColors = () => {
    return chartData.map(option => {
      return type === 'lead'
        ? getStatusChartColor(option.value)
        : getStageChartColor(option.value);
    });
  };

  const data = {
    labels: chartData.map(option => option.label),
    datasets: [
      {
        data: chartData.map(option => option.count),
        backgroundColor: getColors(),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
      animateRotate: true,
      animateScale: true,
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 8,
          font: {
            size: 11,
          },
          boxWidth: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          },
        },
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0 && onSegmentClick) {
        const elementIndex = elements[0].index;
        const clickedValue = chartData[elementIndex]?.value;
        if (clickedValue) {
          onSegmentClick(clickedValue);
        }
      }
    },
    onHover: event => {
      if (event.native?.target) {
        (event.native.target as HTMLElement).style.cursor = onSegmentClick
          ? 'pointer'
          : 'default';
      }
    },
    elements: {
      arc: {
        hoverOffset: 8,
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    },
  };

  const totalCount = chartData.reduce((sum, option) => sum + option.count, 0);

  if (totalCount === 0) {
    return (
      <div className='p-4 text-center text-gray-500 transition-all duration-300 ease-in-out'>
        <div className='text-sm'>No data available for chart</div>
      </div>
    );
  }

  return (
    <div className='p-4 transition-all duration-300 ease-in-out'>
      <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-3'>
        {title}
      </h3>
      <div
        className='relative transition-all duration-300 ease-in-out'
        style={{ height: '200px' }}
      >
        <Doughnut data={data} options={chartOptions} />
      </div>
      <div className='mt-2 text-center text-xs text-gray-500 transition-all duration-300 ease-in-out'>
        <span className='font-bold'>Total:</span> {totalCount} items
      </div>
    </div>
  );
};

export default FilterChart;
