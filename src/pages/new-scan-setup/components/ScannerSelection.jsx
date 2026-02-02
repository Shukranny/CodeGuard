import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScannerSelection = ({ selectedScanners, onScannerToggle }) => {
  const scanners = [
    {
      id: 'semgrep',
      name: 'Semgrep',
      icon: 'Shield',
      description: 'Static code analysis with OWASP Top 10 aligned rules',
      features: ['Pattern matching', 'Custom rules', 'Multi-language support'],
      recommended: true
    },
    {
      id: 'gitleaks',
      name: 'GitLeaks',
      icon: 'Key',
      description: 'Secret detection with entropy scoring and historical leak detection',
      features: ['API keys', 'Passwords', 'Tokens', 'Certificates'],
      recommended: true
    },
    {
      id: 'dependency',
      name: 'Dependency Scanner',
      icon: 'Package',
      description: 'Vulnerability assessment using pip-audit and OSV.dev with CVE mapping',
      features: ['CVE detection', 'Transitive analysis', 'Freshness scoring'],
      recommended: true
    },
    {
      id: 'config',
      name: 'Configuration Analysis',
      icon: 'Settings',
      description: 'Policy and configuration security assessment',
      features: ['Insecure settings', 'Best practices', 'Compliance checks'],
      recommended: false
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-heading font-semibold text-foreground">
          Select Security Scanners
        </h3>
        <span className="text-sm text-muted-foreground">
          {selectedScanners?.length} of {scanners?.length} selected
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {scanners?.map((scanner) => {
          const isSelected = selectedScanners?.includes(scanner?.id);
          
          return (
            <div
              key={scanner?.id}
              className={`
                relative p-4 md:p-5 rounded-lg border transition-smooth cursor-pointer
                ${isSelected
                  ? 'bg-primary/5 border-primary/50 shadow-glow-sm'
                  : 'bg-card border-border hover:border-primary/30'
                }
              `}
              onClick={() => onScannerToggle(scanner?.id)}
            >
              {scanner?.recommended && (
                <div className="absolute top-3 right-3 md:top-4 md:right-4">
                  <span className="status-badge bg-success/10 text-success text-xs">
                    Recommended
                  </span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={isSelected}
                  onChange={() => onScannerToggle(scanner?.id)}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${isSelected ? 'bg-primary/10' : 'bg-muted/50'}
                    `}>
                      <Icon
                        name={scanner?.icon}
                        size={20}
                        color={isSelected ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                      />
                    </div>
                    <h4 className="text-base font-heading font-semibold text-foreground">
                      {scanner?.name}
                    </h4>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {scanner?.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {scanner?.features?.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScannerSelection;
