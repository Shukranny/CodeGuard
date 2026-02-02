import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const RecentScanCard = ({ scan }) => {
  const navigate = useNavigate();

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-error';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-accent';
    return 'text-success';
  };

  const getRiskBgColor = (score) => {
    if (score >= 80) return 'bg-error/10 border-error/20';
    if (score >= 60) return 'bg-warning/10 border-warning/20';
    if (score >= 40) return 'bg-accent/10 border-accent/20';
    return 'bg-success/10 border-success/20';
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      onClick={() => navigate('/scan-results', { state: { scanId: scan?.id } })}
      className="bg-card border border-border rounded-lg p-4 md:p-6 hover:border-primary/50 hover:shadow-glow-md transition-smooth cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-smooth">
            {scan?.projectName}
          </h3>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Clock" size={14} className="flex-shrink-0" />
            <span>{formatDate(scan?.timestamp)}</span>
            <span>•</span>
            <span className="truncate">{scan?.scanType}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border ${getRiskBgColor(scan?.riskScore)} flex-shrink-0 ml-2`}>
          <span className={`text-xs md:text-sm font-medium ${getRiskColor(scan?.riskScore)}`}>
            {getRiskLabel(scan?.riskScore)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="bg-muted/30 rounded-lg p-2 md:p-3">
          <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
          <div className={`text-lg md:text-xl font-heading font-bold ${getRiskColor(scan?.riskScore)}`}>
            {scan?.riskScore}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-2 md:p-3">
          <div className="text-xs text-muted-foreground mb-1">Critical</div>
          <div className="text-lg md:text-xl font-heading font-bold text-error">
            {scan?.findings?.critical}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-2 md:p-3">
          <div className="text-xs text-muted-foreground mb-1">High</div>
          <div className="text-lg md:text-xl font-heading font-bold text-warning">
            {scan?.findings?.high}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-2 md:p-3">
          <div className="text-xs text-muted-foreground mb-1">Total</div>
          <div className="text-lg md:text-xl font-heading font-bold text-foreground">
            {scan?.findings?.total}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Icon name="FileCode" size={14} className="flex-shrink-0" />
          <span className="truncate">{scan?.filesScanned} files scanned</span>
        </div>
        <div className="flex items-center gap-1 text-primary text-xs md:text-sm font-medium group-hover:gap-2 transition-smooth flex-shrink-0">
          <span>View Details</span>
          <Icon name="ArrowRight" size={14} />
        </div>
      </div>
    </div>
  );
};

export default RecentScanCard;
