import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const UserProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: null,
    role: 'Security Analyst'
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Settings', icon: 'User' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'help', label: 'Help & Support', icon: 'HelpCircle' },
    { id: 'logout', label: 'Logout', icon: 'LogOut', variant: 'destructive' }
  ];

  const handleMenuItemClick = (itemId) => {
    setIsMenuOpen(false);
    // Handle menu item actions
    if (itemId === 'logout') {
      console.log('Logout clicked');
    }
  };

  return (
    <div className="relative p-4">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        aria-label="User menu"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {user?.avatar ? (
            <img src={user?.avatar} alt={user?.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <Icon name="User" size={20} className="text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="font-medium text-sm text-foreground truncate">{user?.name}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.role}</div>
        </div>
        <Icon
          name={isMenuOpen ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          className="text-muted-foreground flex-shrink-0"
        />
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-md shadow-elevation-3 z-20 animate-slide-in"
            role="menu"
          >
            {menuItems?.map((item, index) => (
              <button
                key={item?.id}
                onClick={() => handleMenuItemClick(item?.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left
                  ${item?.variant === 'destructive' ?'text-error hover:bg-error/10' :'text-foreground hover:bg-muted'
                  }
                  ${index === 0 ? 'rounded-t-md' : ''}
                  ${index === menuItems?.length - 1 ? 'rounded-b-md' : ''}
                  ${index < menuItems?.length - 1 ? 'border-b border-border' : ''}
                `}
                role="menuitem"
              >
                <Icon
                  name={item?.icon}
                  size={16}
                  className={item?.variant === 'destructive' ? 'text-error' : 'text-muted-foreground'}
                />
                <span className="text-sm font-medium">{item?.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;