import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CodePreviewPanel = ({ file, vulnerabilities, onVulnerabilityClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLines, setSelectedLines] = useState(new Set());
  const [jumpToLine, setJumpToLine] = useState('');

  const fileVulnerabilities = vulnerabilities?.filter(v => v?.file === file?.path);
  
  const lines = file?.content?.split('\n');
  const vulnerabilityMap = useMemo(() => {
    const map = new Map();
    fileVulnerabilities?.forEach(vuln => {
      if (!map?.has(vuln?.line)) {
        map?.set(vuln?.line, []);
      }
      map?.get(vuln?.line)?.push(vuln);
    });
    return map;
  }, [fileVulnerabilities]);

  const highlightedLines = useMemo(() => {
    if (!searchQuery) return lines;
    return lines?.map(line => {
      if (!line?.toLowerCase()?.includes(searchQuery?.toLowerCase())) return line;
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      return line?.replace(regex, '<mark class="bg-accent/30 text-accent">$1</mark>');
    });
  }, [lines, searchQuery]);

  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-8 text-center">
        <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
          <Icon name="FileCode" size={40} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No File Selected
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Select a file from the tree to view its contents and security annotations
        </p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-error',
      high: 'text-warning',
      medium: 'text-accent',
      low: 'text-success'
    };
    return colors?.[severity?.toLowerCase()] || 'text-muted-foreground';
  };

  const getSeverityBgColor = (severity) => {
    const colors = {
      critical: 'bg-error/10 border-l-error',
      high: 'bg-warning/10 border-l-warning',
      medium: 'bg-accent/10 border-l-accent',
      low: 'bg-success/10 border-l-success'
    };
    return colors?.[severity?.toLowerCase()] || 'bg-muted/10';
  };

  const handleLineClick = (lineNumber) => {
    setSelectedLines(prev => {
      const next = new Set(prev);
      if (next?.has(lineNumber)) {
        next?.delete(lineNumber);
      } else {
        next?.add(lineNumber);
      }
      return next;
    });
  };

  const handleJumpToLine = () => {
    const lineNum = parseInt(jumpToLine);
    if (lineNum > 0 && lineNum <= lines?.length) {
      document.getElementById(`line-${lineNum}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSelectedLines(new Set([lineNum]));
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon name="FileCode" size={20} color="var(--color-primary)" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-heading font-semibold text-foreground truncate">
              {file?.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{file?.path}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fileVulnerabilities?.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-error/10 rounded-lg border border-error/20">
              <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
              <span className="text-sm font-medium text-error">
                {fileVulnerabilities?.length} {fileVulnerabilities?.length === 1 ? 'Issue' : 'Issues'}
              </span>
            </div>
          )}
          <Button variant="outline" size="sm" iconName="Copy" iconPosition="left">
            Copy
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search in file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Line #"
            value={jumpToLine}
            onChange={(e) => setJumpToLine(e?.target?.value)}
            className="w-24 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleJumpToLine}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Jump
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-elegant">
        <div className="font-data text-sm">
          {highlightedLines?.map((line, index) => {
            const lineNumber = index + 1;
            const lineVulns = vulnerabilityMap?.get(lineNumber) || [];
            const hasVulnerability = lineVulns?.length > 0;
            const isSelected = selectedLines?.has(lineNumber);
            const highestSeverity = lineVulns?.length > 0 
              ? lineVulns?.reduce((highest, vuln) => {
                  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                  const currentLevel = severityOrder?.[vuln?.severity?.toLowerCase()] || 0;
                  const highestLevel = severityOrder?.[highest?.severity?.toLowerCase()] || 0;
                  return currentLevel > highestLevel ? vuln : highest;
                }, lineVulns?.[0])
              : null;

            return (
              <div
                key={lineNumber}
                id={`line-${lineNumber}`}
                className={`
                  flex border-l-4 transition-smooth
                  ${hasVulnerability ? getSeverityBgColor(highestSeverity?.severity) : 'border-l-transparent'}
                  ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}
                `}
              >
                <button
                  onClick={() => handleLineClick(lineNumber)}
                  className="w-16 flex-shrink-0 px-3 py-1 text-right text-muted-foreground hover:text-foreground transition-smooth select-none"
                >
                  {lineNumber}
                </button>
                <div className="flex-1 px-4 py-1 overflow-x-auto">
                  <pre 
                    className="text-foreground whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: line || ' ' }}
                  />
                </div>
                {hasVulnerability && (
                  <div className="flex items-center gap-2 px-3 py-1">
                    {lineVulns?.map((vuln, idx) => (
                      <button
                        key={idx}
                        onClick={() => onVulnerabilityClick(vuln)}
                        className={`
                          p-1.5 rounded hover:bg-muted/50 transition-smooth
                          ${getSeverityColor(vuln?.severity)}
                        `}
                        title={vuln?.title}
                      >
                        <Icon name="AlertCircle" size={16} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Lines: {lines?.length}</span>
            <span>Selected: {selectedLines?.size}</span>
            {searchQuery && (
              <span>
                Matches: {lines?.filter(l => l?.toLowerCase()?.includes(searchQuery?.toLowerCase()))?.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Language: {file?.language || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePreviewPanel;
