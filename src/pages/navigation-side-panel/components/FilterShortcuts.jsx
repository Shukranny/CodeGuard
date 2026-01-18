import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterShortcuts = ({ onFilterSelect }) => {
  const filters = [
    {
      id: 'critical',
      label: 'Critical',
      icon: 'AlertTriangle',
      count: 5,
      color: 'error'
    },
    {
      id: 'high',
      label: 'High Severity',
      icon: 'AlertCircle',
      count: 12,
      color: 'error'
    },
    {
      id: 'medium',
      label: 'Medium',
      icon: 'Info',
      count: 23,
      color: 'warning'
    },
    {
      id: 'low',
      label: 'Low',
      icon: 'CheckCircle',
      count: 8,
      color: 'success'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      error: 'bg-error/10 text-error hover:bg-error/20',
      warning: 'bg-warning/10 text-warning hover:bg-warning/20',
      success: 'bg-success/10 text-success hover:bg-success/20'
    };
    return colorMap?.[color] || colorMap?.error;
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Filter by Severity
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => onFilterSelect?.(filter?.id)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-md
              transition-all duration-150 ${getColorClasses(filter?.color)}
            `}
            aria-label={`Filter by ${filter?.label}`}
            title={`${filter?.count} ${filter?.label} vulnerabilities`}
          >
            <Icon name={filter?.icon} size={20} className="mb-1" />
            <span className="text-xs font-medium">{filter?.label}</span>
            <span className="text-lg font-bold mt-1">{filter?.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterShortcuts;