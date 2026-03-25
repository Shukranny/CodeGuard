import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useScanProgress } from '../../context/ScanProgressContext';
import Header from '../../components/navigation/Header';
import AIExplanationOverlay from '../../components/navigation/AIExplanationOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import RiskScoreCard from './components/RiskScoreCard';
import SeverityDistributionChart from './components/SeverityDistributionChart';
import FilterPanel from './components/FilterPanel';
import FindingRow from './components/FindingRow';
import ScanSummaryStats from './components/ScanSummaryStats';
import ExportMenu from './components/ExportMenu';
import TopRiskyFiles from './components/TopRiskyFiles';

const ScanResults = () => {
  const navigate = useNavigate();
  const { scanState } = useScanProgress();
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [sortBy, setSortBy] = useState('severity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    severity: 'all',
    scanner: 'all',
    language: 'all',
    owaspCategories: [],
    showDismissed: false
  });

  useEffect(() => {
    const fetchScanResults = async () => {
      const scanId = scanState?.id || JSON.parse(localStorage.getItem('activeScan'))?.id;
      if (!scanId || scanId === 'new_scan') {
        setLoading(false);
        setError('No active scan found. Please start a new scan.');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/scans/${scanId}/`);
        const rawData = response.data;
        
        // Transform backend data to frontend format
        const transformedData = transformScanData(rawData);
        setScanData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching scan results:', err);
        setError('Failed to fetch scan results. Please try again.');
        setLoading(false);
      }
    };

    fetchScanResults();
  }, [scanState?.id]);

  const transformScanData = (rawData) => {
    const scannersData = rawData?.result?.scans || {};
    const findings = [];
    
    // Severity mapping
    const mapSeverity = (severity, scanner) => {
      const s = severity?.toLowerCase();
      if (scanner === 'semgrep') {
        if (s === 'error') return 'critical';
        if (s === 'warning') return 'high';
        return 'medium';
      }
      if (scanner === 'gitleaks') return 'critical';
      if (scanner === 'dependency') {
        if (s === 'critical') return 'critical';
        if (s === 'high') return 'high';
        if (s === 'moderate') return 'medium';
        return 'low';
      }
      return 'medium';
    };

    // 1. Semgrep findings
    if (scannersData?.semgrep?.all_vulnerabilities) {
      scannersData.semgrep.all_vulnerabilities.forEach((f, idx) => {
        findings.push({
          id: `semgrep_${idx}`,
          title: f.extra?.message?.split('.')?.[0] || 'Security issue detected',
          severity: mapSeverity(f.extra?.severity, 'semgrep'),
          confidence: 90,
          scanner: 'Semgrep',
          file: f.path,
          line: f.start?.line,
          language: f.path?.split('.')?.[f.path?.split('.')?.length - 1] || 'unknown',
          owasp: f.extra?.metadata?.owasp?.[0] || 'N/A',
          cwe: f.extra?.metadata?.cwe?.[0] || 'N/A',
          description: f.extra?.message || 'No description available',
          codeSnippet: f.extra?.lines || '',
          remediation: f.extra?.metadata?.remediation || f.extra?.message || 'Follow security best practices to remediate this issue.',
          fixCode: f.extra?.fix || null
        });
      });
    }

    // 2. GitLeaks findings
    if (scannersData?.gitleaks?.all_vulnerabilities) {
      scannersData.gitleaks.all_vulnerabilities.forEach((f, idx) => {
        findings.push({
          id: `gitleaks_${idx}`,
          title: `Exposed Secret: ${f.Description || 'Credential'}`,
          severity: 'critical',
          confidence: 98,
          scanner: 'GitLeaks',
          file: f.File,
          line: f.StartLine,
          language: f.File?.split('.')?.[f.File?.split('.')?.length - 1] || 'unknown',
          owasp: 'A02:2021',
          cwe: 'CWE-798',
          description: `Hardcoded ${f.Description} detected in ${f.File}. These secrets should be moved to secure vaults or environment variables.`,
          codeSnippet: f.Match || '',
          remediation: 'Remove the hardcoded secret immediately. Revoke the credential and rotate it if it was previously pushed to a repository.',
          fixCode: '// Use environment variables or a secret manager instead\nconst apiKey = process.env.API_KEY;'
        });
      });
    }

    // 3. Dependency (npm audit) findings
    if (scannersData?.dependency?.all_vulnerabilities) {
      Object?.entries(scannersData.dependency.all_vulnerabilities).forEach(([pkg, info]) => {
        findings.push({
          id: `dep_${pkg}`,
          title: `Vulnerable Dependency: ${pkg} ${info.range}`,
          severity: mapSeverity(info.severity, 'dependency'),
          confidence: 100,
          scanner: 'Dependency',
          file: 'package-lock.json',
          line: 0,
          language: 'npm',
          owasp: 'A06:2021',
          cwe: 'CWE-1104',
          description: `Package ${pkg} has security vulnerabilities. Summary: ${scannersData.dependency.summary || 'N/A'}`,
          codeSnippet: `"package": "${pkg}", "version": "${info.range}"`,
          remediation: `Update ${pkg} to the latest secure version by running the following command in your terminal.`,
          fixCode: `npm update ${pkg}`
        });
      });
    }

    // Calculate severity distribution
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    const filesMap = {};

    findings.forEach(f => {
      distribution[f.severity]++;
      
      if (!filesMap[f.file]) {
        filesMap[f.file] = {
          path: f.file,
          vulnerabilities: 0,
          riskScore: 0,
          highestSeverity: 'low'
        };
      }
      
      filesMap[f.file].vulnerabilities++;
      const severityScores = { critical: 40, high: 20, medium: 10, low: 5 };
      filesMap[f.file].riskScore = Math.min(100, filesMap[f.file].riskScore + (severityScores[f.severity] || 0));
      
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      if (severityOrder[f.severity] > severityOrder[filesMap[f.file].highestSeverity]) {
        filesMap[f.file].highestSeverity = f.severity;
      }
    });

    // Sort files by risk score and take top 4
    const topRiskyFiles = Object.values(filesMap)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 4);

    // Simple overall risk score calculation
    const score = Math.max(0, 100 - (distribution.critical * 10 + distribution.high * 5 + distribution.medium * 2));

    return {
      scanId: rawData?.id,
      projectName: rawData?.project_name || 'Secure Project',
      scanDate: rawData?.started_at,
      duration: rawData?.completed_at ? `${Math.round((new Date(rawData.completed_at) - new Date(rawData.started_at)) / 1000)}s` : 'N/A',
      overallRiskScore: score,
      riskTrend: 0,
      stats: {
        totalFindings: findings.length,
        critical: distribution.critical,
        high: distribution.high,
        medium: distribution.medium,
        low: distribution.low,
        filesScanned: Object.keys(filesMap).length,
        duration: rawData?.completed_at ? `${Math.round((new Date(rawData.completed_at) - new Date(rawData.started_at)) / 1000)}s` : 'N/A'
      },
      severityDistribution: distribution,
      topRiskyFiles: topRiskyFiles,
      findings: findings
    };
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      severity: 'all',
      scanner: 'all',
      language: 'all',
      owaspCategories: [],
      showDismissed: false
    });
    setSearchQuery('');
  };

  const handleViewDetails = (finding) => {
    setSelectedFinding(finding);
    setShowAIExplanation(true);
  };

  const handleDismissFinding = (findingId) => {
    console.log('Dismissing finding:', findingId);
  };

  const handleExport = (format) => {
    console.log('Exporting as:', format);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredFindings = scanData?.findings?.filter(finding => {
    if (filters?.severity !== 'all' && finding?.severity !== filters?.severity) return false;
    if (filters?.scanner !== 'all' && finding?.scanner?.toLowerCase() !== filters?.scanner) return false;
    if (filters?.language !== 'all' && finding?.language !== filters?.language) return false;
    if (filters?.owaspCategories?.length > 0 && !filters?.owaspCategories?.some(cat => finding?.owasp?.includes(cat?.split(':')?.[0]))) return false;
    if (searchQuery && !finding?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && !finding?.file?.toLowerCase()?.includes(searchQuery?.toLowerCase())) return false;
    return true;
  }) || [];

  const sortedFindings = [...filteredFindings]?.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    if (sortBy === 'severity') {
      const comparison = severityOrder?.[b?.severity] - severityOrder?.[a?.severity];
      return sortOrder === 'asc' ? -comparison : comparison;
    }
    
    if (sortBy === 'confidence') {
      return sortOrder === 'asc' ? a?.confidence - b?.confidence : b?.confidence - a?.confidence;
    }
    
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icon name="Loader" size={48} className="animate-spin color-primary" />
          <p className="text-lg font-medium text-foreground">Loading scan results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-6">
          <Icon name="AlertCircle" size={48} color="var(--color-destructive)" />
          <h2 className="text-xl font-bold text-foreground">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!scanData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Scan Results
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Icon name="FolderGit2" size={16} />
                    {scanData?.projectName}
</span>
<span>•</span>
<span className="flex items-center gap-1.5">
  <Icon name="Calendar" size={16} />
  {new Date(scanData.scanDate)?.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
</span>
<span>•</span>
<span className="font-data">{scanData?.scanId}</span>
</div>
</div>
<div className="flex flex-wrap gap-2">
<Button
variant="outline"
onClick={() => navigate('/file-tree-explorer')}
iconName="FolderTree"
iconPosition="left"
>
Code Explorer
</Button>
<ExportMenu onExport={handleExport} />
<Button
variant="default"
onClick={() => navigate('/new-scan-setup')}
iconName="Plus"
iconPosition="left"
>
New Scan
</Button>
</div>
</div>

<ScanSummaryStats stats={scanData?.stats} />
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
<RiskScoreCard 
score={scanData?.overallRiskScore} 
trend={scanData?.riskTrend}
label="Overall Risk Score"
/>
<div className="lg:col-span-2">
<SeverityDistributionChart data={scanData?.severityDistribution} />
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
<div className="lg:col-span-2">
<FilterPanel 
filters={filters}
onFilterChange={handleFilterChange}
onReset={handleResetFilters}
resultCount={filteredFindings?.length}
/>
</div>
<TopRiskyFiles files={scanData?.topRiskyFiles} />
</div>

          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                Vulnerability Findings
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="search"
                  placeholder="Search findings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full sm:w-64"
                />
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'severity' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('severity')}
                    iconName={sortBy === 'severity' && sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                    iconPosition="right"
                  >
                    Severity
                  </Button>
                  <Button
                    variant={sortBy === 'confidence' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('confidence')}
                    iconName={sortBy === 'confidence' && sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                    iconPosition="right"
                  >
                    Confidence
                  </Button>
                </div>
              </div>
            </div>

            {sortedFindings?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No findings match your filters
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {sortedFindings?.map((finding) => (
                  <FindingRow
                    key={finding?.id}
                    finding={finding}
                    onViewDetails={handleViewDetails}
                    onDismiss={handleDismissFinding}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {showAIExplanation && selectedFinding && (
        <AIExplanationOverlay
          vulnerability={selectedFinding}
          onClose={() => {
            setShowAIExplanation(false);
            setSelectedFinding(null);
          }}
        />
      )}
    </div>
  );
};

export default ScanResults;
