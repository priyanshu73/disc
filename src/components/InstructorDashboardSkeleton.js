import React from 'react';
import './InstructorDashboard.css';

const InstructorDashboardSkeleton = () => {
  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
      </div>
      
      <div className="classes-container">
        <div className="class-card">
          <div className="class-header skeleton-header">
            <div className="skeleton skeleton-class-title"></div>
            <div className="skeleton skeleton-class-meta"></div>
          </div>
          
          <div className="students-section">
            <div className="students-header">
              <div className="skeleton skeleton-students-title"></div>
              <div className="skeleton skeleton-students-count"></div>
            </div>
            
            <div className="students-list">
              {[1, 2, 3, 4, 5, 6].map((studentIndex) => (
                <div key={studentIndex} className="student-item">
                  <div className="skeleton skeleton-avatar"></div>
                  <div className="student-info">
                    <div className="skeleton skeleton-student-name"></div>
                    <div className="skeleton skeleton-student-username"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardSkeleton; 