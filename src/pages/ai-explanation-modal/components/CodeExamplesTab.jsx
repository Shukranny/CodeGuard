import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CodeExamplesTab = ({ vulnerability }) => {
  const [copiedVulnerable, setCopiedVulnerable] = useState(false);
  const [copiedFixed, setCopiedFixed] = useState(false);

  const handleCopyCode = (code, setterFunction) => {
    navigator.clipboard?.writeText(code);
    setterFunction(true);
    setTimeout(() => setterFunction(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-error/5 border border-error/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="XCircle" size={20} color="var(--color-error)" />
            <h4 className="text-base font-semibold text-foreground">Vulnerable Code</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName={copiedVulnerable ? "Check" : "Copy"}
            iconPosition="left"
            onClick={() => handleCopyCode(vulnerability?.codeExamples?.vulnerable, setCopiedVulnerable)}
          >
            {copiedVulnerable ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <div className="bg-background rounded-md p-4 overflow-x-auto">
          <pre className="text-sm text-foreground font-mono">
            <code>{vulnerability?.codeExamples?.vulnerable}</code>
          </pre>
        </div>
        <div className="mt-3 flex items-start gap-2">
          <Icon name="AlertCircle" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            {vulnerability?.codeExamples?.vulnerableExplanation}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-border"></div>
          <Icon name="ArrowDown" size={24} color="var(--color-primary)" />
          <div className="h-px w-12 bg-border"></div>
        </div>
      </div>
      <div className="bg-success/5 border border-success/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            <h4 className="text-base font-semibold text-foreground">Fixed Code</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName={copiedFixed ? "Check" : "Copy"}
            iconPosition="left"
            onClick={() => handleCopyCode(vulnerability?.codeExamples?.fixed, setCopiedFixed)}
          >
            {copiedFixed ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <div className="bg-background rounded-md p-4 overflow-x-auto">
          <pre className="text-sm text-foreground font-mono">
            <code>{vulnerability?.codeExamples?.fixed}</code>
          </pre>
        </div>
        <div className="mt-3 flex items-start gap-2">
          <Icon name="CheckCircle" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            {vulnerability?.codeExamples?.fixedExplanation}
          </p>
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Icon name="Lightbulb" size={16} color="var(--color-warning)" />
          Key Changes
        </h5>
        <ul className="space-y-2">
          {vulnerability?.codeExamples?.keyChanges?.map((change, index) => (
            <li key={index} className="flex items-start gap-2">
              <Icon name="Check" size={14} color="var(--color-success)" className="flex-shrink-0 mt-1" />
              <span className="text-sm text-foreground">{change}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CodeExamplesTab;
