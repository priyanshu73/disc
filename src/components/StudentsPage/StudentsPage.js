import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { uploadStudentsFile } from '../../config/api';
import './StudentsPage.css';

const StudentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedSemester, setSelectedSemester] = useState('Fall');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [csvPreview, setCsvPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);


  // Generate years from 2025 to 2030
  const years = Array.from({ length: 10 }, (_, i) => (2025 + i).toString());
  const semesters = ['Fall', 'Spring'];

  const validateCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          const requiredHeaders = ['firstname', 'lastname', 'collegeusername'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            reject(`Missing required columns: ${missingHeaders.join(', ')}`);
            return;
          }
          
          // Parse and validate data
          const data = [];
          const errors = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim());
              const row = {
                firstName: values[headers.indexOf('firstname')] || '',
                lastName: values[headers.indexOf('lastname')] || '',
                collegeUserName: values[headers.indexOf('collegeusername')] || '',
                row: i + 1
              };
              
              // Validate row data
              if (!row.firstName) errors.push(`Row ${i + 1}: Missing first name`);
              if (!row.lastName) errors.push(`Row ${i + 1}: Missing last name`);
              if (!row.collegeUserName) errors.push(`Row ${i + 1}: Missing college username`);
              
              data.push(row);
            }
          }
          
          if (errors.length > 0) {
            reject(`Validation errors:\n${errors.join('\n')}`);
            return;
          }
          
          resolve({ data, headers });
        } catch (error) {
          reject('Invalid CSV format');
        }
      };
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await processFile(file);
  };

  const processFile = async (file) => {
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setUploadStatus('Please select a valid CSV file.');
      setSelectedFile(null);
      setCsvPreview(null);
      return;
    }

    try {
      setUploadStatus('Validating CSV file...');
      const result = await validateCSV(file);
      
      setSelectedFile(file);
      setCsvPreview(result.data.slice(0, 5)); // Show first 5 rows as preview
      setUploadStatus(`CSV file validated! Found ${result.data.length} students.`);
    } catch (error) {
      setUploadStatus(`Validation failed: ${error}`);
      setSelectedFile(null);
      setCsvPreview(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
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
      // Use the simple API function
      const result = await uploadStudentsFile(selectedFile, selectedYear, selectedSemester);

      setUploadStatus(`Success! ${result.students_inserted || 0} students uploaded successfully.`);
      setSelectedFile(null);
      setCsvPreview(null);
      
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setCsvPreview(null);
    setUploadStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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

          {selectedFile && (
            <div className="file-info">
              <h3>Selected File</h3>
              <p><strong>Name:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
              <button onClick={clearFile} className="clear-btn">
                Clear File
              </button>
            </div>
          )}
        </div>

        <div className="upload-section">
          <h2 className="section-title">Student Data</h2>
          
          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.includes('Failed') ? 'error' : 'success'}`}>
              {uploadStatus}
            </div>
          )}
          <div 
            className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label htmlFor="csv-file" className="file-upload-label">
              <div className="upload-icon">📁</div>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : 'Choose CSV file or drag it here'}
              </span>
              <span className="upload-hint">Supports .csv files only</span>
            </label>
            <input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {csvPreview && (
            <div className="csv-preview">
              <h3>Preview (First 5 students)</h3>
              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>College Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((student, index) => (
                      <tr key={index}>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.collegeUserName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

          {isUploading && (
            <div className="upload-loading">
              <div className="loading-spinner"></div>
              <span>Uploading students...</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="upload-btn"
          >
            {isUploading ? 'Uploading...' : 'Upload Students'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default StudentsPage; 