import React from 'react';
import { useAuth } from './AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Instructor Dashboard</h2>
      <h3>Your Classes</h3>
      <ul>
        {user?.classes?.length ? (
          user.classes.map((cls, idx) => (
            <li key={cls.class_id || idx}>
              Year: {cls.class_year}, Semester: {cls.semester === 'S' ? 'Spring' : cls.semester === 'F' ? 'Fall' : ''}
            </li>
          ))
        ) : (
          <li>No classes found.</li>
        )}
      </ul>
    </div>
  );
};

export default InstructorDashboard; 