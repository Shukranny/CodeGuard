import React from 'react';
import Icon from '../../../components/AppIcon';
import './dark-mode-toggle.css';

const DarkModeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          {isDarkMode ? (
            <Icon name="Moon" size={24} color="white" />
          ) : (
            <Icon name="Sun" size={24} color="white" />
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-foreground">
            Dark Mode
          </h4>
          <p className="text-sm text-muted-foreground">
            {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
          </p>
        </div>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={() => onToggle(!isDarkMode)}
        className={`
          relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-300
          ${isDarkMode ? 'bg-primary' : 'bg-muted'}
          hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        `}
        role="switch"
        aria-checked={isDarkMode}
        aria-label="Toggle dark mode"
      >
        <span
          className={`
            inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300
            ${isDarkMode ? 'translate-x-8' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default DarkModeToggle;
