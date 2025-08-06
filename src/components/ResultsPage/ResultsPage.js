import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile, faBullseye, faBalanceScale, faHandshake,
  faBuilding, faExclamationTriangle, faTachometerAlt, faShieldAlt, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { getResultById, getStudentResultById } from '../../config/api';
import { useAuth } from '../AuthContext';
import DiSCChart from '../DiSCChart';
import './ResultsPage.css';

// Chart constants moved to DiSCChart component

const ResultsPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id, studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if this is an instructor viewing a student's result
  const isInstructorView = user?.is_instructor && studentId;
  const studentName = location.state?.studentName || 'Student';

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        let response;
        
        if (isInstructorView) {
          // Instructor viewing student result
          response = await getStudentResultById(studentId, id);
        } else {
          // Regular user viewing their own result
          response = await getResultById(id);
        }
        
        console.log(response.result);
        setResult(response.result);
      } catch (err) {
        console.error('Failed to fetch result:', err);
        setError('Failed to load result. Please try again.');
      } finally {
        setTimeout(() => setLoading(false), 750); 
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id, studentId, isInstructorView]);

  const handleBack = () => {
    if (isInstructorView) {
      navigate(`/instructor/student/${studentId}`);
    } else {
      navigate('/dashboard');
    }
  };

     const ResultSkeleton = () => (
     <div className="results-page-container skeleton-container">
       <div className="main-content">
         {/* Chart card skeleton - simplified to match current structure */}
         <div className="chart-card">
           <div className="skeleton-shimmer chart-title-skeleton"></div>
           <div className="chart-container">
             <div className="chart-scale">
               {[1, 2, 3, 4, 5].map((_, idx) => (
                 <div key={idx} className="skeleton-shimmer scale-label-skeleton"></div>
               ))}
             </div>
                           <div className="chart-area">
                {[1, 2, 3, 4].map((_, idx) => (
                 <div key={idx} className="chart-item">
                   <div className="chart-bar-container">
                     <div className="skeleton-shimmer chart-bar-skeleton"></div>
                   </div>
                   <div className="skeleton-shimmer chart-label-skeleton"></div>
                 </div>
               ))}
             </div>
           </div>
         </div>

         {/* Profile card skeleton */}
         <div className="profile-card">
           <div className="profile-header">
             <div className="skeleton-shimmer title-skeleton"></div>
             <div className="skeleton-shimmer date-skeleton"></div>
           </div>
           <div className="skeleton-shimmer description-skeleton"></div>
         </div>
       </div>

       {/* Details grid skeleton */}
       <div className="details-grid">
         {[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
           <div key={idx} className="detail-panel-skeleton">
             <div className="skeleton-shimmer panel-label-skeleton"></div>
             <div className="skeleton-shimmer panel-text-skeleton"></div>
           </div>
         ))}
       </div>
     </div>
   );

  if (loading) {
    return <ResultSkeleton />;
  }

  if (error || !result) {
    return (
             <div className="results-page-container error-container">
         <div className="error-message">
           {error || 'Result not found'}
         </div>
       </div>
    );
  }

  // const parseJsonSafely = (data) => {
  //   if (typeof data === 'string') {
  //     try {
  //       return JSON.parse(data);
  //     } catch (e) {
  //       return {};
  //     }
  //   }
  //   return data || {};
  // };

     const mostCounts = result.most_counts;
   const leastCounts = result.least_counts;
   
   // Chart data with comprehensive information for all graphs
   const chartData = {
     // Graph III: Differences (current implementation)
     differences: [
       (mostCounts.Z || 0) - (leastCounts.Z || 0), // D
       (mostCounts.S || 0) - (leastCounts.S || 0), // I  
       (mostCounts.T || 0) - (leastCounts.T || 0), // S
       (mostCounts['*'] || 0) - (leastCounts['*'] || 0), // C
     ],
     // Graph I: Most counts
     mostCounts: [
       mostCounts.Z || 0, // D
       mostCounts.S || 0, // I
       mostCounts.T || 0, // S
       mostCounts['*'] || 0, // C
     ],
     // Graph II: Least counts
     leastCounts: [
       leastCounts.Z || 0, // D
       leastCounts.S || 0, // I
       leastCounts.T || 0, // S
       leastCounts['*'] || 0, // C
     ]
   };

  const formattedDate = new Date(result.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const profileItems = [
    { label: 'Emotions', value: result.emotions, icon: faSmile },
    { label: 'Goal', value: result.goal, icon: faBullseye },
    { label: 'Judges Others By', value: result.judges_others_by, icon: faBalanceScale },
    { label: 'Influences Others By', value: result.influences_others_by, icon: faHandshake },
    { label: 'Value to Organization', value: result.value_to_organization, icon: faBuilding },
    { label: 'Overuses', value: result.overuses, icon: faExclamationTriangle },
    { label: 'Under Pressure', value: result.under_pressure, icon: faTachometerAlt },
    { label: 'Fears', value: result.fears, icon: faShieldAlt },
    { label: 'Would Increase Effectiveness Through', value: result.would_increase_effectiveness_through, icon: faChartLine },
  ];

  return (
         <div className="results-page-container">
       {isInstructorView && (
         <div className="instructor-header">
           <button className="back-btn" onClick={handleBack}>
             ← Back to {studentName}'s History
           </button>
           <h2 className="instructor-title">{studentName}'s Assessment Result</h2>
         </div>
       )}
       
       <div className="main-content">
         <DiSCChart chartData={chartData} segno={result.segno} />

        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-name">{result.pname}</h1>
            <p className="profile-date">Completed on {formattedDate}</p>
          </div>
          <p className="profile-description">{result.general_description}</p>
        </div>
      </div>

      <div className="details-grid">
        {profileItems.map((item, idx) => (
          item.value && (
            <div key={idx} className={`detail-panel panel-color-${idx % 2}`}>
              <h3 className="panel-label">
                <FontAwesomeIcon icon={item.icon} className="panel-icon" />
                {item.label}
              </h3>
              <p className="panel-text">{item.value}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ResultsPage; 