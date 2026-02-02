import React from 'react';
import Icon from '../../../components/AppIcon';

const SeverityBadge = ({ severity, size = 'default' }) => {
  const severityConfig = {
    critical: {
      bg: 'bg-error/10',
      text: 'text-error',
      border: 'border-error/20',
      icon: 'AlertTriangle'
    },
    high: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
      icon: 'AlertCircle'
    },
    medium: {
      bg: 'bg-accent/10',
      text: 'text-accent',
      border: 'border-accent/20',
      icon: 'Info'
    },
    low: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
      icon: 'CheckCircle'
    }
  };

  const config = severityConfig?.[severity?.toLowerCase()] || severityConfig?.medium;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full font-medium border
      ${config?.bg} ${config?.text} ${config?.border} ${sizeClasses?.[size]}
    `}>
      <Icon name={config?.icon} size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
      <span className="capitalize">{severity}</span>
    </div>
  );
};

export default SeverityBadge;
