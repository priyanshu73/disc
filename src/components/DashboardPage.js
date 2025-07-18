import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './AuthContext';

const mockHistory = [
  { id: 1, date: '2024-07-01 14:23', label: 'Attempt 1' },
  { id: 2, date: '2024-07-10 09:15', label: 'Attempt 2' },
  { id: 3, date: '2024-07-15 18:42', label: 'Attempt 3' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const firstName = user?.firstname || 'User';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: '#f7f9fc', // Lighter, cooler background
      fontFamily: "'Inter', sans-serif",
      padding: '3rem 1rem',
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#2d3748',
        fontWeight: 700,
        margin: 0,
        marginBottom: '2.5rem',
        textAlign: 'center',
      }}>
        Welcome, {firstName}!
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '1200px',
      }}>
        {/* Take Assessment Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.05)';
        }}
        >
          <FontAwesomeIcon icon={faGauge} style={{ fontSize: '2.8rem', color: '#4a90e2', marginBottom: '1.5rem' }} />
          <h2 style={{
            color: '#2d3748',
            marginBottom: '2rem',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>Take the Assessment</h2>
          <button style={{
            background: '#4a90e2',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(74, 144, 226, 0.2)',
            transition: 'background 0.3s ease, transform 0.2s ease',
            letterSpacing: '0.025em',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#357abd';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#4a90e2';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={() => navigate('/assessment')}>Start Now</button>
        </div>

        {/* History Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.05)';
        }}
        >
          <h2 style={{
            color: '#2d3748',
            marginBottom: '2rem',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>History</h2>
          <div style={{ width: '100%' }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} style={{
                  background: '#f7f9fc',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  marginBottom: '1rem',
                  minHeight: '60px',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}>
                   <style>{`
                    @keyframes pulse {
                      0% { background-color: #f7f9fc; }
                      50% { background-color: #eef2f7; }
                      100% { background-color: #f7f9fc; }
                    }
                  `}</style>
                </div>
              ))
            ) : (
              mockHistory.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f7f9fc',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  marginBottom: '1rem',
                  border: '1px solid #eef2f7',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#4a5568' }}>{item.label}</div>
                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>{item.date}</div>
                  </div>
                  <button style={{
                    background: 'transparent',
                    color: '#4a90e2',
                    border: '1px solid #4a90e2',
                    borderRadius: '10px',
                    padding: '0.6rem 1.2rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease, color 0.3s ease',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#4a90e2';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#4a90e2';
                  }}
                  onClick={() => navigate(`/results/${item.id}`)}
                  >
                    View Results
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;