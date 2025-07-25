import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getInstructorInfo } from '../config/api';
import InstructorDashboardSkeleton from './InstructorDashboardSkeleton';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();
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

  const getStudentInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const formatSemester = (semester) => {
    const semesterMap = {
      'S': 'Spring',
      'F': 'Fall',
      'Spring': 'Spring',
      'Fall': 'Fall'
    };
    return semesterMap[semester] || semester;
  };

  if (loading) {
    return <InstructorDashboardSkeleton />;
  }

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Instructor Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {user?.firstname} {user?.lastname} !
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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
            <div key={classItem.class_id} className="class-card">
              <div className="class-header">
                <h3 className="class-title">
                  Classes 
                </h3>
                <div className="class-meta">
                  <span>📅 {classItem.class_year}</span>
                  <span>📘 {formatSemester(classItem.semester)}</span>
                </div>
              </div>

              <div className="students-section">
                <div className="students-header">
                  <h4 className="students-title">Students</h4>
                  <span className="students-count">
                    {classItem.students.length}
                  </span>
                </div>

                {classItem.students.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    color: '#7f8c8d',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    No students enrolled in this class yet.
                  </div>
                ) : (
                  <div className="students-list">
                    {classItem.students.map((student) => (
                      <div key={student.user_id} className="student-item">
                        <div className="student-avatar">
                          {getStudentInitials(student.firstname, student.lastname)}
                        </div>
                        <div className="student-info">
                          <div className="student-name">
                            {student.firstname} {student.lastname}
                          </div>
                          <div className="student-username">
                            @{student.username}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard; 