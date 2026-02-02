import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskScoreCard = ({ score, trend, label }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-error';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-accent';
    return 'text-success';
  };

  const getTrendIcon = () => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-error';
    if (trend < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm text-muted-foreground">{label}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-xs font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className={`text-3xl md:text-4xl font-heading font-bold ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            score >= 80 ? 'bg-error' : 
            score >= 60 ? 'bg-warning' : 
            score >= 40 ? 'bg-accent': 'bg-success'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default RiskScoreCard;
