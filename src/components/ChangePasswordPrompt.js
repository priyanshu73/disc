import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPrompt = () => {
  const navigate = useNavigate();
  return (
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
      zIndex: 1000,
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
        <h2 style={{ color: '#2d3748', fontWeight: 700, marginBottom: 16 }}>Update Your Password</h2>
        <p style={{ color: '#4a5568', marginBottom: 28 }}>
          For your security, you must update your password before you can use the dashboard.
        </p>
        <button
          style={{
            background: '#4a90e2',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontWeight: 600,
            fontSize: '1.08rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onClick={() => navigate('/settings?change-password')}
        >
          Proceed to Password Change
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPrompt; 