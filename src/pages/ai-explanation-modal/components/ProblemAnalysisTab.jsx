import React from 'react';
import Icon from '../../../components/AppIcon';

const ProblemAnalysisTab = ({ vulnerability }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-6 border border-border">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
            <Icon name="AlertTriangle" size={24} color="var(--color-error)" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {vulnerability?.ruleName}
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-sm font-medium ${getSeverityColor(vulnerability?.severity)}`}>
                {vulnerability?.severity} Severity
              </span>
              <span className="text-sm text-muted-foreground">
                {vulnerability?.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {vulnerability?.description}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon name="Info" size={18} color="var(--color-primary)" />
            Why This Matters
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {vulnerability?.aiExplanation?.whyItMatters}
          </p>
        </div>

        <div>
          <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon name="Shield" size={18} color="var(--color-primary)" />
            Security Impact
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {vulnerability?.aiExplanation?.securityImpact}
          </p>
        </div>

        <div>
          <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon name="Target" size={18} color="var(--color-primary)" />
            Attack Scenarios
          </h4>
          <ul className="space-y-2">
            {vulnerability?.aiExplanation?.attackScenarios?.map((scenario, index) => (
              <li key={index} className="flex items-start gap-3">
                <Icon name="ChevronRight" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{scenario}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemAnalysisTab;
