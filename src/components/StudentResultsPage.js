import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getStudentResults } from '../config/api';
import HistoryCard from './HistoryCard';
import './StudentResultsPage.css';

const StudentResultsPage = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const studentName = location.state?.studentName || 'Student';

  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getStudentResults(studentId);
        setResults(response.results || []);
      } catch (err) {
        console.error('Failed to fetch student results:', err);
        setError('Failed to load student results. Please try again.');
      } finally {
        setTimeout(() => setLoading(false), 750);
      }
    };

    if (studentId) {
      fetchStudentResults();
    }
  }, [studentId]);

  const handleViewResult = (resultId) => {
    navigate(`/instructor/student/${studentId}/result/${resultId}`);
  };

  const HistoryCardSkeleton = () => (
    <div className="history-card">
      <div className="skeleton-shimmer history-title-skeleton"></div>
      <div className="history-list">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="history-item history-item-skeleton">
            <div className="history-item-content">
              <div className="skeleton-shimmer skeleton-label"></div>
              <div className="skeleton-shimmer skeleton-date"></div>
            </div>
            <div className="skeleton-shimmer skeleton-view-btn"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="student-results-page">
        <div className="student-results-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          <h1 className="student-results-title">Loading {studentName}'s Results...</h1>
        </div>
        <HistoryCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-results-page">
        <div className="student-results-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          <h1 className="student-results-title">{studentName}'s Results</h1>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="student-results-page">
      <div className="student-results-header">
  
        <h1 className="student-results-title">{studentName}'s Assessment History</h1>
        <p className="student-results-subtitle">
          View all assessment attempts and results for this student
        </p>
      </div>
      
      {results.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📊</div>
          <h3 className="no-results-title">No Assessment Results</h3>
          <p className="no-results-text">
            {studentName} hasn't completed any assessments yet.
          </p>
        </div>
      ) : (
        <HistoryCard 
          results={results} 
          error={error} 
          loading={loading}
          onViewResult={handleViewResult}
          isInstructorView={true}
        />
      )}
    </div>
  );
};

export default StudentResultsPage; 