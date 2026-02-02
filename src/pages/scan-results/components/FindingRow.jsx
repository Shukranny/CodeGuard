import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SeverityBadge from './SeverityBadge';

const FindingRow = ({ finding, onViewDetails, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-accent';
    return 'text-warning';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-smooth">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-6 text-left hover:bg-muted/20 transition-smooth"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <Icon 
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                size={20} 
                color="var(--color-muted-foreground)"
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-1 line-clamp-2">
                  {finding?.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="FileCode" size={14} />
                    {finding?.file}
                  </span>
                  <span>•</span>
                  <span>Line {finding?.line}</span>
                  <span>•</span>
                  <span className="font-data">{finding?.scanner}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 ml-8 md:ml-0">
            <SeverityBadge severity={finding?.severity} size="sm" />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/30 rounded text-xs">
              <Icon name="Target" size={12} color="var(--color-muted-foreground)" />
              <span className={getConfidenceColor(finding?.confidence)}>
                {finding?.confidence}%
              </span>
            </div>
            {finding?.owasp && (
              <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium whitespace-nowrap">
                {finding?.owasp}
              </div>
            )}
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border">
          <div className="mt-4 space-y-4">
            <div>
              <h5 className="text-sm font-heading font-semibold text-foreground mb-2">
                Description
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {finding?.description}
              </p>
            </div>

            {finding?.cwe && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">CWE Mapping:</span>
                <span className="font-data text-foreground">{finding?.cwe}</span>
              </div>
            )}

            <div className="bg-muted/30 rounded-lg p-3 md:p-4 overflow-x-auto">
              <div className="text-xs text-muted-foreground mb-2">Vulnerable Code:</div>
              <pre className="text-xs md:text-sm font-data text-foreground">
                {finding?.codeSnippet}
              </pre>
            </div>

            {finding?.remediation && (
              <div>
                <h5 className="text-sm font-heading font-semibold text-foreground mb-2">
                  Remediation Guidance
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {finding?.remediation}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => onViewDetails(finding)}
                iconName="Sparkles"
                iconPosition="left"
              >
                AI Explanation
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onDismiss(finding?.id)}
                iconName="XCircle"
                iconPosition="left"
              >
                Dismiss Finding
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindingRow;