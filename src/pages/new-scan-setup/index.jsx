import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/navigation/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UploadSection from './components/UploadSection';
import ProjectValidation from './components/ProjectValidation';
import ScannerSelection from './components/ScannerSelection';
import AdvancedOptions from './components/AdvancedOptions';
import ScanSummary from './components/ScanSummary';

const NewScanSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [configuration, setConfiguration] = useState({
    sourceType: null,
    file: null,
    repository: null,
    selectedScanners: ['semgrep', 'gitleaks', 'dependency'],
    advancedOptions: {
      pathExclusions: '**/node_modules/**, **/test/**, **/*.min.js',
      scanTimeout: 30,
      owaspCategories: ['a01', 'a02', 'a03', 'a05', 'a06', 'a07'],
      verboseLogging: false
    },
    validationData: null
  });

  const steps = [
    { id: 1, label: 'Upload', icon: 'Upload' },
    { id: 2, label: 'Configure', icon: 'Settings' },
    { id: 3, label: 'Review', icon: 'FileSearch' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleFileSelect = (file) => {
    setConfiguration(prev => ({
      ...prev,
      sourceType: 'file',
      file: file,
      repository: null
    }));

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateValidation();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRepositorySubmit = (repoData) => {
    setConfiguration(prev => ({
      ...prev,
      sourceType: 'github',
      repository: repoData,
      file: null
    }));

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      simulateValidation();
    }, 2000);
  };

  const simulateValidation = () => {
    const mockValidation = {
      isValid: true,
      languages: ['JavaScript', 'Python', 'TypeScript', 'CSS'],
      fileCount: 1247,
      totalSize: 45678912,
      errors: [],
      warnings: [
        {
          title: 'Large Project Detected',
          message: 'This project contains over 1000 files. Scan may take longer than usual.'
        }
      ]
    };

    setConfiguration(prev => ({
      ...prev,
      validationData: mockValidation,
      fileCount: mockValidation?.fileCount
    }));
  };

  const handleScannerToggle = (scannerId) => {
    setConfiguration(prev => ({
      ...prev,
      selectedScanners: prev?.selectedScanners?.includes(scannerId)
        ? prev?.selectedScanners?.filter(id => id !== scannerId)
        : [...prev?.selectedScanners, scannerId]
    }));
  };

  const handleAdvancedOptionsChange = (options) => {
    setConfiguration(prev => ({
      ...prev,
      advancedOptions: options
    }));
  };

  const handleStartScan = () => {
    const scanData = {
      id: `scan_${Date.now()}`,
      timestamp: new Date()?.toISOString(),
      configuration: configuration,
      status: 'running',
      progress: 0
    };

    localStorage.setItem('activeScan', JSON.stringify(scanData));
    navigate('/scan-progress');
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return configuration?.validationData?.isValid;
    }
    if (currentStep === 2) {
      return configuration?.selectedScanners?.length > 0;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <UploadSection
              onFileSelect={handleFileSelect}
              onRepositorySubmit={handleRepositorySubmit}
              uploadProgress={uploadProgress}
            />
            {configuration?.validationData && (
              <ProjectValidation validationData={configuration?.validationData} />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <ScannerSelection
              selectedScanners={configuration?.selectedScanners}
              onScannerToggle={handleScannerToggle}
            />
            <AdvancedOptions
              options={configuration?.advancedOptions}
              onOptionsChange={handleAdvancedOptionsChange}
            />
          </div>
        );

      case 3:
        return (
          <ScanSummary
            configuration={{
              ...configuration,
              ...configuration?.advancedOptions
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8 md:mb-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-4"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Plus" size={28} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                  New Security Scan
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Configure and initiate comprehensive security analysis
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between">
              {steps?.map((step, index) => (
                <React.Fragment key={step?.id}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`
                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                        transition-smooth
                        ${currentStep >= step?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      {currentStep > step?.id ? (
                        <Icon name="Check" size={20} />
                      ) : (
                        <Icon name={step?.icon} size={20} />
                      )}
                    </div>
                    <span
                      className={`
                        text-xs md:text-sm font-medium transition-smooth
                        ${currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'}
                      `}
                    >
                      {step?.label}
                    </span>
                  </div>
                  {index < steps?.length - 1 && (
                    <div
                      className={`
                        flex-1 h-0.5 mx-2 transition-smooth
                        ${currentStep > step?.id ? 'bg-primary' : 'bg-border'}
                      `}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mb-8">
            {renderStepContent()}
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                iconName="ChevronLeft"
                iconPosition="left"
                className="order-2 md:order-1"
              >
                Previous
              </Button>
            )}

            <div className="flex-1 order-1 md:order-2" />

            {currentStep < 3 ? (
              <Button
                variant="default"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceedToNextStep()}
                iconName="ChevronRight"
                iconPosition="right"
                className="order-1 md:order-3"
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleStartScan}
                disabled={!canProceedToNextStep()}
                iconName="Play"
                iconPosition="left"
                className="order-1 md:order-3"
              >
                Start Security Scan
              </Button>
            )}
          </div>

          {isProcessing && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1040] flex items-center justify-center">
              <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-4 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Loader" size={32} color="var(--color-primary)" className="animate-spin" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  Processing Repository
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fetching and validating your project...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewScanSetup;