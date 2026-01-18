// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
// import Button from '../../components/ui/Button';
// import Icon from '../../components/AppIcon';
// import NavigationMenu from './components/NavigationMenu';
// import QuickActions from './components/QuickActions';
// import ProjectSwitcher from './components/ProjectSwitcher';
// import FileExplorer from './components/FileExplorer';
// import UserProfile from './components/UserProfile';
// import FilterShortcuts from './components/FilterShortcuts';

// const NavigationSidePanel = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isPanelOpen, setIsPanelOpen] = useState(true);
//   const [selectedProject, setSelectedProject] = useState('codeguard-scanner');
//   const [isFileExplorerExpanded, setIsFileExplorerExpanded] = useState(true);
//   const panelRef = useRef(null);
//   const previousFocusRef = useRef(null);

//   // Handle keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Toggle panel with Ctrl/Cmd + B
//       if ((e?.ctrlKey || e?.metaKey) && e?.key === 'b') {
//         e?.preventDefault();
//         setIsPanelOpen(prev => !prev);
//       }
//       // Close panel with Escape
//       if (e?.key === 'Escape' && isPanelOpen) {
//         setIsPanelOpen(false);
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [isPanelOpen]);

//   // Handle body overflow when panel is open on mobile
//   useEffect(() => {
//     if (isPanelOpen && window.innerWidth < 1024) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isPanelOpen]);

//   // Focus management
//   useEffect(() => {
//     if (isPanelOpen) {
//       previousFocusRef.current = document.activeElement;
//       panelRef?.current?.focus();
//     } else {
//       previousFocusRef?.current?.focus();
//     }
//   }, [isPanelOpen]);

//   const handleProjectSwitch = (projectId) => {
//     setSelectedProject(projectId);
//   };

//   const handleQuickAction = (action) => {
//     switch (action) {
//       case 'new-scan': navigate('/upload-interface');
//         break;
//       case 'recent-projects': navigate('/scan-history');
//         break;
//       case 'scan-history': navigate('/scan-history');
//         break;
//       default:
//         break;
//     }
//   };

//   const handleFilterSelect = (filter) => {
//     navigate('/vulnerability-dashboard', { state: { filter } });
//   };

//   const handleBackdropClick = (e) => {
//     if (e?.target === e?.currentTarget) {
//       setIsPanelOpen(false);
//     }
//   };

//   return (
//     <>
//       <PrimaryNavigation />
      
//       <div className="main-content">
//         {/* Toggle Button */}
//         <button
//           onClick={() => setIsPanelOpen(!isPanelOpen)}
//           className="fixed top-20 left-4 z-[90] p-2 rounded-md bg-card border border-border shadow-elevation-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors lg:hidden"
//           aria-label={isPanelOpen ? 'Close navigation panel' : 'Open navigation panel'}
//           aria-expanded={isPanelOpen}
//         >
//           <Icon name={isPanelOpen ? 'X' : 'Menu'} size={20} />
//         </button>

//         {/* Mobile Backdrop */}
//         {isPanelOpen && (
//           <div
//             className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
//             onClick={handleBackdropClick}
//             aria-hidden="true"
//           />
//         )}

//         {/* Side Panel */}
//         <aside
//           ref={panelRef}
//           className={`
//             fixed top-16 left-0 bottom-0 z-[85] w-80 bg-card border-r border-border shadow-elevation-3
//             overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out
//             lg:translate-x-0
//             ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}
//           `}
//           role="complementary"
//           aria-label="Navigation side panel"
//           tabIndex={-1}
//         >
//           <div className="flex flex-col h-full">
//             {/* Panel Header */}
//             <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
//                 <button
//                   onClick={() => setIsPanelOpen(false)}
//                   className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors lg:hidden"
//                   aria-label="Close panel"
//                 >
//                   <Icon name="X" size={18} />
//                 </button>
//               </div>
              
