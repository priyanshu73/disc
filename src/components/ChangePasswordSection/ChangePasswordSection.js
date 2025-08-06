import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ChangePasswordSection = ({ passwordData, onPasswordChange, onSubmit, isUpdated, passwordUpdating, passwordError }) => {
  // State for password visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(true);

  // Password requirements
  const requirements = [
    {
      label: 'At least 8 characters',
      test: (pw) => pw.length >= 8,
    },
    {
      label: 'At least 1 uppercase letter',
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: 'At least 1 number',
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      label: 'At least 1 special character (like !@#$%^&*())',
      test: (pw) => /[!@#$%^&*()]/.test(pw),
    },
  ];
  const newPw = passwordData.newPassword;
  const confirmPw = passwordData.confirmPassword;
  const allValid = requirements.every(r => r.test(newPw));
  const confirmMatch = newPw && confirmPw && newPw === confirmPw;

  useEffect(() => {
    setDisableUpdate(!allValid || !confirmMatch || !passwordData.oldPassword);
  }, [newPw, confirmPw, allValid, confirmMatch, passwordData.oldPassword]);

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef2f7' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #eef2f7' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#2d3748' }}>Change Password</h2>
        <p style={{ color: '#718096', marginTop: '4px', fontSize: '0.9rem' }}>For your security, please do not share your password with anyone.</p>
      </div>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {passwordError && (
          <div style={{ color: '#e11d48', fontWeight: 500, marginBottom: 16, textAlign: 'center' }}>{passwordError}</div>
        )}
        {!confirmMatch && confirmPw && (
          <div style={{ color: '#e11d48', fontWeight: 500, marginBottom: 8, textAlign: 'center' }}>
            Confirm password does not match new password.
          </div>
        )}
        <form onSubmit={onSubmit} style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormInput
              label="Current Password"
              type={showOld ? 'text' : 'password'}
              value={passwordData.oldPassword}
              onChange={(e) => onPasswordChange('oldPassword', e.target.value)}
              show={showOld}
              onToggleShow={() => setShowOld((v) => !v)}
            />
            <FormInput
              label="New Password"
              type={showNew ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => onPasswordChange('newPassword', e.target.value)}
              show={showNew}
              onToggleShow={() => setShowNew((v) => !v)}
            />
            <FormInput
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
              show={showConfirm}
              onToggleShow={() => setShowConfirm((v) => !v)}
            />
          </div>
          {/* Password requirements */}
          <div style={{ margin: '18px 0 0 0', color: '#6b7280', fontSize: '0.98rem' }}>
            <div style={{ marginBottom: 6, fontWeight: 600, color: '#a0aec0' }}>Password requirements:</div>
            {requirements.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ color: r.test(newPw) ? '#22c55e' : '#e11d48', fontSize: 18 }}>
                  {r.test(newPw) ? '✓' : '☓'}
                </span>
                <span style={{ color: r.test(newPw) ? '#22223b' : '#a0aec0' }}>{r.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="submit"
              style={{
                background: passwordUpdating || disableUpdate ? '#cbd5e1' : '#4a90e2',
                color: passwordUpdating || disableUpdate ? '#a0aec0' : '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: passwordUpdating || disableUpdate ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                minWidth: 160
              }}
              disabled={passwordUpdating || disableUpdate}
            >
              {passwordUpdating && (
                <span style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginRight: 10,
                }}>
                  <span style={{
                    width: 18,
                    height: 18,
                    border: '2.5px solid #e5e7eb',
                    borderTop: '2.5px solid #38bdf8',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </span>
              )}
              {passwordUpdating ? 'Updating' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ label, type, value, onChange, show, onToggleShow }) => (
  <div style={{ position: 'relative' }}>
    <label style={{ display: 'block', fontWeight: 500, color: '#4a5568', marginBottom: '8px', fontSize: '0.9rem' }}>{label}</label>
    <input type={type} value={value} onChange={onChange} required maxLength={16} style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', backgroundColor: '#fff', color: '#2d3748', outline: 'none', transition: 'border-color 0.2s' }} />
    {typeof show === 'boolean' && typeof onToggleShow === 'function' && (
      <span
        onClick={onToggleShow}
        style={{
          position: 'absolute',
          right: 16,
          top: 38,
          cursor: 'pointer',
          color: '#a0aec0',
          fontSize: 18,
          zIndex: 2,
        }}
        tabIndex={0}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
      </span>
    )}
  </div>
);

export default ChangePasswordSection; 