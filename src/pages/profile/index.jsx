import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProfileHeader from './components/ProfileHeader';
import AccountSettings from './components/AccountSettings';
import DarkModeToggle from './components/DarkModeToggle';
import './profile.css';

const Profile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Developer',
    email: 'john.developer@example.com',
    company: 'Tech Corp',
    role: 'Security Engineer',
    joined: 'January 2024'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profileData);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    applyDarkMode(savedDarkMode);
  }, []);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleDarkModeToggle = (newState) => {
    setIsDarkMode(newState);
    localStorage.setItem('darkMode', newState);
    applyDarkMode(newState);
  };

  const handleEditChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    });
  };

  const handleSaveChanges = () => {
    setProfileData(editData);
    setIsEditing(false);
    localStorage.setItem('profileData', JSON.stringify(editData));
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-semibold text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile, preferences, and security settings
          </p>
        </div>

        {/* Profile Section */}
        <ProfileHeader 
          profileData={profileData}
          isEditing={isEditing}
          editData={editData}
          onEditChange={handleEditChange}
          onEditToggle={() => setIsEditing(!isEditing)}
        />

        {/* Settings Tabs */}
        <div className="grid grid-cols-1 gap-8 mt-8">
          
          {/* Account Settings */}
          <AccountSettings
            profileData={profileData}
            editData={editData}
            isEditing={isEditing}
            onEditChange={handleEditChange}
            onSave={handleSaveChanges}
            onCancel={handleCancel}
          />

          {/* Preferences Section */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-glow-md">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Settings" size={24} className="text-primary" />
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Preferences
              </h2>
            </div>

            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <DarkModeToggle
                isDarkMode={isDarkMode}
                onToggle={handleDarkModeToggle}
              />

              {/* Notification Preferences */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Notifications
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 cursor-pointer hover:bg-muted/30 p-3 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded accent-primary cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about scan results</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-4 cursor-pointer hover:bg-muted/30 p-3 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded accent-primary cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-foreground">Security Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive critical security notifications</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 cursor-pointer hover:bg-muted/30 p-3 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded accent-primary cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-foreground">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Get a weekly summary of your scans</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-glow-md">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Lock" size={24} className="text-primary" />
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Security
              </h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <div className="text-left">
                  <p className="font-medium text-foreground">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <div className="text-left">
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <div className="text-left">
                  <p className="font-medium text-foreground">Active Sessions</p>
                  <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-lg border border-error/20 p-8 shadow-glow-md">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="AlertTriangle" size={24} className="text-error" />
              <h2 className="text-2xl font-heading font-semibold text-error">
                Danger Zone
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Irreversible actions that will permanently affect your account.
              </p>
              
              <Button variant="destructive" className="w-full">
                <Icon name="Trash2" size={18} />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
