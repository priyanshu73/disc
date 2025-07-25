import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SurveyForm from './SurveyForm';
import { useAuth } from './AuthContext';
import ChangePasswordPrompt from './ChangePasswordPrompt';
import LoadingSpinner from './LoadingSpinner';

const AssessmentPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const attemptNumber = location.state?.attemptNumber || 1;

  // Simulate loading for prompt (match SurveyForm's loading duration)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(timer);
  }, []);

  if (user && !user.hasReset) {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <LoadingSpinner size="large" color="#4ade80" />
          <p style={{ marginTop: '20px', color: '#666' }}>Loading assessment...</p>
        </div>
      );
    }
    return <ChangePasswordPrompt />;
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '32px 0 16px 0' }}>
        Take the DiSC Assessment {attemptNumber > 1 && `(Attempt ${attemptNumber})`}
      </h2>
      <SurveyForm attemptNumber={attemptNumber} />
    </div>
  );
};

export default AssessmentPage; 