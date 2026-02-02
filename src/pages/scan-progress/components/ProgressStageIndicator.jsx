import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressStageIndicator = ({ stages, currentStage, overallProgress }) => {
  const getStageStatus = (index) => {
    if (index < currentStage) return 'completed';
    if (index === currentStage) return 'active';
    return 'pending';
  };

  const getStageIcon = (stage, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'active') return stage?.icon;
    return 'Circle';
  };

  const getStageColor = (status) => {
    if (status === 'completed') return 'text-success';
    if (status === 'active') return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Scan Progress
        </h2>
        <div className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary">
          {Math.round(overallProgress)}%
        </div>
      </div>
      <div className="mb-6 md:mb-8">
        <div className="h-3 md:h-4 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 progress-ring"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        {stages?.map((stage, index) => {
          const status = getStageStatus(index);
          const isActive = status === 'active';
          
          return (
            <div 
              key={stage?.id}
              className={`
                flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-smooth
                ${isActive ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}
              `}
            >
              <div className={`
                w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0
                ${isActive ? 'bg-primary/20' : 'bg-muted'}
              `}>
                <Icon 
                  name={getStageIcon(stage, status)} 
                  size={20}
                  color={status === 'completed' ? 'var(--color-success)' : status === 'active' ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`
                    text-sm md:text-base font-heading font-semibold
                    ${getStageColor(status)}
                  `}>
                    {stage?.name}
                  </h3>
                  {isActive && (
                    <span className="text-xs md:text-sm font-medium text-primary whitespace-nowrap">
                      {stage?.progress}%
                    </span>
                  )}
                </div>
                
                <p className="text-xs md:text-sm text-muted-foreground mb-2">
                  {stage?.description}
                </p>

                {isActive && (
                  <div className="space-y-2">
                    <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${stage?.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{stage?.filesProcessed} files processed</span>
                      <span>•</span>
                      <span>{stage?.rulesExecuted} rules executed</span>
                    </div>
                  </div>
                )}

                {status === 'completed' && (
                  <div className="flex items-center gap-2 text-xs text-success">
                    <Icon name="CheckCircle" size={14} />
                    <span>Completed in {stage?.duration}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStageIndicator;
