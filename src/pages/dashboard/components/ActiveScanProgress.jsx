import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveScanProgress = ({ scan }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={20} color="var(--color-primary)" className="md:w-6 md:h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Scan in Progress
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {scan?.projectName}
            </p>
          </div>
        </div>
        <div className="status-badge bg-primary/10 text-primary flex-shrink-0">
          Active
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm text-muted-foreground">{scan?.phase}</span>
            <span className="text-sm md:text-base font-heading font-bold text-primary">
              {scan?.progress}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 progress-ring"
              style={{ width: `${scan?.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="bg-muted/30 rounded-lg p-2 md:p-3">
            <div className="text-xs text-muted-foreground mb-1">Files</div>
            <div className="text-sm md:text-base font-heading font-bold text-foreground">
              {scan?.filesScanned}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 md:p-3">
            <div className="text-xs text-muted-foreground mb-1">Findings</div>
            <div className="text-sm md:text-base font-heading font-bold text-foreground">
              {scan?.findings}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 md:p-3">
            <div className="text-xs text-muted-foreground mb-1">Time</div>
            <div className="text-sm md:text-base font-heading font-bold text-foreground">
              {scan?.elapsed}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          iconName="Eye"
          iconPosition="left"
          onClick={() => navigate('/scan-progress', { state: { scanId: scan?.id } })}
        >
          View Progress
        </Button>
      </div>
    </div>
  );
};

export default ActiveScanProgress;