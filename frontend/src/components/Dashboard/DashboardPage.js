import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import { getResults } from '../../config/api';
import ChangePasswordPrompt from '../ChangePasswordPrompt';
import InstructorDashboard from '../InstructorDashboard/InstructorDashboard';
import HistoryCard from '../HistoryCard/HistoryCard';
import './DashboardStyles.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [resultsError, setResultsError] = useState(null);
  const { user } = useAuth();
  const firstName = user?.firstname || 'User';

  useEffect(() => {
    const fetchData = async () => {
      if (user && !user.is_instructor) {
      try {
        // Fetch results for history card
        const response = await getResults();
        setResults(response.results || []);
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setResultsError('Failed to load history.');
      } finally {
        // Simulate loading for assessment card
        setTimeout(() => setLoading(false), 750);
      }
    }
    };

    fetchData();
  }, [user]);

  if (user && user.is_instructor) {
    return <InstructorDashboard />;
  }

  if (user && !user.hasReset) {
    // This part is for the password reset prompt, which is a full-screen overlay.
    // We can show its own skeleton or a simple loading spinner.
    if (loading) {
      return (
        <div className="dashboard-page-container">
          <div className="dashboard-grid">
            <TakeAssessmentSkeleton />
            <HistorySkeletonStub />
          </div>
        </div>
      );
    }
    return <ChangePasswordPrompt />;
  }

  return (
    <div className="dashboard-page-container">
      <div className="welcome-card">
        <div className="welcome-emoji">👋</div>
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome, {firstName}!
          </h1>
        </div>
      </div>
      <div className="dashboard-grid">
        {/* The Assessment card and its skeleton */}
        {loading ? (
          <TakeAssessmentSkeleton />
        ) : (
                     <div className="assessment-card">
             <FontAwesomeIcon icon={faGauge} className="assessment-icon" />
             <h2 className="assessment-title">
               {results.length > 0 ? 'Take the Assessment Again' : 'Take the Assessment'}
             </h2>
             <button className="assessment-btn" onClick={() => navigate('/assessment', { state: { attemptNumber: results.length + 1 } })}>Start Now</button>
           </div>
        )}

        {/* The HistoryCard now receives data as props */}
        <HistoryCard results={results} error={resultsError} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardPage;

const TakeAssessmentSkeleton = () => (
  <div className="assessment-card-skeleton">
    <div className="skeleton-shimmer skeleton-icon" />
    <div className="skeleton-shimmer skeleton-title" />
    <div className="skeleton-shimmer skeleton-button" />
  </div>
);

// This is just a placeholder to maintain grid layout while the main page loads,
// before the real HistoryCard with its internal skeleton takes over.
const HistorySkeletonStub = () => (
  <div className="history-card-skeleton" />
);