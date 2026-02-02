import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="border-b border-border bg-card" role="tablist" aria-label="Vulnerability analysis sections">
      <div className="flex overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            role="tab"
            aria-selected={activeTab === tab?.id}
            aria-controls={`panel-${tab?.id}`}
            id={`tab-${tab?.id}`}
            onClick={() => onTabChange(tab?.id)}
            className={`
              flex-shrink-0 px-6 py-4 text-sm font-medium transition-all duration-150 ease-out
              border-b-2 whitespace-nowrap
              ${activeTab === tab?.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            {tab?.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
