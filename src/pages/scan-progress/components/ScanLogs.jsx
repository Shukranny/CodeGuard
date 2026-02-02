import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScanLogs = ({ logs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef(null);

  const filters = [
    { value: 'all', label: 'All Logs', icon: 'List' },
    { value: 'info', label: 'Info', icon: 'Info' },
    { value: 'warning', label: 'Warnings', icon: 'AlertTriangle' },
    { value: 'error', label: 'Errors', icon: 'XCircle' }
  ];

  const getLogColor = (level) => {
    const colors = {
      info: 'text-foreground',
      warning: 'text-warning',
      error: 'text-error',
      success: 'text-success'
    };
    return colors?.[level] || 'text-muted-foreground';
  };

  const getLogIcon = (level) => {
    const icons = {
      info: 'Info',
      warning: 'AlertTriangle',
      error: 'XCircle',
      success: 'CheckCircle'
    };
    return icons?.[level] || 'Circle';
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs?.filter(log => log?.level === filter);

  useEffect(() => {
    if (autoScroll && logsEndRef?.current) {
      logsEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Terminal" size={20} color="var(--color-foreground)" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
              Scan Logs
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              {filteredLogs?.length} entries
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </Button>
      </div>
      {isExpanded && (
        <>
          <div className="flex items-center gap-2 p-4 border-b border-border overflow-x-auto">
            {filters?.map((f) => (
              <button
                key={f?.value}
                onClick={() => setFilter(f?.value)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth
                  ${filter === f?.value
                    ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }
                `}
              >
                <Icon name={f?.icon} size={14} />
                <span>{f?.label}</span>
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth
                  ${autoScroll
                    ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon name={autoScroll ? 'Lock' : 'Unlock'} size={14} />
                <span className="hidden md:inline">Auto-scroll</span>
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log('Download logs')}
              >
                <Icon name="Download" size={16} />
              </Button>
            </div>
          </div>

          <div className="h-64 md:h-80 lg:h-96 overflow-elegant p-4 bg-muted/20 font-data text-xs md:text-sm">
            {filteredLogs?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No logs available for selected filter
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLogs?.map((log) => (
                  <div 
                    key={log?.id}
                    className="flex items-start gap-3 py-1 hover:bg-muted/30 rounded px-2 transition-smooth"
                  >
                    <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {new Date(log.timestamp)?.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                    <Icon 
                      name={getLogIcon(log?.level)} 
                      size={14}
                      color={`var(--color-${log?.level === 'error' ? 'error' : log?.level === 'warning' ? 'warning' : log?.level === 'success' ? 'success' : 'foreground'})`}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <span className={`${getLogColor(log?.level)} break-all`}>
                      {log?.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScanLogs;
