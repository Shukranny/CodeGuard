import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, iconColor, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 hover:border-primary/30 transition-smooth">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}15` }}>
          <Icon name={icon} size={20} color={iconColor} className="md:w-6 md:h-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={14} className="md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-xs md:text-sm text-muted-foreground font-medium">{title}</h3>
        <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">{value}</p>
      </div>
      {trend && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
          <p className="text-xs md:text-sm text-muted-foreground">{trend}</p>
        </div>
      )}
    </div>
  );
};

export default MetricsCard;