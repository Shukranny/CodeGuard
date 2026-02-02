import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AIExplanationOverlay = ({ vulnerability, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    const handleEscape = (e) => {
      if (e?.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'remediation', label: 'Remediation', icon: 'Wrench' },
    { id: 'examples', label: 'Code Examples', icon: 'Code' }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-error',
      high: 'text-warning',
      medium: 'text-accent',
      low: 'text-success'
    };
    return colors?.[severity?.toLowerCase()] || 'text-muted-foreground';
  };

  return (
    <div 
      className={`
        fixed inset-0 z-[1030] flex items-start justify-center pt-[8vh] px-4
        transition-opacity duration-250
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleClose}
    >
      <div className="fixed inset-0 bg-background" />
      <div 
        className={`
          relative w-full max-w-4xl bg-surface rounded-xl shadow-glow-2xl
          transition-transform duration-250
          ${isVisible ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={24} color="var(--color-secondary)" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                AI Security Analysis
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Powered by advanced vulnerability detection
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="border-b border-border">
          <div className="flex gap-1 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium text-sm
                  border-b-2 transition-smooth
                  ${activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-elegant">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                      {vulnerability?.title || 'SQL Injection Vulnerability'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getSeverityColor(vulnerability?.severity)}`}>
                        {vulnerability?.severity || 'Critical'} Severity
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        CWE-{vulnerability?.cweId || '89'}
                      </span>
                    </div>
                  </div>
                  <div className="status-badge bg-error/10 text-error">
                    Exploitable
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {vulnerability?.description || 'This vulnerability allows attackers to inject malicious SQL commands through user input, potentially compromising the entire database.'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                  Impact Assessment
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Confidentiality</div>
                    <div className="text-sm font-medium text-error">High</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Integrity</div>
                    <div className="text-sm font-medium text-error">High</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Availability</div>
                    <div className="text-sm font-medium text-warning">Medium</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                  Affected Components
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="FileCode" size={16} color="var(--color-muted-foreground)" />
                    <span className="text-sm font-data text-foreground">
                      {vulnerability?.file || 'src/api/users.js'}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Line {vulnerability?.line || '42'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'remediation' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                  Recommended Fix
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <ol className="space-y-3 list-decimal list-inside">
                    <li className="text-sm text-foreground">
                      Use parameterized queries or prepared statements
                    </li>
                    <li className="text-sm text-foreground">
                      Implement input validation and sanitization
                    </li>
                    <li className="text-sm text-foreground">
                      Apply principle of least privilege to database accounts
                    </li>
                    <li className="text-sm text-foreground">
                      Enable SQL injection detection in WAF
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                  Implementation Priority
                </h4>
                <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                  <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                  <div>
                    <div className="text-sm font-medium text-error">Immediate Action Required</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      This vulnerability is actively exploitable and should be patched within 24 hours
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                  Testing Recommendations
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mt-0.5" />
                    <div className="text-sm text-foreground">
                      Verify parameterized queries prevent SQL injection attempts
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mt-0.5" />
                    <div className="text-sm text-foreground">
                      Test input validation with common SQL injection payloads
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="XCircle" size={16} color="var(--color-error)" />
                  Vulnerable Code
                </h4>
                <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm font-data text-foreground">
{`const query = "SELECT * FROM users WHERE id = " + userId;
db.execute(query);`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  Secure Implementation
                </h4>
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm font-data text-foreground">
{`const query = "SELECT * FROM users WHERE id = ?";
db.execute(query, [userId]);`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
                  Additional Resources
                </h4>
                <div className="space-y-2">
                  <a 
                    href="#" 
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <Icon name="ExternalLink" size={16} color="var(--color-primary)" />
                    <span className="text-sm text-primary">OWASP SQL Injection Prevention Cheat Sheet</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <Icon name="ExternalLink" size={16} color="var(--color-primary)" />
                    <span className="text-sm text-primary">CWE-89: SQL Injection Details</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Close
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Export Report
            </Button>
            <Button
              variant="default"
              iconName="CheckCircle"
              iconPosition="left"
            >
              Mark as Resolved
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExplanationOverlay;
