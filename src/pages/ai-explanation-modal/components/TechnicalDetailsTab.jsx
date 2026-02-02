import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TechnicalDetailsTab = ({ vulnerability }) => {
  const [expandedCode, setExpandedCode] = useState(false);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h3 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Vulnerability Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Shield" size={16} color="var(--color-primary)" />
              <span className="text-xs text-muted-foreground">CWE Classification</span>
            </div>
            <div className="text-sm md:text-base font-medium text-foreground">
              CWE-{vulnerability?.cweId}: {vulnerability?.cweName}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Tag" size={16} color="var(--color-primary)" />
              <span className="text-xs text-muted-foreground">OWASP Category</span>
            </div>
            <div className="text-sm md:text-base font-medium text-foreground">
              {vulnerability?.owaspCategory}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Exploit Scenario
        </h4>
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base text-foreground leading-relaxed">
                {vulnerability?.exploitScenario}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
            Vulnerable Code Context
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedCode(!expandedCode)}
            iconName={expandedCode ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            {expandedCode ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        <div className="bg-muted/30 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
            <span className="text-xs font-data text-muted-foreground">
              {vulnerability?.affectedFiles?.[0]?.path}
            </span>
            <Button
              variant="ghost"
              size="xs"
              iconName="Copy"
              iconPosition="left"
            >
              Copy
            </Button>
          </div>
          <div className={`overflow-x-auto ${expandedCode ? 'max-h-96' : 'max-h-48'} transition-all`}>
            <pre className="p-4 text-xs md:text-sm font-data text-foreground">
              <code>{vulnerability?.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
      {vulnerability?.dependencyChain && (
        <div>
          <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
            Dependency Chain Analysis
          </h4>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="space-y-3">
              {vulnerability?.dependencyChain?.map((dep, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    {index < vulnerability?.dependencyChain?.length - 1 && (
                      <div className="w-0.5 h-8 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="text-sm font-medium text-foreground">{dep?.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Version {dep?.version} • {dep?.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Attack Vectors
        </h4>
        <div className="space-y-2">
          {vulnerability?.attackVectors?.map((vector, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Target" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground mb-1">{vector?.name}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{vector?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetailsTab;
