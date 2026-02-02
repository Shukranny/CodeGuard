import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportMenu = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportFormats = [
    { id: 'json', label: 'JSON Report', icon: 'FileJson', description: 'Machine-readable format' },
    { id: 'pdf', label: 'PDF Report', icon: 'FileText', description: 'Human-readable document' },
    { id: 'sarif', label: 'SARIF Format', icon: 'FileCode', description: 'Static analysis format' },
    { id: 'csv', label: 'CSV Export', icon: 'Table', description: 'Spreadsheet compatible' }
  ];

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Download"
        iconPosition="left"
      >
        Export
      </Button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[1000]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-glow-lg z-[1001]">
            {exportFormats?.map((format) => (
              <button
                key={format?.id}
                onClick={() => handleExport(format?.id)}
                className="w-full flex items-start gap-3 p-3 hover:bg-muted/50 transition-smooth first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <Icon name={format?.icon} size={16} color="var(--color-primary)" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-foreground">
                    {format?.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format?.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;