import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const TopRiskyFileCard = ({ file }) => {
  const navigate = useNavigate();

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-error',
      high: 'text-warning',
      medium: 'text-accent',
      low: 'text-success'
    };
    return colors?.[severity?.toLowerCase()] || 'text-muted-foreground';
  };

  const getSeverityBg = (severity) => {
    const colors = {
      critical: 'bg-error/10',
      high: 'bg-warning/10',
      medium: 'bg-accent/10',
      low: 'bg-success/10'
    };
    return colors?.[severity?.toLowerCase()] || 'bg-muted/30';
  };

  return (
    <div 
      onClick={() => navigate('/file-tree-explorer', { state: { filePath: file?.path } })}
      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-glow-md transition-smooth cursor-pointer group"
    >
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityBg(file?.severity)}`}>
        <Icon name="FileCode" size={20} color={`var(--color-${file?.severity === 'critical' ? 'error' : file?.severity === 'high' ? 'warning' : 'accent'})`} className="md:w-6 md:h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm md:text-base font-heading font-semibold text-foreground truncate group-hover:text-primary transition-smooth">
            {file?.name}
          </h4>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(file?.severity)} ${getSeverityBg(file?.severity)} flex-shrink-0`}>
            {file?.severity}
          </span>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground truncate mb-2">
          {file?.path}
        </p>
        <div className="flex items-center gap-3 md:gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Icon name="AlertTriangle" size={12} className="text-error flex-shrink-0" />
            <span className="text-muted-foreground">{file?.vulnerabilities} issues</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={12} className="text-warning flex-shrink-0" />
            <span className="text-muted-foreground">Risk: {file?.riskScore}</span>
          </div>
        </div>
      </div>
      <Icon 
        name="ChevronRight" 
        size={20} 
        color="var(--color-muted-foreground)"
        className="opacity-0 group-hover:opacity-100 transition-smooth flex-shrink-0"
      />
    </div>
  );
};

export default TopRiskyFileCard;
