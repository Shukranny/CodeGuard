import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AIExplanationModal from './pages/ai-explanation-modal';
import VulnerabilityDashboard from './pages/vulnerability-dashboard';
import UploadInterface from './pages/upload-interface';
import ScanProgressTracking from './pages/scan-progress-tracking';
import ScanHistory from './pages/scan-history';


const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<UploadInterface />} />
        <Route path="/ai-explanation-modal" element={<AIExplanationModal />} />
        <Route path="/vulnerability-dashboard" element={<VulnerabilityDashboard />} />
        <Route path="/upload-interface" element={<UploadInterface />} />
        <Route path="/scan-progress-tracking" element={<ScanProgressTracking />} />
        <Route path="/scan-history" element={<ScanHistory />} />
        {/* <Route path="/navigation-side-panel" element={<NavigationSidePanel />} /> */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
