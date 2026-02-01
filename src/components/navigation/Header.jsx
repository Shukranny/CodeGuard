import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScan, setActiveScan] = useState(null);

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/upload-interface', label: 'New Scan', icon: 'Plus' },
    { path: '/scan-progress-tracking', label: 'Progress', icon: 'Activity' },
    { path: '/vulnerability-dashboard', label: 'Results', icon: 'FileSearch' }
  ];

  const moreItems = [
    { path: '/file-tree-explorer', label: 'Code Explorer', icon: 'FolderTree' }
  ];

  useEffect(() => {
    const scanStatus = localStorage.getItem('activeScan');
    if (scanStatus) {
      setActiveScan(JSON.parse(scanStatus));
    }
  }, [location]);

  const isActive = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-[1000] shadow-glow-md">
        <div className="h-full px-6 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth group-hover:bg-primary/20">
                <Icon name="Shield" size={24} color="var(--color-primary)" />
              </div>
              <span className="text-xl font-heading font-semibold text-foreground">
                SecureCodeAnalyzer
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-smooth hover:bg-muted/50
                    ${isActive(item?.path) 
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              ))}

              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth">
                  <Icon name="MoreHorizontal" size={18} />
                  <span>More</span>
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-glow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
                  {moreItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-smooth
                        first:rounded-t-lg last:rounded-b-lg
                        ${isActive(item?.path) ? 'text-primary' : 'text-foreground'}
                      `}
                    >
                      <Icon name={item?.icon} size={18} />
                      <span className="text-sm font-medium">{item?.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* {activeScan && (
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-primary">
                      Scan in Progress: {activeScan?.progress}%
                    </span>
                  </div>
                )} */}

              </div>
            </nav>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </Button>
          

        </div>
      </header>
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-[999] md:hidden">
          <nav className="flex flex-col p-4 gap-2">
            {[...navigationItems, ...moreItems]?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                  transition-smooth
                  ${isActive(item?.path)
                    ? 'bg-primary/10 text-primary' :'text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}

            {activeScan && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-primary">Active Scan</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Progress: {activeScan?.progress}%
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;