import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SurveyForm from '../SurveyForm/SurveyForm';
import { useAuth } from '../AuthContext';
import ChangePasswordPrompt from '../ChangePasswordPrompt';
import LoadingSpinner from '../LoadingSpinner';
import './AssessmentPage.css';

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
        <div className="assessment-loading">
          <LoadingSpinner size="large" color="#4ade80" />
          <p className="assessment-loading-text">Loading assessment...</p>
        </div>
      );
    }
    return <ChangePasswordPrompt />;
  }

  return (
    <div className="assessment-page">
      <h2 className="assessment-title">
        Take the DiSC Assessment {attemptNumber > 1 && <span className="assessment-title-attempt">(Attempt {attemptNumber})</span>}
      </h2>
      <SurveyForm attemptNumber={attemptNumber} />
    </div>
  );
};

export default AssessmentPage; 