import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceStatusCard = ({ standard, coverage, status, categories }) => {
  const getStatusColor = () => {
    if (status === 'compliant') return 'text-success';
    if (status === 'partial') return 'text-warning';
    return 'text-error';
  };

  const getStatusBg = () => {
    if (status === 'compliant') return 'bg-success/10 border-success/20';
    if (status === 'partial') return 'bg-warning/10 border-warning/20';
    return 'bg-error/10 border-error/20';
  };

  const getStatusIcon = () => {
    if (status === 'compliant') return 'CheckCircle';
    if (status === 'partial') return 'AlertCircle';
    return 'XCircle';
  };

  const getStatusLabel = () => {
    if (status === 'compliant') return 'Compliant';
    if (status === 'partial') return 'Partial';
    return 'Non-Compliant';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
            {standard}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">Coverage Analysis</p>
        </div>
        <div className={`px-3 py-1 rounded-full border ${getStatusBg()} flex items-center gap-2`}>
          <Icon name={getStatusIcon()} size={14} className={getStatusColor()} />
          <span className={`text-xs md:text-sm font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
      </div>
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs md:text-sm text-muted-foreground">Overall Coverage</span>
          <span className="text-sm md:text-base font-heading font-bold text-foreground">
            {coverage}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 progress-ring"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-xs md:text-sm font-heading font-semibold text-foreground mb-3">
          Category Breakdown
        </h4>
        {categories?.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <Icon 
                name={category?.covered ? 'CheckCircle' : 'XCircle'} 
                size={16} 
                color={category?.covered ? 'var(--color-success)' : 'var(--color-error)'}
                className="flex-shrink-0"
              />
              <span className="text-xs md:text-sm text-foreground truncate">{category?.name}</span>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {category?.findings} findings
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceStatusCard;
