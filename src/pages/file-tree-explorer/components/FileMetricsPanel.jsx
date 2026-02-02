import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileMetricsPanel = ({ file, vulnerabilities, relatedFiles, onNavigateToFile }) => {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-card p-6 text-center">
        <div>
          <Icon name="BarChart3" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Select a file to view metrics
          </p>
        </div>
      </div>
    );
  }

  const fileVulnerabilities = vulnerabilities?.filter(v => v?.file === file?.path);
  
  const severityCounts = fileVulnerabilities?.reduce((acc, vuln) => {
    const severity = vuln?.severity?.toLowerCase();
    acc[severity] = (acc?.[severity] || 0) + 1;
    return acc;
  }, {});

  const riskScore = Math.min(
    100,
    (severityCounts?.critical || 0) * 25 +
    (severityCounts?.high || 0) * 15 +
    (severityCounts?.medium || 0) * 8 +
    (severityCounts?.low || 0) * 3
  );

  const getRiskLevel = (score) => {
    if (score >= 75) return { label: 'Critical', color: 'text-error', bg: 'bg-error/10' };
    if (score >= 50) return { label: 'High', color: 'text-warning', bg: 'bg-warning/10' };
    if (score >= 25) return { label: 'Medium', color: 'text-accent', bg: 'bg-accent/10' };
    return { label: 'Low', color: 'text-success', bg: 'bg-success/10' };
  };

  const riskLevel = getRiskLevel(riskScore);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-error',
      high: 'text-warning',
      medium: 'text-accent',
      low: 'text-success'
    };
    return colors?.[severity] || 'text-muted-foreground';
  };

  const getSeverityBg = (severity) => {
    const colors = {
      critical: 'bg-error/10',
      high: 'bg-warning/10',
      medium: 'bg-accent/10',
      low: 'bg-success/10'
    };
    return colors?.[severity] || 'bg-muted/10';
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border overflow-elegant">
      <div className="p-4 border-b border-border">
        <h2 className="text-base font-heading font-semibold text-foreground flex items-center gap-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          File Metrics
        </h2>
      </div>
      <div className="flex-1 overflow-elegant p-4 space-y-6">
        <div>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
            Risk Assessment
          </h3>
          <div className={`p-4 rounded-lg ${riskLevel?.bg} border border-${riskLevel?.color?.replace('text-', '')}/20`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Risk Score</span>
              <span className={`text-2xl font-bold ${riskLevel?.color}`}>{riskScore}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${riskLevel?.color?.replace('text-', 'bg-')} transition-all duration-500`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${riskLevel?.color}`}>{riskLevel?.label} Risk</span>
              <span className="text-xs text-muted-foreground">0-100 scale</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
            Vulnerability Breakdown
          </h3>
          <div className="space-y-2">
            {['critical', 'high', 'medium', 'low']?.map(severity => {
              const count = severityCounts?.[severity] || 0;
              const percentage = fileVulnerabilities?.length > 0
                ? (count / fileVulnerabilities?.length) * 100
                : 0;

              return (
                <div key={severity} className={`p-3 rounded-lg ${getSeverityBg(severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium capitalize ${getSeverityColor(severity)}`}>
                      {severity}
                    </span>
                    <span className={`text-lg font-bold ${getSeverityColor(severity)}`}>
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getSeverityColor(severity)?.replace('text-', 'bg-')} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
            File Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Lines of Code</div>
              <div className="text-lg font-semibold text-foreground">
                {file?.content?.split('\n')?.length}
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">File Size</div>
              <div className="text-lg font-semibold text-foreground">
                {(file?.content?.length / 1024)?.toFixed(1)} KB
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Language</div>
              <div className="text-sm font-semibold text-foreground">
                {file?.language || 'Unknown'}
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Last Modified</div>
              <div className="text-sm font-semibold text-foreground">
                {file?.lastModified || 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        {relatedFiles && relatedFiles?.length > 0 && (
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
              Related Files
            </h3>
            <div className="space-y-2">
              {relatedFiles?.map((relatedFile, index) => (
                <button
                  key={index}
                  onClick={() => onNavigateToFile(relatedFile)}
                  className="w-full flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth text-left"
                >
                  <Icon name="FileCode" size={16} color="var(--color-muted-foreground)" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {relatedFile?.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {relatedFile?.relationship}
                    </div>
                  </div>
                  <Icon name="ArrowRight" size={16} color="var(--color-muted-foreground)" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              fullWidth
              iconName="Download"
              iconPosition="left"
            >
              Export Annotations
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Share2"
              iconPosition="left"
            >
              Share File
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Bookmark"
              iconPosition="left"
            >
              Bookmark File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileMetricsPanel;