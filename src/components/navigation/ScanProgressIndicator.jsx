import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ScanProgressIndicator = ({ scanId, onComplete }) => {
  const navigate = useNavigate();
  const [scanData, setScanData] = useState({
    phase: 'Initializing',
    progress: 0,
    findings: 0,
    status: 'running'
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanData(prev => {
        if (prev?.progress >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return { ...prev, status: 'completed' };
        }

        const newProgress = Math.min(prev?.progress + Math.random() * 10, 100);
        const phases = ['Initializing', 'Analyzing Dependencies', 'Scanning Code', 'Detecting Vulnerabilities', 'Generating Report'];
        const phaseIndex = Math.floor((newProgress / 100) * phases?.length);
        
        return {
          ...prev,
          progress: newProgress,
          phase: phases?.[Math.min(phaseIndex, phases?.length - 1)],
          findings: Math.floor(newProgress / 10)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatusColor = () => {
    if (scanData?.status === 'completed') return 'text-success';
    if (scanData?.status === 'error') return 'text-error';
    return 'text-primary';
  };

  const getStatusIcon = () => {
    if (scanData?.status === 'completed') return 'CheckCircle';
    if (scanData?.status === 'error') return 'AlertCircle';
    return 'Activity';
  };

  return (
    <div className="fixed top-20 right-6 z-[1020] w-80 md:w-96">
      <div className="bg-card border border-border rounded-lg shadow-glow-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-smooth"
        >
          <div className="flex items-center gap-3">
            <div className={`${getStatusColor()}`}>
              <Icon name={getStatusIcon()} size={20} />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-foreground">Security Scan</div>
              <div className="text-xs text-muted-foreground">{scanData?.phase}</div>
            </div>
          </div>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            color="var(--color-muted-foreground)" 
          />
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-border">
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(scanData?.progress)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 progress-ring"
                    style={{ width: `${scanData?.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Findings</div>
                  <div className="text-lg font-semibold text-foreground">
                    {scanData?.findings}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <div className={`text-sm font-medium ${getStatusColor()}`}>
                    {scanData?.status === 'running' ? 'Active' : 'Completed'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/scan-progress')}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View Details
                </Button>
                {scanData?.status === 'completed' && (
                  <Button
                    variant="default"
                    size="sm"
                    fullWidth
                    onClick={() => navigate('/scan-results')}
                    iconName="FileSearch"
                    iconPosition="left"
                  >
                    View Results
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanProgressIndicator;