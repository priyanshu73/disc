import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './StudentsPage.css';

const StudentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedSemester, setSelectedSemester] = useState('Fall');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Generate years from 2025 to 2030
  const years = Array.from({ length: 6 }, (_, i) => (2025 + i).toString());
  const semesters = ['Fall', 'Spring'];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadStatus('');
    } else {
      setUploadStatus('Please select a valid CSV file.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a CSV file first.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading students...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('classYear', selectedYear);
      formData.append('semester', selectedSemester);

      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/upload-students', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUploadStatus('Students uploaded successfully! They will receive an email with their login credentials.');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('csv-file');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setUploadStatus('Error uploading students. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user?.is_instructor) {
    navigate('/');
    return null;
  }

  return (
    <div className="students-page">
      <div className="students-header">
        <h1 className="students-title">Add Students</h1>
        <p className="students-subtitle">
          Upload student information to enroll them in your classes
        </p>
      </div>

      <div className="upload-container">
        <div className="upload-section">
          <h2 className="section-title">Class Information</h2>
          
          <div className="form-group">
            <label htmlFor="class-year" className="form-label">Class Year</label>
            <select
              id="class-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semester" className="form-label">Semester</label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="form-select"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="upload-section">
          <h2 className="section-title">Student Data</h2>
          
          <div className="file-upload-area">
            <label htmlFor="csv-file" className="file-upload-label">
              <div className="upload-icon">📁</div>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : 'Choose CSV file or drag it here'}
              </span>
            </label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          <div className="csv-instructions">
            <h3>CSV Format Instructions</h3>
            <p>Your CSV file should have the following columns:</p>
            <ul>
              <li><strong>firstName</strong> - Student's first name</li>
              <li><strong>lastName</strong> - Student's last name</li>
              <li><strong>collegeUserName</strong> - Student's college username</li>
            </ul>
            <p className="password-note">
              <strong>Note:</strong> All students will be assigned the temporary password: <code>gettysburg2025</code>
            </p>
            <p className="password-note">
              Students will be prompted to reset their password on first login.
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="upload-btn"
          >
            {isUploading ? 'Uploading...' : 'Upload Students'}
          </button>

          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage; 