import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const mockScanData = {
    scanId: 'scan_20260120_001',
    projectName: 'SecureWebApp',
    scanDate: '2026-01-20T12:15:00Z',
    duration: '4m 32s',
    overallRiskScore: 78,
    riskTrend: 5,
    stats: {
      totalFindings: 47,
      critical: 8,
      high: 15,
      medium: 18,
      low: 6,
      filesScanned: 342,
      duration: '4m 32s'
    },
    severityDistribution: {
      critical: 8,
      high: 15,
      medium: 18,
      low: 6
    },
    topRiskyFiles: [
      {
        path: 'src/api/authentication.js',
        vulnerabilities: 5,
        riskScore: 92,
        highestSeverity: 'critical'
      },
      {
        path: 'src/database/queries.py',
        vulnerabilities: 4,
        riskScore: 88,
        highestSeverity: 'critical'
      },
      {
        path: 'src/utils/encryption.js',
        vulnerabilities: 3,
        riskScore: 75,
        highestSeverity: 'high'
      },
      {
        path: 'config/security.yaml',
        vulnerabilities: 3,
        riskScore: 71,
        highestSeverity: 'high'
      }
    ],
    findings: [
      {
        id: 'finding_001',
        title: 'SQL Injection Vulnerability in User Authentication',
        severity: 'critical',
        confidence: 95,
        scanner: 'Semgrep',
        file: 'src/api/authentication.js',
        line: 42,
        language: 'javascript',
        owasp: 'A03:2021',
        cwe: 'CWE-89',
        description: 'User input is directly concatenated into SQL query without parameterization, allowing attackers to inject malicious SQL commands and potentially compromise the entire database.',
        codeSnippet: `const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
db.execute(query);`,
        remediation: 'Use parameterized queries or prepared statements to prevent SQL injection. Implement input validation and sanitization as defense-in-depth measures.'
      },
      {
        id: 'finding_002',
        title: 'Hardcoded AWS Secret Access Key Detected',
        severity: 'critical',
        confidence: 98,
        scanner: 'GitLeaks',
        file: 'config/aws-config.js',
        line: 15,
        language: 'javascript',
        owasp: 'A02:2021',
        cwe: 'CWE-798',
        description: 'AWS secret access key is hardcoded in source code, providing full access to AWS resources if the repository is compromised. This violates security best practices and compliance requirements.',
        codeSnippet: `const awsConfig = {
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  region: 'us-east-1'
};`,
        remediation: 'Remove hardcoded credentials immediately. Use AWS IAM roles, environment variables, or secure secret management services like AWS Secrets Manager or HashiCorp Vault.'
      },
      {
        id: 'finding_003',
        title: 'Cross-Site Scripting (XSS) in User Profile Display',
        severity: 'high',
        confidence: 92,
        scanner: 'Semgrep',
        file: 'src/components/UserProfile.jsx',
        line: 78,
        language: 'javascript',
        owasp: 'A03:2021',
        cwe: 'CWE-79',
        description: 'User-controlled data is rendered without proper sanitization, allowing attackers to inject malicious scripts that execute in victims browsers, potentially stealing session tokens or performing unauthorized actions.',
        codeSnippet: `<div dangerouslySetInnerHTML={{ __html: userBio }} />`,
        remediation: 'Use React\'s default JSX rendering which automatically escapes content. If HTML rendering is required, use a sanitization library like DOMPurify to remove malicious content.'
      },
      {
        id: 'finding_004',
        title: 'Insecure Cryptographic Algorithm (MD5) Usage',
        severity: 'high',
        confidence: 88,
        scanner: 'Semgrep',
        file: 'src/utils/encryption.js',
        line: 23,
        language: 'javascript',
        owasp: 'A02:2021',
        cwe: 'CWE-327',
        description: 'MD5 hashing algorithm is cryptographically broken and should not be used for security purposes. Attackers can easily generate collisions and reverse MD5 hashes using rainbow tables.',
        codeSnippet: `const hash = crypto.createHash('md5').update(password).digest('hex');`,
        remediation: 'Replace MD5 with modern, secure hashing algorithms like bcrypt, Argon2, or scrypt for password hashing. Use SHA-256 or SHA-3 for general-purpose hashing.'
      },
      {
        id: 'finding_005',
        title: 'Vulnerable Dependency: lodash 4.17.15',
        severity: 'high',
        confidence: 100,
        scanner: 'OSV.dev',
        file: 'package.json',
        line: 28,
        language: 'javascript',
        owasp: 'A06:2021',
        cwe: 'CWE-1104',
        description: 'The lodash library version 4.17.15 contains prototype pollution vulnerabilities (CVE-2020-8203) that allow attackers to modify object prototypes and potentially execute arbitrary code.',
        codeSnippet: `"lodash": "4.17.15"`,
        remediation: 'Update lodash to version 4.17.21 or later which patches the prototype pollution vulnerability. Run npm audit fix to automatically update vulnerable dependencies.'
      },
      {
        id: 'finding_006',
        title: 'Missing Authentication on Admin API Endpoint',
        severity: 'critical',
        confidence: 90,
        scanner: 'Semgrep',
        file: 'src/api/admin.js',
        line: 56,
        language: 'javascript',
        owasp: 'A01:2021',
        cwe: 'CWE-306',
        description: 'Administrative endpoint lacks authentication middleware, allowing any user to access privileged operations including user management, system configuration, and data deletion.',
        codeSnippet: `router.post('/admin/delete-user', async (req, res) => {
  await User.deleteOne({ id: req.body.userId });
  res.json({ success: true });
});`,
        remediation: 'Implement authentication middleware to verify user identity and authorization checks to ensure only administrators can access privileged endpoints.'
      },
      {
        id: 'finding_007',
        title: 'Path Traversal Vulnerability in File Upload',
        severity: 'high',
        confidence: 94,
        scanner: 'Semgrep',
        file: 'src/api/upload.js',
        line: 34,
        language: 'javascript',
        owasp: 'A01:2021',
        cwe: 'CWE-22',
        description: 'User-supplied filename is used directly in file system operations without validation, allowing attackers to write files outside the intended directory using path traversal sequences like ../../../etc/passwd.',
        codeSnippet: `const filePath = path.join(uploadDir, req.body.filename);
fs.writeFileSync(filePath, fileData);`,
        remediation: 'Validate and sanitize filenames by removing path traversal sequences. Use path.basename() to extract only the filename component and generate random filenames server-side.'
      },
      {
        id: 'finding_008',
        title: 'Insecure Direct Object Reference in User Data Access',
        severity: 'medium',
        confidence: 85,
        scanner: 'Semgrep',
        file: 'src/api/users.js',
        line: 67,
        language: 'javascript',
        owasp: 'A01:2021',
        cwe: 'CWE-639',
        description: 'User ID from request parameters is used directly to fetch user data without verifying the requesting user has permission to access that data, allowing horizontal privilege escalation.',
        codeSnippet: `const userData = await User.findById(req.params.userId);
res.json(userData);`,
        remediation: 'Implement authorization checks to verify the authenticated user has permission to access the requested resource. Compare session user ID with requested user ID.'
      },
      {
        id: 'finding_009',
        title: 'Weak Session Cookie Configuration',
        severity: 'medium',
        confidence: 91,
        scanner: 'Semgrep',
        file: 'src/middleware/session.js',
        line: 19,
        language: 'javascript',
        owasp: 'A07:2021',
        cwe: 'CWE-614',
        description: 'Session cookies are configured without Secure and HttpOnly flags, making them vulnerable to interception over unencrypted connections and accessible to client-side JavaScript, increasing XSS attack impact.',
        codeSnippet: `res.cookie('sessionId', sessionToken, {
  maxAge: 3600000
});`,
        remediation: 'Configure session cookies with secure: true, httpOnly: true, and sameSite: "strict" flags to prevent interception and XSS-based theft.'
      },
      {
        id: 'finding_010',
        title: 'Insufficient Rate Limiting on Login Endpoint',
        severity: 'medium',
        confidence: 87,
        scanner: 'Semgrep',
        file: 'src/api/authentication.js',
        line: 89,
        language: 'javascript',
        owasp: 'A07:2021',
        cwe: 'CWE-307',
        description: 'Login endpoint lacks rate limiting controls, allowing attackers to perform unlimited brute-force attacks to guess user credentials without detection or prevention.',
        codeSnippet: `router.post('/login', async (req, res) => {
  const user = await authenticateUser(req.body.username, req.body.password);
  if (user) res.json({ token: generateToken(user) });
});`,
        remediation: 'Implement rate limiting middleware to restrict login attempts per IP address and per username. Consider implementing account lockout after multiple failed attempts and CAPTCHA challenges.'
      }
    ]
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

  const filteredFindings = mockScanData?.findings?.filter(finding => {
    if (filters?.severity !== 'all' && finding?.severity !== filters?.severity) return false;
    if (filters?.scanner !== 'all' && finding?.scanner?.toLowerCase() !== filters?.scanner) return false;
    if (filters?.language !== 'all' && finding?.language !== filters?.language) return false;
    if (filters?.owaspCategories?.length > 0 && !filters?.owaspCategories?.some(cat => finding?.owasp?.includes(cat?.split(':')?.[0]))) return false;
    if (searchQuery && !finding?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && !finding?.file?.toLowerCase()?.includes(searchQuery?.toLowerCase())) return false;
    return true;
  });

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
                    {mockScanData?.projectName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="Calendar" size={16} />
                    {new Date(mockScanData.scanDate)?.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span>•</span>
                  <span className="font-data">{mockScanData?.scanId}</span>
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

            <ScanSummaryStats stats={mockScanData?.stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <RiskScoreCard 
              score={mockScanData?.overallRiskScore} 
              trend={mockScanData?.riskTrend}
              label="Overall Risk Score"
            />
            <div className="lg:col-span-2">
              <SeverityDistributionChart data={mockScanData?.severityDistribution} />
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
            <TopRiskyFiles files={mockScanData?.topRiskyFiles} />
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