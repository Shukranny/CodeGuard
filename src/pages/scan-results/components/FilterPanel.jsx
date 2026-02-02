import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFilterChange, onReset, resultCount }) => {
  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const scannerOptions = [
    { value: 'all', label: 'All Scanners' },
    { value: 'semgrep', label: 'Semgrep' },
    { value: 'gitleaks', label: 'GitLeaks' },
    { value: 'pip-audit', label: 'pip-audit' },
    { value: 'osv', label: 'OSV.dev' }
  ];

  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'php', label: 'PHP' }
  ];

  const owaspCategories = [
    'A01:2021 - Broken Access Control',
    'A02:2021 - Cryptographic Failures',
    'A03:2021 - Injection',
    'A04:2021 - Insecure Design',
    'A05:2021 - Security Misconfiguration',
    'A06:2021 - Vulnerable Components',
    'A07:2021 - Authentication Failures',
    'A08:2021 - Data Integrity Failures',
    'A09:2021 - Security Logging Failures',
    'A10:2021 - Server-Side Request Forgery'
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Filters
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset
        </Button>
      </div>
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Severity"
            options={severityOptions}
            value={filters?.severity}
            onChange={(value) => onFilterChange('severity', value)}
          />
          <Select
            label="Scanner"
            options={scannerOptions}
            value={filters?.scanner}
            onChange={(value) => onFilterChange('scanner', value)}
          />
          <Select
            label="Language"
            options={languageOptions}
            value={filters?.language}
            onChange={(value) => onFilterChange('language', value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            OWASP Top 10 Categories
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-elegant">
            {owaspCategories?.map((category) => (
              <Checkbox
                key={category}
                label={category}
                size="sm"
                checked={filters?.owaspCategories?.includes(category)}
                onChange={(e) => {
                  const newCategories = e?.target?.checked
                    ? [...(filters?.owaspCategories || []), category]
                    : (filters?.owaspCategories || [])?.filter(c => c !== category);
                  onFilterChange('owaspCategories', newCategories);
                }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
            <Checkbox
              label="Show dismissed"
              size="sm"
              checked={filters?.showDismissed}
              onChange={(e) => onFilterChange('showDismissed', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;