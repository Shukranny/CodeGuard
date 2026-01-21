import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import PrimaryNavigation from 'components/navigation/PrimaryNavigation';
import Header from 'components/navigation/Header';
import FilterToolbar from '../../components/ui/FilterToolbar';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ScanHistoryCard from './components/ScanHistoryCard';
import SummaryDashboard from './components/SummaryDashboard';
import QuickAccessSection from './components/QuickAccessSection';
import BulkActionsBar from './components/BulkActionsBar';
import ComparisonModal from './components/ComparisonModal';

const ScanHistory = () => {
  const navigate = useNavigate();
  const [selectedScans, setSelectedScans] = useState([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('date-desc');

  const mockScanHistory = [
    {
      id: "scan_001",
      projectName: "E-Commerce Platform",
      scanDate: "2025-12-10T14:30:00",
      duration: 245,
      filesProcessed: 1247,
      status: "Completed",
      vulnerabilities: {
        high: 8,
        medium: 15,
        low: 23
      },
      totalIssues: 46,
      criticalFiles: 12,
      projectSize: "45.2 MB",
      scannerVersions: [
        { name: "Semgrep", version: "1.45.0" },
        { name: "GitLeaks", version: "8.18.0" },
        { name: "OSV.dev", version: "2.3.1" }
      ],
      trendIndicator: {
        type: "improvement",
        message: "12% fewer vulnerabilities than previous scan"
      }
    },
    {
      id: "scan_002",
      projectName: "Mobile Banking App",
      scanDate: "2025-12-09T16:45:00",
      duration: 189,
      filesProcessed: 892,
      status: "Completed",
      vulnerabilities: {
        high: 12,
        medium: 8,
        low: 18
      },
      totalIssues: 38,
      criticalFiles: 15,
      projectSize: "32.8 MB",
      scannerVersions: [
        { name: "Semgrep", version: "1.45.0" },
        { name: "GitLeaks", version: "8.18.0" },
        { name: "OSV.dev", version: "2.3.1" }
      ],
      trendIndicator: {
        type: "regression",
        message: "5 new high-severity issues detected"
      }
    },
    {
      id: "scan_003",
      projectName: "Healthcare Portal",
      scanDate: "2025-12-08T10:20:00",
      duration: 312,
      filesProcessed: 1589,
      status: "Completed",
      vulnerabilities: {
        high: 3,
        medium: 12,
        low: 28
      },
      totalIssues: 43,
      criticalFiles: 8,
      projectSize: "58.4 MB",
      scannerVersions: [
        { name: "Semgrep", version: "1.44.0" },
        { name: "GitLeaks", version: "8.17.0" },
        { name: "OSV.dev", version: "2.3.0" }
      ],
      trendIndicator: {
        type: "improvement",
        message: "All critical issues resolved"
      }
    },
    {
      id: "scan_004",
      projectName: "Social Media Dashboard",
      scanDate: "2025-12-07T13:15:00",
      duration: 156,
      filesProcessed: 634,
      status: "Completed",
      vulnerabilities: {
        high: 5,
        medium: 10,
        low: 15
      },
      totalIssues: 30,
      criticalFiles: 7,
      projectSize: "28.6 MB",
      scannerVersions: [
        { name: "Semgrep", version: "1.44.0" },
        { name: "GitLeaks", version: "8.17.0" },
        { name: "OSV.dev", version: "2.3.0" }
      ]
    },
    {
      id: "scan_005",
      projectName: "Inventory Management System",
      scanDate: "2025-12-06T09:30:00",
      duration: 278,
      filesProcessed: 1123,
      status: "Completed",
      vulnerabilities: {
        high: 6,
        medium: 14,
        low: 20
      },
      totalIssues: 40,
      criticalFiles: 10,
      projectSize: "41.3 MB",
      scannerVersions: [
        { name: "Semgrep", version: "1.44.0" },
        { name: "GitLeaks", version: "8.17.0" },
        { name: "OSV.dev", version: "2.3.0" }
      ],
      trendIndicator: {
        type: "improvement",
        message: "8% improvement in code quality"
      }
    }
  ];

  const mockSummaryData = {
    totalScans: 47,
    scansThisMonth: 12,
    uniqueProjects: 18,
    activeProjects: 8,
    avgScanTime: "3m 45s",
    scanTimeImprovement: "15%",
    totalIssuesFound: 1847,
    issuesTrend: "↓ 8% from last month",
    totalVulnerabilities: {
      high: 156,
      medium: 342,
      low: 589
    },
    scanningFrequency: [
      { day: "Mon", scans: 8 },
      { day: "Tue", scans: 6 },
      { day: "Wed", scans: 10 },
      { day: "Thu", scans: 7 },
      { day: "Fri", scans: 9 },
      { day: "Sat", scans: 3 },
      { day: "Sun", scans: 4 }
    ]
  };

  const mockRecentScans = mockScanHistory?.slice(0, 3);

  const mockFrequentProjects = [
    {
      id: "proj_001",
      name: "E-Commerce Platform",
      scanCount: 15,
      lastScan: "2025-12-10T14:30:00"
    },
    {
      id: "proj_002",
      name: "Mobile Banking App",
      scanCount: 12,
      lastScan: "2025-12-09T16:45:00"
    },
    {
      id: "proj_003",
      name: "Healthcare Portal",
      scanCount: 8,
      lastScan: "2025-12-08T10:20:00"
    }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'vulnerabilities-desc', label: 'Most Vulnerabilities' },
    { value: 'vulnerabilities-asc', label: 'Least Vulnerabilities' },
    { value: 'size-desc', label: 'Largest Projects' },
    { value: 'size-asc', label: 'Smallest Projects' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const handleSelectScan = (scanId, isSelected) => {
    setSelectedScans(prev => 
      isSelected 
        ? [...prev, scanId]
        : prev?.filter(id => id !== scanId)
    );
  };

  const handleSelectAll = () => {
    if (selectedScans?.length === mockScanHistory?.length) {
      setSelectedScans([]);
    } else {
      setSelectedScans(mockScanHistory?.map(scan => scan?.id));
    }
  };

  const handleViewResults = (scanId) => {
    navigate('/vulnerability-dashboard', { state: { scanId } });
  };

  const handleRerun = (scanId) => {
    const scan = mockScanHistory?.find(s => s?.id === scanId);
    navigate('/upload-interface', { state: { projectName: scan?.projectName } });
  };

  const handleDownload = (scanId) => {
    console.log('Downloading scan:', scanId);
    alert(`Downloading report for scan ${scanId}...`);
  };

  const handleDelete = (scanId) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      console.log('Deleting scan:', scanId);
      alert(`Scan ${scanId} deleted successfully`);
    }
  };

  const handleCompare = () => {
    if (selectedScans?.length >= 2) {
      setIsComparisonModalOpen(true);
    }
  };

  const handleBulkExport = () => {
    console.log('Exporting selected scans:', selectedScans);
    alert(`Exporting ${selectedScans?.length} scans...`);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedScans?.length} scans?`)) {
      console.log('Deleting scans:', selectedScans);
      setSelectedScans([]);
      alert('Selected scans deleted successfully');
    }
  };

  const handleStartNewScan = (projectName = '') => {
    navigate('/upload-interface', { state: { projectName } });
  };

  const getComparisonScans = () => {
    return mockScanHistory?.filter(scan => selectedScans?.includes(scan?.id))?.slice(0, 2);
  };

  const filteredAndSortedScans = mockScanHistory?.filter(scan => {
      if (searchQuery && !scan?.projectName?.toLowerCase()?.includes(searchQuery?.toLowerCase())) {
        return false;
      }
      if (filters?.severity && filters?.severity !== 'all') {
        const severityCount = scan?.vulnerabilities?.[filters?.severity];
        if (severityCount === 0) return false;
      }
      return true;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.scanDate) - new Date(a.scanDate);
        case 'date-asc':
          return new Date(a.scanDate) - new Date(b.scanDate);
        case 'vulnerabilities-desc':
          return b?.totalIssues - a?.totalIssues;
        case 'vulnerabilities-asc':
          return a?.totalIssues - b?.totalIssues;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      {/* <PrimaryNavigation /> */}
      <Header />
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Scan History</h1>
              <p className="text-muted-foreground">
                Review and manage your security analysis sessions
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => handleStartNewScan()}
              iconName="Plus"
              iconPosition="left"
            >
              New Scan
            </Button>
          </div>

          <SummaryDashboard summaryData={mockSummaryData} />

          <QuickAccessSection
            recentScans={mockRecentScans}
            frequentProjects={mockFrequentProjects}
            onViewScan={handleViewResults}
            onStartNewScan={handleStartNewScan}
          />

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icon name="History" size={24} />
                All Scans ({mockScanHistory?.length})
              </h2>
              <div className="flex items-center gap-3">
                <Select
                  options={dateRangeOptions}
                  value={filters?.dateRange || 'all'}
                  onChange={(value) => setFilters({ ...filters, dateRange: value })}
                  placeholder="Date Range"
                />
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort By"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  iconName={selectedScans?.length === mockScanHistory?.length ? 'CheckSquare' : 'Square'}
                  iconPosition="left"
                >
                  {selectedScans?.length === mockScanHistory?.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>

            <FilterToolbar
              onSearchChange={setSearchQuery}
              onFilterChange={setFilters}
              searchPlaceholder="Search by project name..."
              showExport={false}
            />

            <div className="space-y-4 mt-6">
              {filteredAndSortedScans?.length > 0 ? (
                filteredAndSortedScans?.map((scan) => (
                  <ScanHistoryCard
                    key={scan?.id}
                    scan={scan}
                    onViewResults={handleViewResults}
                    onRerun={handleRerun}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onSelect={handleSelectScan}
                    isSelected={selectedScans?.includes(scan?.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No scans found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BulkActionsBar
        selectedCount={selectedScans?.length}
        onCompare={handleCompare}
        onExport={handleBulkExport}
        onDelete={handleBulkDelete}
        onClearSelection={() => setSelectedScans([])}
      />
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        scans={getComparisonScans()}
      />
    </div>
  );
};

export default ScanHistory;