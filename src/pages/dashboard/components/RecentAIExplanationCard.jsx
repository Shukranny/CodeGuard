import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import AIExplanationOverlay from '../../../components/navigation/AIExplanationOverlay';

const RecentAIExplanationCard = ({ explanation }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-error',
      high: 'text-warning',
      medium: 'text-accent',
      low: 'text-success'
    };
    return colors?.[severity?.toLowerCase()] || 'text-muted-foreground';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div 
        onClick={() => setShowOverlay(true)}
        className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-card border border-border rounded-lg hover:border-secondary/50 hover:shadow-glow-md transition-smooth cursor-pointer group"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Sparkles" size={20} color="var(--color-secondary)" className="md:w-6 md:h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground truncate group-hover:text-secondary transition-smooth">
              {explanation?.title}
            </h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(explanation?.severity)} bg-${explanation?.severity === 'critical' ? 'error' : explanation?.severity === 'high' ? 'warning' : 'accent'}/10 flex-shrink-0`}>
              {explanation?.severity}
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2">
            {explanation?.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={12} className="flex-shrink-0" />
              <span>{formatDate(explanation?.accessedAt)}</span>
            </div>
            <span>•</span>
            <span className="truncate">CWE-{explanation?.cweId}</span>
          </div>
        </div>

        <Icon 
          name="ExternalLink" 
          size={16} 
          color="var(--color-muted-foreground)"
          className="opacity-0 group-hover:opacity-100 transition-smooth flex-shrink-0 mt-1"
        />
      </div>
      {showOverlay && (
        <AIExplanationOverlay
          vulnerability={explanation}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </>
  );
};

export default RecentAIExplanationCard;