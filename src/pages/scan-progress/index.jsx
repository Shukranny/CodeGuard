import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/navigation/Header';
import ScanProgressIndicator from '../../components/navigation/ScanProgressIndicator';
import ProgressStageIndicator from './components/ProgressStageIndicator';
import PreliminaryFindings from './components/PreliminaryFindings';
import ScanMetadata from './components/ScanMetadata';
import ScanControls from './components/ScanControls';
import ScanLogs from './components/ScanLogs';
import { useScanProgress } from '../../context/ScanProgressContext';
import { saveScanProgress } from '../../utils/persistenceUtils';

const ScanProgress = () => {
  const navigate = useNavigate();
  const { scanState, updateScanProgress, updateStageProgress, completeScan } = useScanProgress();
  const [currentStage, setCurrentStage] = useState(scanState?.currentStage || 0);
  const [overallProgress, setOverallProgress] = useState(scanState?.overallProgress || 0);
  const [scanComplete, setScanComplete] = useState(false);

  const [stages, setStages] = useState(() => {
    return scanState?.stages || [
      {
        id: 'init',
        name: 'Initialization',
        description: 'Setting up scan environment and validating project structure',
        icon: 'Settings',
        progress: 100,
        filesProcessed: 0,
        rulesExecuted: 0,
        duration: '12s'
      },
      {
        id: 'analysis',
        name: 'File Analysis',
        description: 'Analyzing project files and detecting programming languages',
        icon: 'FileSearch',
        progress: 75,
        filesProcessed: 342,
        rulesExecuted: 1250,
        duration: null
      },
      {
        id: 'dependencies',
        name: 'Dependency Resolution',
        description: 'Scanning package manifests and checking for known vulnerabilities',
        icon: 'Package',
        progress: 0,
        filesProcessed: 0,
        rulesExecuted: 0,
        duration: null
      },
      {
        id: 'static',
        name: 'Static Code Analysis',
        description: 'Running Semgrep rules to detect security vulnerabilities',
        icon: 'Code',
        progress: 0,
        filesProcessed: 0,
        rulesExecuted: 0,
        duration: null
      },
      {
        id: 'secrets',
        name: 'Secret Detection',
        description: 'Scanning for exposed credentials and sensitive information',
        icon: 'Key',
        progress: 0,
        filesProcessed: 0,
        rulesExecuted: 0,
        duration: null
      },
      {
        id: 'report',
        name: 'Report Generation',
        description: 'Compiling findings and generating comprehensive security report',
        icon: 'FileText',
        progress: 0,
        filesProcessed: 0,
        rulesExecuted: 0,
        duration: null
      }
    ];
  });

  const [findings, setFindings] = useState({
    summary: [
      {
        type: 'Critical Vulnerabilities',
        count: 3,
        severity: 'critical',
        icon: 'AlertTriangle'
      },
      {
        type: 'Secrets Detected',
        count: 7,
        severity: 'high',
        icon: 'Key'
      },
      {
        type: 'Dependency Issues',
        count: 12,
        severity: 'medium',
        icon: 'Package'
      }
    ],
    recent: [
      {
        id: 1,
        title: 'SQL Injection Vulnerability',
        description: 'Unsanitized user input directly concatenated into SQL query allowing potential database compromise',
        severity: 'critical',
        icon: 'Database',
        file: 'src/api/users.js',
        line: 42
      },
      {
        id: 2,
        title: 'Hardcoded AWS Access Key',
        description: 'AWS secret access key found in configuration file exposing cloud infrastructure to unauthorized access',
        severity: 'critical',
        icon: 'Key',
        file: 'config/aws.js',
        line: 15
      },
      {
        id: 3,
        title: 'Outdated Express.js Version',
        description: 'Using Express.js 4.16.0 with known security vulnerabilities including prototype pollution',
        severity: 'high',
        icon: 'Package',
        file: 'package.json',
        line: 23
      },
      {
        id: 4,
        title: 'Cross-Site Scripting (XSS)',
        description: 'User-controlled data rendered without proper sanitization allowing script injection attacks',
        severity: 'high',
        icon: 'Code',
        file: 'src/components/UserProfile.jsx',
        line: 87
      }
    ]
  });

  const [metadata, setMetadata] = useState({
    scanId: 'scan_2026_01_20_a7f3c9d2',
    startTime: new Date('2026-01-20T12:15:00'),
    elapsedTime: 145,
    estimatedCompletion: 320,
    sourceType: 'github',
    projectSize: 15728640,
    filesAnalyzed: 342,
    totalFiles: 456,
    languages: ['JavaScript', 'Python', 'TypeScript', 'CSS'],
    resources: {
      cpu: 67,
      memory: 42
    }
  });

  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: new Date('2026-01-20T12:15:05'),
      level: 'info',
      message: 'Scan initialized successfully for repository: user/secure-app'
    },
    {
      id: 2,
      timestamp: new Date('2026-01-20T12:15:12'),
      level: 'success',
      message: 'Project validation completed - 456 files detected'
    },
    {
      id: 3,
      timestamp: new Date('2026-01-20T12:15:18'),
      level: 'info',
      message: 'Language detection: JavaScript (65%), Python (20%), TypeScript (10%), CSS (5%)'
    },
    {
      id: 4,
      timestamp: new Date('2026-01-20T12:15:25'),
      level: 'info',
      message: 'Loading Semgrep rules: OWASP Top 10, CWE Top 25'
    },
    {
      id: 5,
      timestamp: new Date('2026-01-20T12:15:42'),
      level: 'warning',
      message: 'Found potential SQL injection in src/api/users.js:42'
    },
    {
      id: 6,
      timestamp: new Date('2026-01-20T12:15:58'),
      level: 'error',
      message: 'Critical: Hardcoded AWS credentials detected in config/aws.js:15'
    },
    {
      id: 7,
      timestamp: new Date('2026-01-20T12:16:15'),
      level: 'warning',
      message: 'Outdated dependency: express@4.16.0 has known vulnerabilities'
    },
    {
      id: 8,
      timestamp: new Date('2026-01-20T12:16:32'),
      level: 'info',
      message: 'Analyzing file: src/components/UserProfile.jsx'
    },
    {
      id: 9,
      timestamp: new Date('2026-01-20T12:16:45'),
      level: 'warning',
      message: 'XSS vulnerability detected in src/components/UserProfile.jsx:87'
    },
    {
      id: 10,
      timestamp: new Date('2026-01-20T12:17:02'),
      level: 'info',
      message: 'Processing dependencies from package.json'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStages(prevStages => {
        const newStages = [...prevStages];
        const activeStage = newStages?.[currentStage];

        if (activeStage && activeStage?.progress < 100) {
          activeStage.progress = Math.min(activeStage?.progress + Math.random() * 15, 100);
          activeStage.filesProcessed = Math.floor((activeStage?.progress / 100) * 456);
          activeStage.rulesExecuted = Math.floor((activeStage?.progress / 100) * 2500);

          if (activeStage?.progress >= 100) {
            activeStage.duration = `${Math.floor(Math.random() * 30 + 10)}s`;
            if (currentStage < newStages?.length - 1) {
              setCurrentStage(currentStage + 1);
            } else {
              setScanComplete(true);
            }
          }
        }

        const totalProgress = newStages?.reduce((sum, stage) => sum + stage?.progress, 0) / newStages?.length;
        setOverallProgress(totalProgress);

        // Persist progress state
        updateScanProgress({
          stages: newStages,
          currentStage,
          overallProgress: totalProgress,
        });

        return newStages;
      });

      setMetadata(prev => ({
        ...prev,
        elapsedTime: prev?.elapsedTime + 1,
        estimatedCompletion: Math.max(prev?.estimatedCompletion - 1, 0),
        resources: {
          cpu: Math.min(Math.max(prev?.resources?.cpu + (Math.random() - 0.5) * 10, 40), 85),
          memory: Math.min(Math.max(prev?.resources?.memory + (Math.random() - 0.5) * 5, 30), 60)
        }
      }));

      if (Math.random() > 0.7) {
        const newLog = {
          id: logs?.length + 1,
          timestamp: new Date(),
          level: ['info', 'warning', 'success']?.[Math.floor(Math.random() * 3)],
          message: [
            'Analyzing file: src/utils/validation.js',
            'Checking dependencies for vulnerabilities',
            'Running security rules on authentication module',
            'Scanning for exposed secrets in configuration files'
          ]?.[Math.floor(Math.random() * 4)]
        };
        setLogs(prev => [...prev, newLog]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentStage, logs?.length, updateScanProgress]);

  useEffect(() => {
    if (scanComplete) {
      completeScan();
      setTimeout(() => {
        navigate('/scan-results');
      }, 2000);
    }
  }, [scanComplete, navigate, completeScan]);

  const handleCancel = () => {
    console.log('Scan cancelled');
  };

  const handlePriorityChange = (priority) => {
    console.log('Priority changed to:', priority);
  };

  const handleScanComplete = () => {
    setScanComplete(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Security Scan in Progress
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Real-time monitoring of active security analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
              <ProgressStageIndicator 
                stages={stages}
                currentStage={currentStage}
                overallProgress={overallProgress}
              />

              <PreliminaryFindings findings={findings} />

              <ScanLogs logs={logs} />
            </div>

            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <ScanMetadata metadata={metadata} />

              <ScanControls 
                scanId={metadata?.scanId}
                onCancel={handleCancel}
                onPriorityChange={handlePriorityChange}
              />
            </div>
          </div>
        </div>
      </main>
      <ScanProgressIndicator 
        scanId={metadata?.scanId}
        onComplete={handleScanComplete}
      />
    </div>
  );
};

export default ScanProgress;
