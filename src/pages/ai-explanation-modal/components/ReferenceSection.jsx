import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const ReferenceSection = ({ references }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-border bg-muted/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon name="BookOpen" size={18} color="var(--color-primary)" />
          <span className="text-sm font-semibold text-foreground">
            Security References & Documentation
          </span>
        </div>
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={20}
          color="var(--color-muted-foreground)"
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {references?.map((reference, index) => (
            <a
              key={index}
              href={reference?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-150 group"
            >
              <Icon
                name="ExternalLink"
                size={16}
                color="var(--color-primary)"
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {reference?.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {reference?.source}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferenceSection;