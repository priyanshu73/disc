import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockProfiles = {
  1: {
    pattern: 'Practitioner',
    description: 'You are a Practitioner! You excel at bringing people together, facilitating collaboration, and driving results with empathy and insight. You are adaptable, supportive, and a natural problem solver.',
    chart: [30, 20, 25, 25], // D, I, S, C
    date: '2024-07-01 14:23',
  },
  2: {
    pattern: 'Practitioner',
    description: 'You are a Practitioner! You excel at bringing people together, facilitating collaboration, and driving results with empathy and insight. You are adaptable, supportive, and a natural problem solver.',
    chart: [25, 30, 20, 25],
    date: '2024-07-10 09:15',
  },
  3: {
    pattern: 'Practitioner',
    description: 'You are a Practitioner! You excel at bringing people together, facilitating collaboration, and driving results with empathy and insight. You are adaptable, supportive, and a natural problem solver.',
    chart: [20, 25, 30, 25],
    date: '2024-07-15 18:42',
  },
};

const chartColors = ['#2563eb', '#43e97b', '#b721ff', '#6b7280'];
const chartLabels = ['Dominance', 'Influence', 'Steadiness', 'Conscientiousness'];

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = mockProfiles[id] || mockProfiles[1];

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: '#f7f8fa',
      borderRadius: '18px',
      boxShadow: '0 2px 8px rgba(31, 38, 135, 0.06)',
      margin: '2rem',
      padding: '2rem',
    }}>
      <button onClick={() => navigate('/dashboard')} style={{
        alignSelf: 'flex-start',
        marginBottom: '1.5rem',
        background: 'none',
        border: 'none',
        color: '#2563eb',
        fontWeight: 600,
        fontSize: '1.1rem',
        cursor: 'pointer',
        textDecoration: 'underline',
      }}>&larr; Back to Dashboard</button>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(80,112,255,0.06)',
        border: '1px solid #e3e6ee',
        padding: '2.2rem 2.5rem',
        minWidth: '320px',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2.5rem',
      }}>
        <h1 style={{ color: '#1a237e', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 700 }}>{profile.pattern} Profile</h1>
        <div style={{ color: '#6b7280', fontWeight: 500, marginBottom: '1.2rem' }}>{profile.date}</div>
        <p style={{ color: '#22223b', fontSize: '1.08rem', textAlign: 'center', marginBottom: '1.5rem' }}>{profile.description}</p>
        {/* Dummy Chart */}
        <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem', justifyContent: 'center', width: '100%' }}>
          {profile.chart.map((val, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
              <div style={{
                width: '32px',
                height: `${val * 2.2}px`,
                background: chartColors[idx],
                borderRadius: '7px 7px 0 0',
                marginBottom: '0.4rem',
                transition: 'height 0.5s',
                boxShadow: '0 1px 2px rgba(80,112,255,0.04)',
              }}></div>
              <span style={{ fontSize: '0.93rem', color: '#555', marginTop: '0.2rem' }}>{chartLabels[idx]}</span>
              <span style={{ fontWeight: 600, color: '#22223b', fontSize: '1.05rem' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 