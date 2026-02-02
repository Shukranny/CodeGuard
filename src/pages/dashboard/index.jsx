import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/navigation/Header';
import QuickActionsPanel from '../../components/navigation/QuickActionsPanel';
import MetricsCard from './components/MetricsCard';
import RecentScanCard from './components/RecentScanCard';
import RiskDistributionChart from './components/RiskDistributionChart';
import TrendAnalysisChart from './components/TrendAnalysisChart';
import TopRiskyFileCard from './components/TopRiskyFileCard';
import ComplianceStatusCard from './components/ComplianceStatusCard';
import RecentAIExplanationCard from './components/RecentAIExplanationCard';
import ActiveScanProgress from './components/ActiveScanProgress';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [activeScan, setActiveScan] = useState(null);

  const metricsData = [
    {
      title: 'Total Vulnerabilities',
      value: '1,247',
      change: '+12%',
      changeType: 'negative',
      icon: 'AlertTriangle',
      iconColor: 'var(--color-error)',
      trend: 'vs. last 7 days'
    },
    {
      title: 'Critical Issues',
      value: '23',
      change: '-8%',
      changeType: 'positive',
      icon: 'ShieldAlert',
      iconColor: 'var(--color-error)',
      trend: 'Requires immediate action'
    },
    {
      title: 'Projects Scanned',
      value: '156',
      change: '+5%',
      changeType: 'positive',
      icon: 'FolderGit2',
      iconColor: 'var(--color-primary)',
      trend: 'Active projects monitored'
    },
    {
      title: 'Average Risk Score',
      value: '62',
      change: '-3%',
      changeType: 'positive',
      icon: 'TrendingDown',
      iconColor: 'var(--color-success)',
      trend: 'Overall security improving'
    }
  ];

  const recentScans = [
    {
      id: 'scan-001',
      projectName: 'E-Commerce Platform API',
      timestamp: '2026-01-20T11:45:00',
      scanType: 'Full Security Scan',
      riskScore: 78,
      findings: {
        critical: 5,
        high: 12,
        medium: 23,
        low: 45,
        total: 85
      },
      filesScanned: 342
    },
    {
      id: 'scan-002',
      projectName: 'Payment Gateway Service',
      timestamp: '2026-01-20T09:30:00',
      scanType: 'Dependency Scan',
      riskScore: 92,
      findings: {
        critical: 8,
        high: 15,
        medium: 18,
        low: 12,
        total: 53
      },
      filesScanned: 156
    },
    {
      id: 'scan-003',
      projectName: 'User Authentication Module',
      timestamp: '2026-01-19T16:20:00',
      scanType: 'Secret Detection',
      riskScore: 45,
      findings: {
        critical: 2,
        high: 5,
        medium: 8,
        low: 15,
        total: 30
      },
      filesScanned: 89
    },
    {
      id: 'scan-004',
      projectName: 'Mobile App Backend',
      timestamp: '2026-01-19T14:10:00',
      scanType: 'Full Security Scan',
      riskScore: 67,
      findings: {
        critical: 4,
        high: 9,
        medium: 15,
        low: 28,
        total: 56
      },
      filesScanned: 234
    }
  ];

  const riskDistribution = {
    critical: 23,
    high: 67,
    medium: 145,
    low: 312,
    info: 700
  };

  const trendData = [
    { date: 'Jan 14', critical: 28, high: 72, medium: 158, total: 1305 },
    { date: 'Jan 15', critical: 26, high: 69, medium: 152, total: 1289 },
    { date: 'Jan 16', critical: 25, high: 71, medium: 149, total: 1276 },
    { date: 'Jan 17', critical: 24, high: 68, medium: 147, total: 1265 },
    { date: 'Jan 18', critical: 23, high: 67, medium: 145, total: 1247 },
    { date: 'Jan 19', critical: 23, high: 66, medium: 143, total: 1238 },
    { date: 'Jan 20', critical: 23, high: 67, medium: 145, total: 1247 }
  ];

  const topRiskyFiles = [
    {
      name: 'auth.controller.js',
      path: 'src/api/controllers/auth.controller.js',
      severity: 'critical',
      vulnerabilities: 8,
      riskScore: 95
    },
    {
      name: 'payment.service.js',
      path: 'src/services/payment.service.js',
      severity: 'critical',
      vulnerabilities: 6,
      riskScore: 89
    },
    {
      name: 'database.config.js',
      path: 'config/database.config.js',
      severity: 'high',
      vulnerabilities: 5,
      riskScore: 78
    },
    {
      name: 'user.model.js',
      path: 'src/models/user.model.js',
      severity: 'high',
      vulnerabilities: 4,
      riskScore: 72
    },
    {
      name: 'api.routes.js',
      path: 'src/routes/api.routes.js',
      severity: 'medium',
      vulnerabilities: 7,
      riskScore: 65
    }
  ];

  const complianceData = {
    standard: 'OWASP Top 10 2021',
    coverage: 87,
    status: 'partial',
    categories: [
      { name: 'A01: Broken Access Control', covered: true, findings: 12 },
      { name: 'A02: Cryptographic Failures', covered: true, findings: 8 },
      { name: 'A03: Injection', covered: true, findings: 15 },
      { name: 'A04: Insecure Design', covered: false, findings: 0 },
      { name: 'A05: Security Misconfiguration', covered: true, findings: 23 },
      { name: 'A06: Vulnerable Components', covered: true, findings: 45 }
    ]
  };

  const recentAIExplanations = [
    {
      title: 'SQL Injection in User Query',
      description: 'Unsanitized user input directly concatenated into SQL query allowing potential database compromise through malicious input injection.',
      severity: 'critical',
      cweId: '89',
      accessedAt: '2026-01-20T11:30:00',
      file: 'src/api/users.js',
      line: 42
    },
    {
      title: 'Hardcoded API Credentials',
      description: 'Production API keys and secrets found hardcoded in source code, exposing sensitive authentication credentials to unauthorized access.',
      severity: 'critical',
      cweId: '798',
      accessedAt: '2026-01-20T10:15:00',
      file: 'config/api.config.js',
      line: 18
    },
    {
      title: 'Insecure JWT Implementation',
      description: 'JWT tokens generated without proper signature validation and using weak encryption algorithms, allowing token forgery attacks.',
      severity: 'high',
      cweId: '347',
      accessedAt: '2026-01-20T09:45:00',
      file: 'src/auth/jwt.service.js',
      line: 67
    }
  ];

  useEffect(() => {
    const mockActiveScan = {
      id: 'scan-active-001',
      projectName: 'Customer Portal Frontend',
      phase: 'Analyzing Dependencies',
      progress: 67,
      filesScanned: 234,
      findings: 18,
      elapsed: '2m 34s'
    };
    setActiveScan(mockActiveScan);
    localStorage.setItem('activeScan', JSON.stringify(mockActiveScan));
  }, []);

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Security Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Comprehensive overview of your security posture and recent scan results
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
                {timeRangeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setTimeRange(option?.value)}
                    className={`
                      px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-smooth
                      ${timeRange === option?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.location?.reload()}
                className="hidden md:flex"
              >
                <Icon name="RefreshCw" size={20} />
              </Button>
            </div>
          </div>

          {activeScan && (
            <div className="mb-6 md:mb-8">
              <ActiveScanProgress scan={activeScan} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                    Recent Scans
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                    onClick={() => navigate('/scan-results')}
                  >
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {recentScans?.slice(0, 3)?.map((scan) => (
                    <RecentScanCard key={scan?.id} scan={scan} />
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4 md:mb-6">
                  Vulnerability Trends
                </h2>
                <TrendAnalysisChart data={trendData} />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4 md:mb-6">
                  Risk Distribution
                </h2>
                <RiskDistributionChart data={riskDistribution} />
              </div>

              <ComplianceStatusCard {...complianceData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="bg-card border border-border rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Top Risky Files
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="FileSearch"
                  iconPosition="right"
                  onClick={() => navigate('/file-tree-explorer')}
                >
                  Explore
                </Button>
              </div>
              <div className="space-y-3 md:space-y-4">
                {topRiskyFiles?.map((file, index) => (
                  <TopRiskyFileCard key={index} file={file} />
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Recent AI Explanations
                </h2>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Sparkles" size={18} color="var(--color-secondary)" className="md:w-5 md:h-5" />
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                {recentAIExplanations?.map((explanation, index) => (
                  <RecentAIExplanationCard key={index} explanation={explanation} />
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <QuickActionsPanel context="dashboard" />
          </div>
        </div>
      </main>
      <div className="md:hidden">
        <QuickActionsPanel context="dashboard" />
      </div>
    </div>
  );
};

export default Dashboard;