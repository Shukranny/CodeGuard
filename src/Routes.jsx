import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AIExplanationModal from './pages/ai-explanation-modal';
import ScanResults from './pages/scan-results';
import Dashboard from './pages/dashboard';
import FileTreeExplorer from './pages/file-tree-explorer';
import ScanProgress from './pages/scan-progress';
import NewScanSetup from './pages/new-scan-setup';
import Profile from './pages/profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/ai-explanation-modal" element={<AIExplanationModal />} />
        <Route path="/scan-results" element={<ScanResults />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/file-tree-explorer" element={<FileTreeExplorer />} />
        <Route path="/scan-progress" element={<ScanProgress />} />
        <Route path="/new-scan-setup" element={<NewScanSetup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
