import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProjectSwitcher = ({ selectedProject, onProjectSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const projects = [
    {
      id: 'codeguard-scanner',
      name: 'CodeGuard Scanner',
      lastScan: '2 hours ago',
      vulnerabilities: 23
    },
    {
      id: 'ecommerce-platform',
      name: 'E-Commerce Platform',
      lastScan: '1 day ago',
      vulnerabilities: 45
    },
    {
      id: 'mobile-banking-app',
      name: 'Mobile Banking App',
      lastScan: '3 days ago',
      vulnerabilities: 12
    }
  ];

  const currentProject = projects?.find(p => p?.id === selectedProject);

  const handleProjectSelect = (projectId) => {
    onProjectSwitch?.(projectId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Current Project
      </h3>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Switch project"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon name="FolderGit2" size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="font-medium text-sm text-foreground truncate">
              {currentProject?.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentProject?.vulnerabilities} vulnerabilities
            </div>
          </div>
        </div>
        <Icon
          name={isOpen ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          className="text-muted-foreground flex-shrink-0"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-elevation-3 z-20 animate-slide-in"
            role="listbox"
          >
            {projects?.map((project) => (
              <button
                key={project?.id}
                onClick={() => handleProjectSelect(project?.id)}
                className={`
                  w-full flex items-start gap-3 px-3 py-2.5 transition-colors
                  ${project?.id === selectedProject
                    ? 'bg-primary/10 text-primary' :'hover:bg-muted text-foreground'
                  }
                  ${project?.id === projects?.[0]?.id ? 'rounded-t-md' : ''}
                  ${project?.id === projects?.[projects?.length - 1]?.id ? 'rounded-b-md' : ''}
                `}
                role="option"
                aria-selected={project?.id === selectedProject}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon name="FolderGit2" size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-medium text-sm truncate">{project?.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Last scan: {project?.lastScan} • {project?.vulnerabilities} issues
                  </div>
                </div>
                {project?.id === selectedProject && (
                  <Icon name="Check" size={16} className="text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSwitcher;