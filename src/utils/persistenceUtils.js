/**
 * Persistence utilities for managing scan progress state
 * Handles localStorage operations for persisting scan data
 */

const STORAGE_KEY = 'codeguard_scan_progress';
const STORAGE_EXPIRY_KEY = 'codeguard_scan_progress_expiry';
const STORAGE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Save scan progress to localStorage
 * @param {Object} scanState - The scan state object to persist
 */
export const saveScanProgress = (scanState) => {
  try {
    const dataToSave = {
      ...scanState,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    // Set expiry time
    localStorage.setItem(
      STORAGE_EXPIRY_KEY,
      new Date(Date.now() + STORAGE_EXPIRY_TIME).toISOString()
    );
  } catch (error) {
    console.error('Failed to save scan progress:', error);
  }
};

/**
 * Load scan progress from localStorage
 * @returns {Object|null} - The saved scan state or null if not found/expired
 */
export const loadScanProgress = () => {
  try {
    // Check if data has expired
    const expiryTime = localStorage.getItem(STORAGE_EXPIRY_KEY);
    if (expiryTime && new Date() > new Date(expiryTime)) {
      clearScanProgress();
      return null;
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error('Failed to load scan progress:', error);
    return null;
  }
};

/**
 * Clear scan progress from localStorage
 */
export const clearScanProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear scan progress:', error);
  }
};

/**
 * Check if there's an active scan in progress
 * @returns {boolean} - True if there's an active scan
 */
export const hasActiveScan = () => {
  const scanState = loadScanProgress();
  return scanState?.isActive === true;
};

/**
 * Get the last saved scan timestamp
 * @returns {string|null} - ISO string of last update or null
 */
export const getLastScanUpdate = () => {
  const scanState = loadScanProgress();
  return scanState?.lastUpdated || null;
};

/**
 * Export scan progress data
 * @returns {Object|null} - Full scan state data
 */
export const exportScanProgress = () => {
  return loadScanProgress();
};

/**
 * Import scan progress data
 * @param {Object} scanData - The scan data to import
 */
export const importScanProgress = (scanData) => {
  if (scanData && typeof scanData === 'object') {
    saveScanProgress(scanData);
  }
};
