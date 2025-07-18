import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

// Mock data for the user, now including email
const mockUser = {
  username: 'priyanshu',
  firstName: 'Priyanshu',
  lastName: 'Pyakurel',
  email: 'priyanshu.pyakurel@gettysburg.edu',
  classYear: '2025',
  semester: '6',
};

// Main Settings Page Component
const SettingsPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('account');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set active section based on query param
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(location.search);
    setTimeout(() => {
      if (params.has('change-password')) {
        setActiveSection('password');
      }
      setLoading(false);
    }, 350);
  }, [location.search]);

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // In a real app, you would handle the API call for password update here
    console.log("Submitting new password data:", passwordData);
    setPasswordUpdated(true);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordUpdated(false), 3000); // Reset message after 3 seconds
  };

  const sidebarItems = [
    { id: 'account', label: 'Account Information', icon: faUser },
    { id: 'password', label: 'Change Password', icon: faLock },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Settings</h1>
          <p style={styles.headerDescription}>Manage your account settings and preferences.</p>
        </div>

        <div style={styles.layout}>
          {/* Sidebar Navigation */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarContent}>
              {loading ? <SidebarSkeleton /> : (
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
            {loading ? <AccountInfoSkeleton /> : (
              <>
                {activeSection === 'account' && <AccountInformationSection />}
                {activeSection === 'password' && (
                  <ChangePasswordSection
                    passwordData={passwordData}
                    onPasswordChange={handlePasswordChange}
                    onSubmit={handleSubmitPassword}
                    isUpdated={passwordUpdated}
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

// Component for Displaying Read-Only Account Information
const AccountInformationSection = () => (
  <div style={styles.sectionContainer}>
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>Account Information</h2>
      <p style={styles.sectionDescription}>These are your personal details.</p>
    </div>
    <div style={styles.contentBody}>
      {/* Avatar Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img src="/profileIcon.png" alt="User Avatar" style={styles.avatar} />
        <div>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#2d3748' }}>
            {mockUser.firstName} {mockUser.lastName}
          </p>
          <p style={{ color: '#718096' }}>@{mockUser.username}</p>
        </div>
      </div>

      <hr style={styles.separator} />

      {/* Static Info Grid */}
      <div style={styles.infoGrid}>
        <InfoItem label="First Name" value={mockUser.firstName} />
        <InfoItem label="Last Name" value={mockUser.lastName} />
         <InfoItem label="Email Address" value={mockUser.email} />
        <InfoItem label="Class Year" value={mockUser.classYear} />
        <InfoItem label="Graduating Semester" value={mockUser.semester} />
      </div>
    </div>
  </div>
);

// Component for the Change Password Form
const ChangePasswordSection = ({ passwordData, onPasswordChange, onSubmit, isUpdated }) => (
  <div style={styles.sectionContainer}>
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>Change Password</h2>
      <p style={styles.sectionDescription}>For your security, please do not share your password with anyone.</p>
    </div>
    <div style={styles.contentBody}>
      <form onSubmit={onSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FormInput
            label="Current Password"
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) => onPasswordChange('oldPassword', e.target.value)}
          />
          <FormInput
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => onPasswordChange('newPassword', e.target.value)}
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
          />
        </div>
        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button type="submit" style={styles.button}>Update Password</button>
          {isUpdated && <p style={{ color: '#38bdf8', fontWeight: 500 }}>Password successfully updated!</p>}
        </div>
      </form>
    </div>
  </div>
);

// Helper Components
const InfoItem = ({ label, value }) => (
  <div style={styles.infoItemBox}>
    <p style={styles.infoLabel}>{label}</p>
    <div style={styles.infoValueBox}>{value}</div>
  </div>
);

const FormInput = ({ label, type, value, onChange }) => (
  <div>
    <label style={styles.label}>{label}</label>
    <input type={type} value={value} onChange={onChange} required style={styles.input} />
  </div>
);

// Skeleton for Sidebar
const SidebarSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {[1, 2].map((_, i) => (
      <div key={i} style={{ height: 38, borderRadius: 8, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear', width: '100%' }} />
    ))}
    <style>{`
      @keyframes skeleton-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

// Skeleton for Account Info
const AccountInfoSkeleton = () => (
  <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef2f7', padding: 32, maxWidth: 480, margin: '32px auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 18, width: '60%', borderRadius: 6, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear', marginBottom: 8 }} />
        <div style={{ height: 14, width: '40%', borderRadius: 6, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear' }} />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {[1,2,3,4,5].map((_, i) => (
        <div key={i} style={{ height: 38, borderRadius: 8, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear' }} />
      ))}
    </div>
    <style>{`
      @keyframes skeleton-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
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