import React from 'react';
import Icon from '../../../components/AppIcon';

const PreliminaryFindings = ({ findings }) => {
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
      critical: 'bg-error/10 border-error/20',
      high: 'bg-warning/10 border-warning/20',
      medium: 'bg-accent/10 border-accent/20',
      low: 'bg-success/10 border-success/20'
    };
    return colors?.[severity?.toLowerCase()] || 'bg-muted/30 border-border';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="AlertTriangle" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
            Preliminary Findings
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Issues discovered during scan
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        {findings?.summary?.map((item) => (
          <div 
            key={item?.type}
            className={`p-4 md:p-5 rounded-lg border ${getSeverityBg(item?.severity)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-muted-foreground">
                {item?.type}
              </span>
              <Icon 
                name={item?.icon} 
                size={16}
                color={`var(--color-${item?.severity === 'critical' ? 'error' : item?.severity === 'high' ? 'warning' : item?.severity === 'medium' ? 'accent' : 'success'})`}
              />
            </div>
            <div className={`text-2xl md:text-3xl font-heading font-bold ${getSeverityColor(item?.severity)}`}>
              {item?.count}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {item?.severity} severity
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">
          Recent Detections
        </h3>
        
        <div className="space-y-2">
          {findings?.recent?.map((finding) => (
            <div 
              key={finding?.id}
              className="flex items-start gap-3 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className={`
                w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${getSeverityBg(finding?.severity)}
              `}>
                <Icon 
                  name={finding?.icon} 
                  size={16}
                  color={`var(--color-${finding?.severity === 'critical' ? 'error' : finding?.severity === 'high' ? 'warning' : finding?.severity === 'medium' ? 'accent' : 'success'})`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm md:text-base font-medium text-foreground line-clamp-1">
                    {finding?.title}
                  </h4>
                  <span className={`
                    text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap
                    ${getSeverityBg(finding?.severity)} ${getSeverityColor(finding?.severity)}
                  `}>
                    {finding?.severity}
                  </span>
                </div>
                
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2">
                  {finding?.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="FileCode" size={12} />
                    {finding?.file}
                  </span>
                  <span>•</span>
                  <span>Line {finding?.line}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreliminaryFindings;