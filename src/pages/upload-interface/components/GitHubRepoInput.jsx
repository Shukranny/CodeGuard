import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const GitHubRepoInput = ({ onRepoSubmit, isValidating }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [validationState, setValidationState] = useState('idle'); // idle, validating, valid, invalid
  const [errorMessage, setErrorMessage] = useState('');

  const GITHUB_URL_PATTERN = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;

  useEffect(() => {
    if (!repoUrl) {
      setValidationState('idle');
      setErrorMessage('');
      return;
    }

    const debounceTimer = setTimeout(() => {
      validateGitHubUrl(repoUrl);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [repoUrl]);

  const validateGitHubUrl = (url) => {
    if (!url) {
      setValidationState('idle');
      setErrorMessage('');
      return;
    }

    setValidationState('validating');

    // Simulate validation
    setTimeout(() => {
      if (GITHUB_URL_PATTERN?.test(url)) {
        setValidationState('valid');
        setErrorMessage('');
      } else {
        setValidationState('invalid');
        setErrorMessage('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)');
      }
    }, 300);
  };

  const handleInputChange = (e) => {
    setRepoUrl(e?.target?.value);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validationState === 'valid') {
      onRepoSubmit(repoUrl);
    }
  };

  const handleClear = () => {
    setRepoUrl('');
    setValidationState('idle');
    setErrorMessage('');
  };

  const getInputIcon = () => {
    switch (validationState) {
      case 'validating':
        return <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground" />;
      case 'valid':
        return <Icon name="CheckCircle" size={20} color="var(--color-success)" />;
      case 'invalid':
        return <Icon name="AlertCircle" size={20} color="var(--color-error)" />;
      default:
        return <Icon name="Github" size={20} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="url"
            label="GitHub Repository URL"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={handleInputChange}
            error={validationState === 'invalid' ? errorMessage : ''}
            description="Enter the full URL of your GitHub repository"
            disabled={isValidating}
          />
          <div className="absolute right-3 top-9">
            {getInputIcon()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="default"
            disabled={validationState !== 'valid' || isValidating}
            iconName="GitBranch"
            iconPosition="left"
            loading={isValidating}
          >
            Connect Repository
          </Button>

          {repoUrl && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              iconName="X"
              iconPosition="left"
              disabled={isValidating}
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Repository Access</p>
            <p>Make sure your repository is public or you have provided the necessary access tokens for private repositories.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubRepoInput;
