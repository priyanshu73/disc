import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './AuthContext';
import { changePassword } from '../config/api';
import ChangePasswordSection from './ChangePasswordSection';
import AccountInformationSection from './AccountInformationSection';
import AccountInfoSkeleton from './AccountInfoSkeleton';
import SidebarSkeleton from './SidebarSkeleton';


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
    <div style={styles.page}>
      {passwordUpdated && <PasswordSuccessOverlay />}
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Settings</h1>
          <p style={styles.headerDescription}>Manage your account settings and preferences.</p>
        </div>

        <div style={styles.layout}>
          {/* Sidebar Navigation */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarContent}>
              {showSkeleton ? <SidebarSkeleton /> : (
                <nav style={styles.sidebarNav}>
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      style={{
                        ...styles.sidebarButton,
                        ...(activeSection === item.id ? styles.sidebarButtonActive : {}),
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon} style={styles.sidebarIcon} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main style={styles.mainContent}>
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
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '2.5rem 2.5rem 2rem 2.5rem',
      boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
      maxWidth: 400,
      width: '100%',
      textAlign: 'center',
    }}>
      <h2 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: 16 }}>Password Updated!</h2>
      <p style={{ color: '#4a5568', marginBottom: 28 }}>
        Your password was updated successfully.<br />You will be logged out and redirected to login.
      </p>
    </div>
  </div>
);

// --- STYLES OBJECT ---
const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f7f9fc', fontFamily: "'Inter', sans-serif", padding: '32px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  headerTitle: { fontSize: '32px', fontWeight: 700, color: '#2d3748' },
  headerDescription: { color: '#718096', marginTop: '8px', fontSize: '1rem' },
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px' },
  sidebar: {},
  sidebarContent: { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #eef2f7' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  sidebarButton: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem', background: 'transparent', color: '#4a5568', transition: 'background-color 0.2s, color 0.2s' },
  sidebarButtonActive: { backgroundColor: '#4a90e2', color: '#fff' },
  sidebarIcon: { width: '16px', height: '16px' },
  mainContent: {},
  sectionContainer: { background: '#fff', borderRadius: '12px', border: '1px solid #eef2f7' },
  sectionHeader: { padding: '24px', borderBottom: '1px solid #eef2f7' },
  sectionTitle: { fontSize: '20px', fontWeight: 600, color: '#2d3748' },
  sectionDescription: { color: '#718096', marginTop: '4px', fontSize: '0.9rem' },
  contentBody: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' },
  separator: { border: 0, borderTop: '1px solid #eef2f7', margin: '0' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
  infoLabel: { color: '#718096', fontSize: '0.875rem', marginBottom: '4px' },
  infoValue: { color: '#2d3748', fontSize: '1rem', fontWeight: 500 },
  label: { display: 'block', fontWeight: 500, color: '#4a5568', marginBottom: '8px', fontSize: '0.9rem' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', backgroundColor: '#fff', color: '#2d3748', outline: 'none', transition: 'border-color 0.2s' },
  button: { background: '#4a90e2', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' },
  infoItemBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoValueBox: {
    border: '1px solid #d1d5db',
    background: '#f7f9fc',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#2d3748',
    fontSize: '1rem',
    fontWeight: 500,
    minHeight: '38px',
    display: 'flex',
    alignItems: 'center',
  },
};

export default SettingsPage;