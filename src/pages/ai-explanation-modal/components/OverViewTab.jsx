import React from 'react';
import Icon from '../../../components/AppIcon';

const OverviewTab = ({ vulnerability }) => {
  const getImpactColor = (level) => {
    const colors = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colors?.[level?.toLowerCase()] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h3 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          AI-Generated Explanation
        </h3>
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <Icon name="Sparkles" size={20} color="var(--color-secondary)" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base text-foreground leading-relaxed">
                {vulnerability?.aiExplanation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-secondary/10">
            <Icon name="TrendingUp" size={16} color="var(--color-secondary)" />
            <span className="text-xs md:text-sm text-secondary font-medium">
              Confidence Score: {vulnerability?.confidence}%
            </span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Business Impact Assessment
        </h4>
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm md:text-base text-foreground leading-relaxed mb-4">
            {vulnerability?.businessImpact}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-background rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Confidentiality</div>
              <div className={`text-sm md:text-base font-medium ${getImpactColor(vulnerability?.impactScores?.confidentiality)}`}>
                {vulnerability?.impactScores?.confidentiality}
              </div>
            </div>
            <div className="bg-background rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Integrity</div>
              <div className={`text-sm md:text-base font-medium ${getImpactColor(vulnerability?.impactScores?.integrity)}`}>
                {vulnerability?.impactScores?.integrity}
              </div>
            </div>
            <div className="bg-background rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Availability</div>
              <div className={`text-sm md:text-base font-medium ${getImpactColor(vulnerability?.impactScores?.availability)}`}>
                {vulnerability?.impactScores?.availability}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Affected Components
        </h4>
        <div className="space-y-2">
          {vulnerability?.affectedFiles?.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="FileCode" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0" />
              <span className="text-xs md:text-sm font-data text-foreground truncate flex-1">
                {file?.path}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Line {file?.line}
              </span>
            </div>
          ))}
        </div>
      </div>
      {vulnerability?.relatedFindings && vulnerability?.relatedFindings?.length > 0 && (
        <div>
          <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
            Related Findings
          </h4>
          <div className="space-y-2">
            {vulnerability?.relatedFindings?.map((finding, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth text-left"
              >
                <Icon name="Link" size={16} color="var(--color-primary)" className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{finding?.title}</div>
                  <div className="text-xs text-muted-foreground">{finding?.file}</div>
                </div>
                <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" className="flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
