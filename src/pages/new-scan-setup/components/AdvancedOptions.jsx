import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedOptions = ({ options, onOptionsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const owaspCategories = [
    { id: 'a01', label: 'A01:2021 - Broken Access Control' },
    { id: 'a02', label: 'A02:2021 - Cryptographic Failures' },
    { id: 'a03', label: 'A03:2021 - Injection' },
    { id: 'a04', label: 'A04:2021 - Insecure Design' },
    { id: 'a05', label: 'A05:2021 - Security Misconfiguration' },
    { id: 'a06', label: 'A06:2021 - Vulnerable Components' },
    { id: 'a07', label: 'A07:2021 - Authentication Failures' },
    { id: 'a08', label: 'A08:2021 - Software and Data Integrity' },
    { id: 'a09', label: 'A09:2021 - Security Logging Failures' },
    { id: 'a10', label: 'A10:2021 - Server-Side Request Forgery' }
  ];

  const handlePathExclusionChange = (value) => {
    onOptionsChange({ ...options, pathExclusions: value });
  };

  const handleTimeoutChange = (value) => {
    onOptionsChange({ ...options, scanTimeout: parseInt(value) || 30 });
  };

  const handleOwaspToggle = (categoryId) => {
    const current = options?.owaspCategories || [];
    const updated = current?.includes(categoryId)
      ? current?.filter(id => id !== categoryId)
      : [...current, categoryId];
    onOptionsChange({ ...options, owaspCategories: updated });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-smooth"
      >
        <div className="flex items-center gap-3">
          <Icon name="Settings" size={20} color="var(--color-primary)" />
          <span className="text-base font-heading font-semibold text-foreground">
            Advanced Options
          </span>
        </div>
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          size={20}
          color="var(--color-muted-foreground)"
        />
      </button>
      {isExpanded && (
        <div className="space-y-6 p-4 md:p-6 bg-card border border-border rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                Path Exclusion Patterns
                <button className="group relative">
                  <Icon name="Info" size={14} color="var(--color-muted-foreground)" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-popover border border-border rounded-lg text-xs text-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
                    Exclude files or directories from scanning using glob patterns (e.g., **/node_modules/**, **/*.test.js)
                  </div>
                </button>
              </label>
              <Input
                type="text"
                placeholder="**/node_modules/**, **/test/**, **/*.min.js"
                value={options?.pathExclusions || ''}
                onChange={(e) => handlePathExclusionChange(e?.target?.value)}
                description="Comma-separated glob patterns"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                Scan Timeout (minutes)
                <button className="group relative">
                  <Icon name="Info" size={14} color="var(--color-muted-foreground)" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-popover border border-border rounded-lg text-xs text-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
                    Maximum time allowed for the scan to complete. Recommended: 30-60 minutes for large projects
                  </div>
                </button>
              </label>
              <Input
                type="number"
                min="5"
                max="120"
                placeholder="30"
                value={options?.scanTimeout || 30}
                onChange={(e) => handleTimeoutChange(e?.target?.value)}
                description="Range: 5-120 minutes"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                OWASP Top 10 Categories
              </label>
              <button
                onClick={() => {
                  const allSelected = owaspCategories?.length === (options?.owaspCategories?.length || 0);
                  onOptionsChange({
                    ...options,
                    owaspCategories: allSelected ? [] : owaspCategories?.map(c => c?.id)
                  });
                }}
                className="text-xs text-primary hover:text-primary/80 transition-smooth"
              >
                {owaspCategories?.length === (options?.owaspCategories?.length || 0) ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-elegant">
              {owaspCategories?.map((category) => (
                <Checkbox
                  key={category?.id}
                  label={category?.label}
                  checked={options?.owaspCategories?.includes(category?.id) || false}
                  onChange={() => handleOwaspToggle(category?.id)}
                  size="sm"
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Checkbox
              label="Enable verbose logging"
              description="Include detailed scan logs in the report"
              checked={options?.verboseLogging || false}
              onChange={(e) => onOptionsChange({ ...options, verboseLogging: e?.target?.checked })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedOptions;
