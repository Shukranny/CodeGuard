import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RemediationTab = ({ vulnerability }) => {
  const [copiedSnippet, setCopiedSnippet] = useState(null);

  const handleCopyCode = (code, type) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippet(type);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h3 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Recommended Fix
        </h3>
        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-4">
            <Icon name="CheckCircle" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base text-foreground leading-relaxed">
                {vulnerability?.remediationSummary}
              </p>
            </div>
          </div>
          <ol className="space-y-3 list-decimal list-inside">
            {vulnerability?.remediationSteps?.map((step, index) => (
              <li key={index} className="text-sm md:text-base text-foreground pl-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="XCircle" size={16} color="var(--color-error)" />
          Vulnerable Code
        </h4>
        <div className="bg-muted/30 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
            <span className="text-xs font-data text-muted-foreground">Before Fix</span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleCopyCode(vulnerability?.vulnerableCode, 'vulnerable')}
              iconName={copiedSnippet === 'vulnerable' ? 'Check' : 'Copy'}
              iconPosition="left"
            >
              {copiedSnippet === 'vulnerable' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="overflow-x-auto max-h-64">
            <pre className="p-4 text-xs md:text-sm font-data text-foreground">
              <code>{vulnerability?.vulnerableCode}</code>
            </pre>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="CheckCircle" size={16} color="var(--color-success)" />
          Secure Implementation
        </h4>
        <div className="bg-success/10 border border-success/20 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-success/5 border-b border-success/20">
            <span className="text-xs font-data text-success">After Fix</span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleCopyCode(vulnerability?.secureCode, 'secure')}
              iconName={copiedSnippet === 'secure' ? 'Check' : 'Copy'}
              iconPosition="left"
            >
              {copiedSnippet === 'secure' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="overflow-x-auto max-h-64">
            <pre className="p-4 text-xs md:text-sm font-data text-success">
              <code>{vulnerability?.secureCode}</code>
            </pre>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Secure Alternatives
        </h4>
        <div className="space-y-3">
          {vulnerability?.secureAlternatives?.map((alternative, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <Icon name="Lightbulb" size={16} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground mb-1">{alternative?.name}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{alternative?.description}</div>
                </div>
              </div>
              {alternative?.example && (
                <div className="mt-3 bg-background rounded p-3 overflow-x-auto">
                  <code className="text-xs font-data text-foreground">{alternative?.example}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Implementation Priority
        </h4>
        <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertTriangle" size={20} color="var(--color-error)" className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-error">Immediate Action Required</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">
              {vulnerability?.priorityMessage}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Testing Recommendations
        </h4>
        <div className="space-y-2">
          {vulnerability?.testingSteps?.map((step, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm md:text-base text-foreground">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RemediationTab;