import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import { changePassword } from '../../config/api';
import ChangePasswordSection from '../ChangePasswordSection/ChangePasswordSection';
import AccountInformationSection from '../AccountInfo/AccountInformationSection';
import AccountInfoSkeleton from '../AccountInfo/AccountInfoSkeleton';
import SidebarSkeleton from '../SidebarSkeleton';
import './SettingsPage.css';


// Main Settings Page Component
const SettingsPage = () => {
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  // Add local skeleton delay state
  const [skeletonDelay, setSkeletonDelay] = useState(true);

  // Set active section based on query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('change-password')) {
      setActiveSection('password');
    }
  }, [location.search]);

  // Minimum skeleton display time
  useEffect(() => {
    setSkeletonDelay(true);
    const timer = setTimeout(() => setSkeletonDelay(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (field === 'oldPassword' || field === 'newPassword') {
      setPasswordError('');
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from the current password.');
      return;
    }
    setPasswordUpdating(true);
    setTimeout(async () => {
      try {
        const response = await changePassword(passwordData.oldPassword, passwordData.newPassword);
        console.log("Password update response:", response);
        setPasswordUpdated(true);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordUpdating(false);
        setTimeout(async () => {
          setPasswordUpdated(false);
          await logout();
        }, 2500); // Show message for 2.5 seconds, then logout
      } catch (error) {
        setPasswordUpdating(false);
        setPasswordError('Failed to update password. Please try again.');
        console.error("Password update error:", error);
      }
    }, 1000); // Fake updating animation for 1s
  };

  const sidebarItems = [
    { id: 'account', label: 'Account Information', icon: faUser },
    { id: 'password', label: 'Change Password', icon: faLock },
  ];

  const showSkeleton = loading || skeletonDelay;

  return (
    <div className="settings-page">
      {passwordUpdated && <PasswordSuccessOverlay />}
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-header-title">Settings</h1>
          <p className="settings-header-description">Manage your account settings and preferences.</p>
        </div>

        <div className="settings-layout">
          {/* Sidebar Navigation */}
          <aside className="settings-sidebar">
            <div className="settings-sidebar-content">
              {showSkeleton ? <SidebarSkeleton /> : (
                <nav className="settings-sidebar-nav">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`settings-sidebar-button ${activeSection === item.id ? 'active' : ''}`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="settings-sidebar-icon" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="settings-main-content">
            {showSkeleton ? <AccountInfoSkeleton /> : (
              <>
                {activeSection === 'account' && <AccountInformationSection user={user} />}
                {activeSection === 'password' && (
                  <ChangePasswordSection
                    passwordData={passwordData}
                    onPasswordChange={handlePasswordChange}
                    onSubmit={handleSubmitPassword}
                    isUpdated={passwordUpdated}
                    passwordUpdating={passwordUpdating}
                    passwordError={passwordError}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Password success overlay modal
const PasswordSuccessOverlay = () => (
  <div className="password-success-overlay">
    <div className="password-success-modal">
      <h2 className="password-success-title">Password Updated!</h2>
      <p className="password-success-message">
        Your password was updated successfully.<br />You will be logged out and redirected to login.
      </p>
    </div>
  </div>
);



export default SettingsPage;