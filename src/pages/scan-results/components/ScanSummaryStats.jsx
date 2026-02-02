import React from 'react';
import Icon from '../../../components/AppIcon';

const ScanSummaryStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Findings',
      value: stats?.totalFindings,
      icon: 'FileSearch',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      label: 'Critical Issues',
      value: stats?.critical,
      icon: 'AlertTriangle',
      color: 'text-error',
      bg: 'bg-error/10'
    },
    {
      label: 'Files Scanned',
      value: stats?.filesScanned,
      icon: 'FileCode',
      color: 'text-accent',
      bg: 'bg-accent/10'
    },
    {
      label: 'Scan Duration',
      value: stats?.duration,
      icon: 'Clock',
      color: 'text-success',
      bg: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards?.map((stat, index) => (
        <div 
          key={index}
          className="bg-card border border-border rounded-lg p-3 md:p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 md:w-10 md:h-10 ${stat?.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat?.icon} size={18} color={`var(--color-${stat?.color?.replace('text-', '')})`} />
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                {stat?.label}
              </div>
              <div className={`text-lg md:text-2xl font-heading font-bold ${stat?.color}`}>
                {stat?.value}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScanSummaryStats;