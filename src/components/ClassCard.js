import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { deleteStudents } from '../config/api';

const ClassCard = ({ classItem, onDelete }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const getFilteredStudents = () => {
    if (!searchTerm.trim()) return classItem.students;
    
    return classItem.students.filter(student => 
      student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleViewStudentResults = (studentId, studentName) => {
    navigate(`/instructor/student/${studentId}`, { 
      state: { studentName, studentId } 
    });
  };

  const handleSelectAll = () => {
    const filteredStudents = getFilteredStudents();
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.user_id));
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedStudents.length} selected student(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteStudents(selectedStudents);
      setSelectedStudents([]);
      setIsSelectionMode(false);
      // Trigger refetch in parent component
      onDelete();
    } catch (error) {
      console.error('Error deleting students:', error);
      alert('Failed to delete students. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedStudents([]);
    }
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div className="class-card">
      <div className="class-header">
        <div className="class-meta">
          <span>📅 {classItem.class_year}</span>
          <span>📘 {formatSemester(classItem.semester)}</span>
        </div>
      </div>

      <div className="students-section">
        <div className="students-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h4 className="students-title">Students</h4>
            <span className="students-count">
              {classItem.students.length}
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="students-search">
          <input
            type="text"
            placeholder="Search students by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="students-search-input"
          />
        </div>

        {/* Selection Controls */}
        <div className="selection-controls">
          <div className="selection-buttons">
            <button 
              onClick={toggleSelectionMode}
              className="select-btn"
            >
              {isSelectionMode ? 'Cancel' : 'Select'}
            </button>
            
            {isSelectionMode && (
              <>
                <button 
                  onClick={handleSelectAll}
                  className="select-all-btn"
                >
                  {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                </button>
                
                {selectedStudents.length > 0 && (
                  <button 
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className="delete-btn"
                    title={`Delete ${selectedStudents.length} selected student(s)`}
                  >
                    {isDeleting ? '...' : <FontAwesomeIcon icon={faTrashCan} />}
                  </button>
                )}
              </>
            )}
          </div>
          

        </div>

        {classItem.students.length === 0 ? (
          <div className="no-students-message">
            <p>No students enrolled in this class yet.</p>
          </div>
        ) : (
          <div className="students-list">
            {filteredStudents.map((student) => (
              <div key={student.user_id} className="student-item">
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.user_id)}
                    onChange={() => handleSelectStudent(student.user_id)}
                    className="student-checkbox"
                  />
                )}
                
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
                
                {!isSelectionMode && (
                  <button 
                    className="view-results-btn"
                    onClick={() => handleViewStudentResults(student.user_id, `${student.firstname} ${student.lastname}`)}
                  >
                    View Results
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassCard;