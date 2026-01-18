import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const NavigationMenu = ({ currentPath }) => {
  const menuItems = [
    {
      id: 'upload',
      label: 'Upload Interface',
      path: '/upload-interface',
      icon: 'Upload',
      description: 'Start new security scan'
    },
    {
      id: 'scanning',
      label: 'Scan Progress',
      path: '/scan-progress-tracking',
      icon: 'Activity',
      description: 'Monitor active scans'
    },
    {
      id: 'dashboard',
      label: 'Vulnerability Dashboard',
      path: '/vulnerability-dashboard',
      icon: 'Shield',
      description: 'View security findings'
    },
    {
      id: 'history',
      label: 'Scan History',
      path: '/scan-history',
      icon: 'History',
      description: 'Review past scans'
    },
    {
      id: 'ai-explanation',
      label: 'AI Explanations',
      path: '/ai-explanation-modal',
      icon: 'Brain',
      description: 'AI-powered insights'
    }
  ];

  const isActive = (path) => {
    if (path === '/upload-interface') {
      return currentPath === path || currentPath === '/';
    }
    return currentPath === path;
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Main Navigation
      </h3>
      <nav className="space-y-1" role="navigation" aria-label="Main navigation menu">
        {menuItems?.map((item) => (
          <Link
            key={item?.id}
            to={item?.path}
            className={`
              flex items-start gap-3 px-3 py-2.5 rounded-md transition-all duration-150
              ${isActive(item?.path)
                ? 'bg-primary/10 text-primary border-l-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted border-l-2 border-transparent'
              }
            `}
            aria-current={isActive(item?.path) ? 'page' : undefined}
          >
            <Icon
              name={item?.icon}
              size={18}
              className={isActive(item?.path) ? 'text-primary' : 'text-muted-foreground'}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item?.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item?.description}</div>
            </div>
            {isActive(item?.path) && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavigationMenu;