import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import './HistoryCard.css';

const HistoryCard = ({ 
  results = [], 
  error = null, 
  loading = false, 
  onViewResult = null,
  isInstructorView = false 
}) => {
  const navigate = useNavigate();

  const handleViewResult = (resultId) => {
    if (onViewResult) {
      onViewResult(resultId);
    } else {
      navigate(`/results/${resultId}`);
    }
  };

  const HistoryItemSkeleton = () => (
    <div className="history-item history-item-skeleton">
      <div className="history-item-content">
        <div className="skeleton-shimmer skeleton-label" />
        <div className="skeleton-shimmer skeleton-date" />
      </div>
      <div className="skeleton-shimmer skeleton-view-btn" />
    </div>
  );

  return (
    <div className="history-card">
      <h2 className="history-title">
        {isInstructorView ? 'Assessment History' : 'History'}
      </h2>
      <div className="history-list">
        {loading ? (
          <>
            <HistoryItemSkeleton />
            
          </>
        ) : error ? (
          <div className="history-error">{error}</div>
        ) : results.length === 0 ? (
          <div className="history-empty">
            {isInstructorView ? 'No assessment history found for this student.' : 'No assessment history found.'}
          </div>
        ) : (
          results.map((result, index) => (
            <div key={result.id} className="history-item">
              <div className="history-item-content">
                <div className="history-label">Attempt {results.length - index}</div>
                <div className="history-date">
                  <FontAwesomeIcon icon={faClock} className="history-date-icon" />
                  {result.created_at}
                </div>
              </div>
              <button
                className="history-view-btn"
                onClick={() => handleViewResult(result.id)}
              >
                View Results
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryCard; 