import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getInstructorInfo } from '../../config/api';
import InstructorDashboardSkeleton from './InstructorDashboardSkeleton';
import ClassCard from '../ClassCard';
import './InstructorDashboard.css';
import ChangePasswordPrompt from '../ChangePasswordPrompt';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a minimum loading time for better UX
        const [response] = await Promise.all([
          getInstructorInfo(),
          new Promise(resolve => setTimeout(resolve, 750))
        ]);
        console.log(response);
        setClasses(response.classes || []);
      } catch (err) {
        console.error('Error fetching instructor data:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, []);

  const handleRefetchClasses = async () => {
    // Set loading to true to show skeleton
    setLoading(true);
    setError(null);
    
    try {
      const response = await getInstructorInfo();
      setClasses(response.classes || []);
    } catch (err) {
      console.error('Error refetching classes:', err);
      setError('Failed to refresh classes. Please try again.');
    } finally {
      // Set loading to false to hide skeleton
      setLoading(false);
    }
  };

  if (user && !user.hasReset) {
    // This part is for the password reset prompt, which is a full-screen overlay.
    // We can show its own skeleton or a simple loading spinner.
    if (loading) {
      return (
        <InstructorDashboardSkeleton />
      );
    }
    return <ChangePasswordPrompt />;
  }  


  if (loading) {
    return <InstructorDashboardSkeleton />;
  }

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <div className="welcome-card">
          <div className="welcome-emoji">👋</div>
          <div className="welcome-content">
            <h1 className="dashboard-title">Instructor Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back, {user?.firstname} {user?.lastname}!
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Add Students Section */}
      <div className="add-students-section">
        <div className="add-students-card">
          <div className="add-students-content">
            <div className="add-students-icon">👥</div>
            <div className="add-students-text">
              <h3 className="add-students-title">Manage Students</h3>
              <p className="add-students-subtitle">
                Upload CSV files to add students to your classes
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/students')}
            className="add-students-btn"
          >
            ✚ Add Students
          </button>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="no-classes">
          <div className="no-classes-icon">📚</div>
          <h3 className="no-classes-title">No Classes Assigned</h3>
          <p className="no-classes-text">
            You don't have any classes assigned yet. Contact your administrator if you believe this is an error.
          </p>
        </div>
      ) : (
        <div className="classes-container">
          {classes.map((classItem) => (
            <ClassCard 
              key={classItem.class_id} 
              classItem={classItem} 
              onDelete={handleRefetchClasses}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard; 