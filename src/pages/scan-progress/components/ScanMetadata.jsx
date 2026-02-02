import React from 'react';
import Icon from '../../../components/AppIcon';

const ScanMetadata = ({ metadata }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024)?.toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024))?.toFixed(1)} MB`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Info" size={20} color="var(--color-accent)" />
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Scan Metadata
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Scan ID
            </div>
            <div className="text-sm md:text-base font-data text-foreground">
              {metadata?.scanId}
            </div>
          </div>

          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Start Time
            </div>
            <div className="text-sm md:text-base text-foreground">
              {new Date(metadata.startTime)?.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Elapsed Time
            </div>
            <div className="text-sm md:text-base text-foreground">
              {formatDuration(metadata?.elapsedTime)}
            </div>
          </div>

          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Estimated Completion
            </div>
            <div className="text-sm md:text-base text-foreground">
              {formatDuration(metadata?.estimatedCompletion)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Source Type
            </div>
            <div className="flex items-center gap-2">
              <Icon 
                name={metadata?.sourceType === 'github' ? 'Github' : 'FolderArchive'} 
                size={16}
                color="var(--color-foreground)"
              />
              <span className="text-sm md:text-base text-foreground">
                {metadata?.sourceType === 'github' ? 'GitHub Repository' : 'ZIP Archive'}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Project Size
            </div>
            <div className="text-sm md:text-base text-foreground">
              {formatBytes(metadata?.projectSize)}
            </div>
          </div>

          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Files Analyzed
            </div>
            <div className="text-sm md:text-base text-foreground">
              {metadata?.filesAnalyzed?.toLocaleString()} / {metadata?.totalFiles?.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">
              Languages Detected
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {metadata?.languages?.map((lang) => (
                <span 
                  key={lang}
                  className="px-2 py-1 bg-muted/50 rounded text-xs font-medium text-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm md:text-base font-heading font-semibold text-foreground mb-4">
          Resource Utilization
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-muted-foreground">CPU Usage</span>
              <span className="text-xs md:text-sm font-medium text-foreground">
                {metadata?.resources?.cpu}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${metadata?.resources?.cpu}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-muted-foreground">Memory Usage</span>
              <span className="text-xs md:text-sm font-medium text-foreground">
                {metadata?.resources?.memory}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${metadata?.resources?.memory}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanMetadata;
