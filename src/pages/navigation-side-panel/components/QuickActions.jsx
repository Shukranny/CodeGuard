import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: 'new-scan',
      label: 'New Scan',
      icon: 'Plus',
      badge: null,
      color: 'primary'
    },
    {
      id: 'recent-projects',
      label: 'Recent Projects',
      icon: 'FolderOpen',
      badge: 3,
      color: 'accent'
    },
    {
      id: 'scan-history',
      label: 'Scan History',
      icon: 'Clock',
      badge: 12,
      color: 'secondary'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary hover:bg-primary/20',
      accent: 'bg-accent/10 text-accent hover:bg-accent/20',
      secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => onActionClick?.(action?.id)}
            className={`
              w-full flex items-center justify-between px-3 py-2.5 rounded-md
              transition-all duration-150 ${getColorClasses(action?.color)}
            `}
            aria-label={action?.label}
          >
            <div className="flex items-center gap-3">
              <Icon name={action?.icon} size={18} />
              <span className="font-medium text-sm">{action?.label}</span>
            </div>
            {action?.badge !== null && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-background text-xs font-semibold">
                {action?.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;