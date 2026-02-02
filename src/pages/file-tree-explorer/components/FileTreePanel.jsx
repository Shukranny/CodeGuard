import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FileTreePanel = ({ files, selectedFile, onFileSelect, vulnerabilities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [showVulnerabilitiesOnly, setShowVulnerabilitiesOnly] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState('all');

  const getFileVulnerabilities = (filePath) => {
    return vulnerabilities?.filter(v => v?.file === filePath);
  };

  const getHighestSeverity = (filePath) => {
    const fileVulns = getFileVulnerabilities(filePath);
    if (fileVulns?.length === 0) return null;
    
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return fileVulns?.reduce((highest, vuln) => {
      const currentLevel = severityOrder?.[vuln?.severity?.toLowerCase()] || 0;
      const highestLevel = severityOrder?.[highest?.toLowerCase()] || 0;
      return currentLevel > highestLevel ? vuln?.severity : highest;
    }, null);
  };

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
      critical: 'bg-error/10 border-error/20',
      high: 'bg-warning/10 border-warning/20',
      medium: 'bg-accent/10 border-accent/20',
      low: 'bg-success/10 border-success/20'
    };
    return colors?.[severity?.toLowerCase()] || 'bg-muted/30';
  };

  const getFileIcon = (fileName, isFolder) => {
    if (isFolder) return 'Folder';
    const ext = fileName?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      js: 'FileCode',
      jsx: 'FileCode',
      ts: 'FileCode',
      tsx: 'FileCode',
      py: 'FileCode',
      java: 'FileCode',
      go: 'FileCode',
      php: 'FileCode',
      json: 'FileJson',
      md: 'FileText',
      txt: 'FileText',
      yml: 'Settings',
      yaml: 'Settings',
      xml: 'FileCode',
      html: 'FileCode',
      css: 'Palette',
      scss: 'Palette'
    };
    return iconMap?.[ext] || 'File';
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next?.has(path)) {
        next?.delete(path);
      } else {
        next?.add(path);
      }
      return next;
    });
  };

  const filteredFiles = useMemo(() => {
    return files?.filter(file => {
      const matchesSearch = file?.path?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const hasVulnerabilities = getFileVulnerabilities(file?.path)?.length > 0;
      const matchesVulnFilter = !showVulnerabilitiesOnly || hasVulnerabilities;
      
      let matchesTypeFilter = true;
      if (fileTypeFilter !== 'all') {
        const ext = file?.path?.split('.')?.pop()?.toLowerCase();
        matchesTypeFilter = ext === fileTypeFilter;
      }
      
      return matchesSearch && matchesVulnFilter && matchesTypeFilter;
    });
  }, [files, searchQuery, showVulnerabilitiesOnly, fileTypeFilter, vulnerabilities]);

  const fileTypes = useMemo(() => {
    const types = new Set(['all']);
    files?.forEach(file => {
      if (!file?.isFolder) {
        const ext = file?.path?.split('.')?.pop()?.toLowerCase();
        types?.add(ext);
      }
    });
    return Array.from(types);
  }, [files]);

  const renderFileTree = (items, level = 0) => {
    return items?.map((file) => {
      const isExpanded = expandedFolders?.has(file?.path);
      const vulnCount = getFileVulnerabilities(file?.path)?.length;
      const severity = getHighestSeverity(file?.path);
      const isSelected = selectedFile?.path === file?.path;

      return (
        <div key={file?.path}>
          <button
            onClick={() => {
              if (file?.isFolder) {
                toggleFolder(file?.path);
              } else {
                onFileSelect(file);
              }
            }}
            className={`
              w-full flex items-center gap-2 px-3 py-2 text-left transition-smooth
              hover:bg-muted/50 group
              ${isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'}
            `}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
          >
            {file?.isFolder && (
              <Icon 
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                size={16} 
                className="flex-shrink-0"
              />
            )}
            <Icon 
              name={getFileIcon(file?.name, file?.isFolder)} 
              size={16}
              className="flex-shrink-0"
              color={isSelected ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
            />
            <span className="flex-1 text-sm font-data truncate">{file?.name}</span>
            {vulnCount > 0 && (
              <div className={`
                flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                ${getSeverityBgColor(severity)} border
              `}>
                <Icon name="AlertTriangle" size={12} className={getSeverityColor(severity)} />
                <span className={getSeverityColor(severity)}>{vulnCount}</span>
              </div>
            )}
          </button>
          {file?.isFolder && isExpanded && file?.children && (
            <div>
              {renderFileTree(file?.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const buildTree = (files) => {
    const root = { name: 'root', path: 'root', isFolder: true, children: [] };
    const map = { 'root': root };

    files?.forEach(file => {
      const parts = file?.path?.split('/');
      let currentPath = 'root';
      
      parts?.forEach((part, index) => {
        const isLast = index === parts?.length - 1;
        const fullPath = parts?.slice(0, index + 1)?.join('/');
        
        if (!map?.[fullPath]) {
          const node = {
            name: part,
            path: fullPath,
            isFolder: !isLast,
            children: []
          };
          map[fullPath] = node;
          map?.[currentPath]?.children?.push(node);
        }
        
        currentPath = fullPath;
      });
    });

    return root.children;
  };

  const tree = useMemo(() => buildTree(filteredFiles), [filteredFiles]);

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-heading font-semibold text-foreground">
            Project Files
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandedFolders(new Set(['root']))}
              className="p-1.5 hover:bg-muted/50 rounded transition-smooth"
              title="Collapse All"
            >
              <Icon name="FoldVertical" size={16} color="var(--color-muted-foreground)" />
            </button>
            <button
              onClick={() => {
                const allPaths = new Set(['root']);
                files?.forEach(f => {
                  if (f?.isFolder) allPaths?.add(f?.path);
                });
                setExpandedFolders(allPaths);
              }}
              className="p-1.5 hover:bg-muted/50 rounded transition-smooth"
              title="Expand All"
            >
              <Icon name="UnfoldVertical" size={16} color="var(--color-muted-foreground)" />
            </button>
          </div>
        </div>

        <Input
          type="search"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="text-sm"
        />

        <div className="flex items-center gap-3">
          <Checkbox
            label="Vulnerabilities only"
            checked={showVulnerabilitiesOnly}
            onChange={(e) => setShowVulnerabilitiesOnly(e?.target?.checked)}
            size="sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {fileTypes?.map(type => (
            <button
              key={type}
              onClick={() => setFileTypeFilter(type)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-smooth
                ${fileTypeFilter === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }
              `}
            >
              {type === 'all' ? 'All' : `.${type}`}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-elegant">
        {tree?.length > 0 ? (
          renderFileTree(tree)
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mb-3" />
            <p className="text-sm text-muted-foreground">No files found</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Total Files</div>
            <div className="text-lg font-semibold text-foreground">{files?.length}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">With Issues</div>
            <div className="text-lg font-semibold text-error">
              {files?.filter(f => getFileVulnerabilities(f?.path)?.length > 0)?.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTreePanel;