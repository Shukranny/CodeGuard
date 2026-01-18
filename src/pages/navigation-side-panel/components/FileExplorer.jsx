import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FileExplorer = ({ projectName, isExpanded, onToggle }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src', 'src/components']));

  const fileTree = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      vulnerabilities: 15,
      children: [
        {
          id: 'src/components',
          name: 'components',
          type: 'folder',
          vulnerabilities: 8,
          children: [
            { id: 'src/components/auth.jsx', name: 'auth.jsx', type: 'file', vulnerabilities: 3, severity: 'high' },
            { id: 'src/components/user.jsx', name: 'user.jsx', type: 'file', vulnerabilities: 2, severity: 'medium' },
            { id: 'src/components/header.jsx', name: 'header.jsx', type: 'file', vulnerabilities: 0, severity: null }
          ]
        },
        {
          id: 'src/pages',
          name: 'pages',
          type: 'folder',
          vulnerabilities: 5,
          children: [
            { id: 'src/pages/login.jsx', name: 'login.jsx', type: 'file', vulnerabilities: 2, severity: 'high' },
            { id: 'src/pages/dashboard.jsx', name: 'dashboard.jsx', type: 'file', vulnerabilities: 1, severity: 'low' }
          ]
        },
        { id: 'src/app.jsx', name: 'app.jsx', type: 'file', vulnerabilities: 2, severity: 'medium' }
      ]
    },
    {
      id: 'config',
      name: 'config',
      type: 'folder',
      vulnerabilities: 3,
      children: [
        { id: 'config/database.js', name: 'database.js', type: 'file', vulnerabilities: 2, severity: 'critical' },
        { id: 'config/api.js', name: 'api.js', type: 'file', vulnerabilities: 1, severity: 'medium' }
      ]
    },
    { id: 'package.json', name: 'package.json', type: 'file', vulnerabilities: 0, severity: null }
  ];

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(folderId)) {
        newSet?.delete(folderId);
      } else {
        newSet?.add(folderId);
      }
      return newSet;
    });
  };

  const getSeverityColor = (severity) => {
    const colorMap = {
      critical: 'text-error',
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colorMap?.[severity] || 'text-muted-foreground';
  };

  const getSeverityBg = (severity) => {
    const bgMap = {
      critical: 'bg-error/10',
      high: 'bg-error/10',
      medium: 'bg-warning/10',
      low: 'bg-success/10'
    };
    return bgMap?.[severity] || 'bg-muted';
  };

  const renderFileTreeItem = (item, depth = 0) => {
    const isFolder = item?.type === 'folder';
    const isFolderExpanded = expandedFolders?.has(item?.id);
    const hasVulnerabilities = item?.vulnerabilities > 0;

    return (
      <div key={item?.id}>
        <div
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
            hover:bg-muted transition-colors
          `}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => isFolder && toggleFolder(item?.id)}
          role={isFolder ? 'button' : undefined}
          aria-expanded={isFolder ? isFolderExpanded : undefined}
        >
          {isFolder && (
            <Icon
              name={isFolderExpanded ? 'ChevronDown' : 'ChevronRight'}
              size={14}
              className="text-muted-foreground flex-shrink-0"
            />
          )}
          <Icon
            name={isFolder ? (isFolderExpanded ? 'FolderOpen' : 'Folder') : 'File'}
            size={14}
            className="text-muted-foreground flex-shrink-0"
          />
          <span className="text-sm text-foreground flex-1 min-w-0 truncate">
            {item?.name}
          </span>
          {hasVulnerabilities && (
            <span
              className={`
                flex items-center justify-center min-w-[18px] h-4 px-1 rounded text-xs font-semibold
                ${getSeverityBg(item?.severity)} ${getSeverityColor(item?.severity)}
              `}
              title={`${item?.vulnerabilities} vulnerabilities`}
            >
              {item?.vulnerabilities}
            </span>
          )}
        </div>
        {isFolder && isFolderExpanded && item?.children && (
          <div>
            {item?.children?.map(child => renderFileTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-3"
        aria-expanded={isExpanded}
        aria-label="Toggle file explorer"
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          File Explorer
        </h3>
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          size={14}
          className="text-muted-foreground"
        />
      </button>

      {isExpanded && (
        <div className="bg-muted/30 rounded-md p-2 max-h-80 overflow-y-auto">
          <div className="mb-2 pb-2 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="FolderGit2" size={14} />
              <span className="font-medium text-foreground">{projectName}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            {fileTree?.map(item => renderFileTreeItem(item))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;