//               {/* Breadcrumb Context */}
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <Icon name="Home" size={14} />
//                 <span>/</span>
//                 <span className="text-foreground font-medium">
//                   {location?.pathname === '/' || location?.pathname === '/upload-interface' ? 'Upload' :
//                    location?.pathname === '/vulnerability-dashboard' ? 'Dashboard' :
//                    location?.pathname === '/scan-history' ? 'History' :
//                    location?.pathname === '/scan-progress-tracking'? 'Scanning' : 'Navigation Panel'}
//                 </span>
//               </div>
//             </div>

//             {/* Panel Content */}
//             <div className="flex-1 overflow-y-auto">
//               {/* Project Switcher */}
//               <div className="p-4 border-b border-border">
//                 <ProjectSwitcher
//                   selectedProject={selectedProject}
//                   onProjectSwitch={handleProjectSwitch}
//                 />
//               </div>

//               {/* Navigation Menu */}
//               <div className="p-4 border-b border-border">
//                 <NavigationMenu currentPath={location?.pathname} />
//               </div>

//               {/* Quick Actions */}
//               <div className="p-4 border-b border-border">
//                 <QuickActions onActionClick={handleQuickAction} />
//               </div>

//               {/* Filter Shortcuts */}
//               <div className="p-4 border-b border-border">
//                 <FilterShortcuts onFilterSelect={handleFilterSelect} />
//               </div>

//               {/* File Explorer */}
//               <div className="p-4">
//                 <FileExplorer
//                   projectName={selectedProject}
//                   isExpanded={isFileExplorerExpanded}
//                   onToggle={() => setIsFileExplorerExpanded(!isFileExplorerExpanded)}
//                 />
//               </div>
//             </div>

//             {/* User Profile - Sticky at Bottom */}
//             <div className="sticky bottom-0 bg-card border-t border-border">
//               <UserProfile />
//             </div>
//           </div>
//         </aside>

//         {/* Main Content Area */}
//         <main className={`transition-all duration-300 ${isPanelOpen ? 'lg:ml-80' : 'ml-0'}`}>
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="bg-card rounded-lg border border-border p-8">
//               <div className="text-center">
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
//                   <Icon name="Sidebar" size={32} className="text-primary" />
//                 </div>
//                 <h1 className="text-3xl font-semibold text-foreground mb-2">
//                   Navigation Side Panel
//                 </h1>
//                 <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
//                   This side panel provides contextual navigation and quick access functionality throughout the application.
//                   Toggle it using the hamburger menu or press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+B</kbd> (or <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Cmd+B</kbd> on Mac).
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
//                   <div className="p-4 bg-muted/50 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-primary/10 rounded-md">
//                         <Icon name="Menu" size={20} className="text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-foreground mb-1">Hierarchical Navigation</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Navigate through all application screens with current page indicators and breadcrumb context.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 bg-muted/50 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-success/10 rounded-md">
//                         <Icon name="Zap" size={20} className="text-success" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-foreground mb-1">Quick Actions</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Access frequently used functions like New Scan, Recent Projects, and Scan History with badge indicators.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 bg-muted/50 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-accent/10 rounded-md">
//                         <Icon name="FolderTree" size={20} className="text-accent" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-foreground mb-1">File Explorer</h3>
//                         <p className="text-sm text-muted-foreground">
//                           View current project structure with vulnerability indicators overlaid on affected files.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 bg-muted/50 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-warning/10 rounded-md">
//                         <Icon name="Filter" size={20} className="text-warning" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-foreground mb-1">Filter Shortcuts</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Rapidly filter vulnerabilities by severity or category across all screens.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
//                   <Button
//                     iconName="Upload"
//                     onClick={() => navigate('/upload-interface')}
//                   >
//                     Start New Scan
//                   </Button>
//                   <Button
//                     variant="outline"
//                     iconName="Shield"
//                     onClick={() => navigate('/vulnerability-dashboard')}
//                   >
//                     View Dashboard
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     iconName="History"
//                     onClick={() => navigate('/scan-history')}
//                   >
//                     Scan History
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default NavigationSidePanel;