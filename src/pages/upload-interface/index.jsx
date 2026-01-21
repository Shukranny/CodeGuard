import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import PrimaryNavigation from 'components/navigation/PrimaryNavigation';
import Header from 'components/navigation/Header';
import Icon from '../../components/AppIcon';
import FileUploadZone from './components/FileUploadZone';
import GitHubRepoInput from './components/GitHubRepoInput';
import RecentScansSection from './components/RecentScansSection';
import UploadMethodTabs from './components/UploadMethodTabs';
import ScanActionButtons from './components/ScanActionButtons';

const UploadInterface = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('zip');
  const [selectedFile, setSelectedFile] = useState(null);
  const [githubRepo, setGithubRepo] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidatingRepo, setIsValidatingRepo] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      simulateFileUpload();
    } else {
      setUploadProgress(0);
    }
  };

  const simulateFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRepoSubmit = (repoUrl) => {
    setIsValidatingRepo(true);
    setGithubRepo(repoUrl);

    setTimeout(() => {
      setIsValidatingRepo(false);
    }, 1500);
  };

  const handleStartScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      navigate('/scan-progress-tracking', {
        state: {
          projectName: activeTab === 'zip' ? selectedFile?.name : githubRepo?.split('/')?.pop(),
          scanType: activeTab,
          startTime: new Date()?.toISOString()
        }
      });
    }, 1000);
  };

  const handleClearAll = () => {
    setSelectedFile(null);
    setGithubRepo('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleViewHistory = () => {
    navigate('/scan-history');
  };

  const handleScanSelect = (scan) => {
    navigate('/vulnerability-dashboard', {
      state: { scanId: scan?.id }
    });
  };

  const canStartScan = activeTab === 'zip' 
    ? selectedFile && uploadProgress === 100 && !isUploading
    : githubRepo && !isValidatingRepo;

  return (
    <div className="min-h-screen bg-background">
      {/* <PrimaryNavigation /> */}
      <Header />

      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Icon name="Shield" size={32} color="var(--color-primary)" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Security Vulnerability Scanner
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your project or connect your GitHub repository to scan for security vulnerabilities with AI-powered remediation recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Method Tabs */}
              <UploadMethodTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />

              {/* Upload Content */}
              <div className="bg-card rounded-lg border border-border p-6 sm:p-8">
                {activeTab === 'zip' ? (
                  <FileUploadZone
                    onFileSelect={handleFileSelect}
                    uploadProgress={uploadProgress}
                    isUploading={isUploading}
                  />
                ) : (
                  <GitHubRepoInput
                    onRepoSubmit={handleRepoSubmit}
                    isValidating={isValidatingRepo}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <ScanActionButtons
                canStartScan={canStartScan}
                isScanning={isScanning}
                onStartScan={handleStartScan}
                onClearAll={handleClearAll}
                onViewHistory={handleViewHistory}
              />

              {/* Features Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Zap" size={16} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Fast Scanning</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Multiple security scanners run in parallel for quick results
                  </p>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Brain" size={16} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">AI-Powered</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get intelligent fix suggestions with detailed explanations
                  </p>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="FileText" size={16} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Detailed Reports</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Export comprehensive reports in PDF or JSON format
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Scans Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                <RecentScansSection onScanSelect={handleScanSelect} />
              </div>
            </div>
          </div>

          {/* Security Scanners Info */}
          <div className="mt-12 bg-muted/30 rounded-lg border border-border p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Shield" size={24} color="var(--color-primary)" />
              Integrated Security Scanners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h3 className="text-sm font-semibold text-foreground">Semgrep</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Static analysis for finding bugs and enforcing code standards across multiple languages
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h3 className="text-sm font-semibold text-foreground">GitLeaks</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Detects hardcoded secrets like passwords, API keys, and tokens in your codebase
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h3 className="text-sm font-semibold text-foreground">OSV.dev</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Identifies known vulnerabilities in open source dependencies and packages
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadInterface;