import React from 'react';
import Icon from '../../../components/AppIcon';
import SeverityBadge from './SeverityBadge';

const TopRiskyFiles = ({ files }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Top Risky Files
        </h3>
      </div>
      <div className="space-y-3">
        {files?.map((file, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <div className="w-8 h-8 bg-error/10 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-error">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-data text-foreground truncate mb-1">
                {file?.path}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{file?.vulnerabilities} vulnerabilities</span>
                <span>•</span>
                <span>Risk: {file?.riskScore}/100</span>
              </div>
            </div>
            <SeverityBadge severity={file?.highestSeverity} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRiskyFiles;
