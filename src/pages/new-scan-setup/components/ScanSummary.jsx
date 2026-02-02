import React from 'react';
import Icon from '../../../components/AppIcon';

const ScanSummary = ({ configuration }) => {
  const estimateDuration = () => {
    const baseTime = 5;
    const scannerMultiplier = configuration?.selectedScanners?.length || 1;
    const fileMultiplier = Math.ceil((configuration?.fileCount || 100) / 100);
    return baseTime * scannerMultiplier * fileMultiplier;
  };

  const estimateResources = () => {
    const fileCount = configuration?.fileCount || 0;
    if (fileCount < 500) return 'Low';
    if (fileCount < 2000) return 'Medium';
    return 'High';
  };

  const getScannerName = (id) => {
    const names = {
      semgrep: 'Semgrep',
      gitleaks: 'GitLeaks',
      dependency: 'Dependency Scanner',
      config: 'Configuration Analysis'
    };
    return names?.[id] || id;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileSearch" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-base font-heading font-semibold text-foreground">
            Scan Configuration Summary
          </h3>
          <p className="text-sm text-muted-foreground">
            Review your settings before starting
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Project Source</div>
            <div className="flex items-center gap-2">
              <Icon
                name={configuration?.sourceType === 'file' ? 'Upload' : 'Github'}
                size={16}
                color="var(--color-foreground)"
              />
              <span className="text-sm font-medium text-foreground">
                {configuration?.sourceType === 'file' ? 'ZIP Upload' : 'GitHub Repository'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Estimated Duration</div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} color="var(--color-foreground)" />
              <span className="text-sm font-medium text-foreground">
                ~{estimateDuration()} minutes
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Resource Usage</div>
            <div className="flex items-center gap-2">
              <Icon name="Cpu" size={16} color="var(--color-foreground)" />
              <span className="text-sm font-medium text-foreground">
                {estimateResources()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Files to Scan</div>
            <div className="flex items-center gap-2">
              <Icon name="FileCode" size={16} color="var(--color-foreground)" />
              <span className="text-sm font-medium text-foreground">
                {configuration?.fileCount?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <div className="text-xs text-muted-foreground">Active Scanners</div>
          <div className="flex flex-wrap gap-2">
            {configuration?.selectedScanners?.map((scannerId) => (
              <span
                key={scannerId}
                className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full"
              >
                {getScannerName(scannerId)}
              </span>
            ))}
          </div>
        </div>

        {configuration?.owaspCategories && configuration?.owaspCategories?.length > 0 && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="text-xs text-muted-foreground">OWASP Categories</div>
            <div className="text-sm text-foreground">
              {configuration?.owaspCategories?.length} of 10 categories selected
            </div>
          </div>
        )}

        {configuration?.pathExclusions && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="text-xs text-muted-foreground">Exclusions</div>
            <div className="text-sm text-foreground font-data">
              {configuration?.pathExclusions}
            </div>
          </div>
        )}
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <Icon name="Info" size={18} color="var(--color-primary)" className="mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground mb-1">
              Ready to Start
            </div>
            <div className="text-xs text-muted-foreground">
              Your scan will run in the background. You can monitor progress in real-time or continue working on other tasks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanSummary;