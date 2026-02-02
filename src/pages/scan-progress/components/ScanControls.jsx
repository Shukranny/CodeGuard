import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScanControls = ({ scanId, onCancel, onPriorityChange }) => {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [priority, setPriority] = useState('normal');

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    onCancel();
    setShowCancelDialog(false);
    navigate('/dashboard');
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    onPriorityChange(newPriority);
  };

  const priorities = [
    { value: 'low', label: 'Low', icon: 'TrendingDown', color: 'text-success' },
    { value: 'normal', label: 'Normal', icon: 'Minus', color: 'text-accent' },
    { value: 'high', label: 'High', icon: 'TrendingUp', color: 'text-warning' }
  ];

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4 md:mb-6">
          Scan Controls
        </h2>

        <div className="space-y-4 md:space-y-6">
          <div>
            <label className="text-sm md:text-base font-medium text-foreground mb-3 block">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {priorities?.map((p) => (
                <button
                  key={p?.value}
                  onClick={() => handlePriorityChange(p?.value)}
                  className={`
                    flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg border transition-smooth
                    ${priority === p?.value
                      ? 'bg-primary/10 border-primary/50' :'bg-muted/30 border-border hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon 
                    name={p?.icon} 
                    size={20}
                    color={priority === p?.value ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                  />
                  <span className={`
                    text-xs md:text-sm font-medium
                    ${priority === p?.value ? 'text-primary' : 'text-foreground'}
                  `}>
                    {p?.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Higher priority allocates more resources to this scan
            </p>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <Button
              variant="outline"
              fullWidth
              iconName="Pause"
              iconPosition="left"
              onClick={() => console.log('Pause scan')}
            >
              Pause Scan
            </Button>

            <Button
              variant="destructive"
              fullWidth
              iconName="XCircle"
              iconPosition="left"
              onClick={handleCancelClick}
            >
              Cancel Scan
            </Button>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={16} color="var(--color-muted-foreground)" className="mt-0.5" />
              <div className="text-xs md:text-sm text-muted-foreground">
                Canceling the scan will stop all analysis and discard preliminary results. This action cannot be undone.
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCancelDialog && (
        <div 
          className="fixed inset-0 z-[1030] flex items-center justify-center p-4 bg-background/80"
          onClick={() => setShowCancelDialog(false)}
        >
          <div 
            className="bg-surface rounded-xl shadow-glow-2xl max-w-md w-full p-6 md:p-8"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="AlertTriangle" size={24} color="var(--color-error)" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
                  Cancel Scan?
                </h3>
                <p className="text-sm text-muted-foreground">
                  This will stop the security analysis and discard all preliminary findings. You'll need to start a new scan to analyze this code.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowCancelDialog(false)}
              >
                Continue Scan
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={handleConfirmCancel}
              >
                Cancel Scan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScanControls;
