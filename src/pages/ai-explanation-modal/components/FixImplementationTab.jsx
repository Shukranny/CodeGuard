import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const FixImplementationTab = ({ vulnerability }) => {
  const [expandedStep, setExpandedStep] = useState(null);

  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Icon name="Wrench" size={24} color="var(--color-primary)" className="flex-shrink-0" />
          <div>
            <h4 className="text-base font-semibold text-foreground mb-2">
              Remediation Overview
            </h4>
            <p className="text-sm text-muted-foreground">
              {vulnerability?.fixImplementation?.overview}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold text-foreground mb-4">
          Step-by-Step Implementation
        </h4>
        <div className="space-y-3">
          {vulnerability?.fixImplementation?.steps?.map((step, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-150"
            >
              <button
                onClick={() => toggleStep(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{step?.title}</span>
                </div>
                <Icon
                  name={expandedStep === index ? "ChevronUp" : "ChevronDown"}
                  size={20}
                  color="var(--color-muted-foreground)"
                />
              </button>
              {expandedStep === index && (
                <div className="px-4 pb-4 pt-2 border-t border-border">
                  <p className="text-sm text-foreground mb-3">{step?.description}</p>
                  {step?.code && (
                    <div className="bg-muted rounded-md p-3 overflow-x-auto">
                      <pre className="text-xs text-foreground font-mono">
                        <code>{step?.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="Star" size={18} color="var(--color-warning)" />
          Best Practices
        </h4>
        <div className="space-y-2">
          {vulnerability?.fixImplementation?.bestPractices?.map((practice, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Icon name="CheckCircle2" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{practice}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
          Additional Considerations
        </h5>
        <ul className="space-y-2">
          {vulnerability?.fixImplementation?.considerations?.map((consideration, index) => (
            <li key={index} className="flex items-start gap-2">
              <Icon name="Dot" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-1" />
              <span className="text-sm text-foreground">{consideration}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FixImplementationTab;
