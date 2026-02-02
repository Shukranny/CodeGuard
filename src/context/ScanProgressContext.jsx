import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveScanProgress, loadScanProgress, clearScanProgress } from '../utils/persistenceUtils';

const ScanProgressContext = createContext();

export const useScanProgress = () => {
  const context = useContext(ScanProgressContext);
  if (!context) {
    throw new Error('useScanProgress must be used within ScanProgressProvider');
  }
  return context;
};

export const ScanProgressProvider = ({ children }) => {
  const [scanState, setScanState] = useState(() => {
    // Load persisted state on initialization
    return loadScanProgress();
  });

  const [isScanActive, setIsScanActive] = useState(scanState?.isActive || false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isScanActive) {
      saveScanProgress(scanState);
    }
  }, [scanState, isScanActive]);

  const initiateScan = (projectData) => {
    const newScanState = {
      isActive: true,
      projectData,
      stages: projectData?.stages || [],
      scanners: projectData?.scanners || [],
      currentStage: 0,
      overallProgress: 0,
      scanStartTime: new Date().toISOString(),
      findings: projectData?.findings || null,
      technicalDetails: projectData?.technicalDetails || null,
    };
    setScanState(newScanState);
    setIsScanActive(true);
    saveScanProgress(newScanState);
  };

  const updateScanProgress = (updates) => {
    setScanState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const updateStageProgress = (stageIndex, progress) => {
    setScanState((prev) => {
      const updatedStages = [...(prev.stages || [])];
      if (updatedStages[stageIndex]) {
        updatedStages[stageIndex] = {
          ...updatedStages[stageIndex],
          progress,
        };
      }
      return {
        ...prev,
        stages: updatedStages,
      };
    });
  };

  const updateScannerStatus = (scannerId, updates) => {
    setScanState((prev) => {
      const updatedScanners = [...(prev.scanners || [])];
      const scannerIndex = updatedScanners.findIndex((s) => s.id === scannerId);
      if (scannerIndex !== -1) {
        updatedScanners[scannerIndex] = {
          ...updatedScanners[scannerIndex],
          ...updates,
        };
      }
      return {
        ...prev,
        scanners: updatedScanners,
      };
    });
  };

  const completeScan = () => {
    setIsScanActive(false);
    saveScanProgress({
      ...scanState,
      isActive: false,
      scanEndTime: new Date().toISOString(),
    });
  };

  const resumeScan = () => {
    const persistedState = loadScanProgress();
    if (persistedState && persistedState.isActive) {
      setScanState(persistedState);
      setIsScanActive(true);
    }
  };

  const clearProgress = () => {
    setScanState({
      isActive: false,
      projectData: null,
      stages: [],
      scanners: [],
      currentStage: 0,
      overallProgress: 0,
    });
    setIsScanActive(false);
    clearScanProgress();
  };

  const value = {
    scanState,
    isScanActive,
    initiateScan,
    updateScanProgress,
    updateStageProgress,
    updateScannerStatus,
    completeScan,
    resumeScan,
    clearProgress,
  };

  return (
    <ScanProgressContext.Provider value={value}>
      {children}
    </ScanProgressContext.Provider>
  );
};

export default ScanProgressContext;
