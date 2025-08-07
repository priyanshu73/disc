// API Configuration
export const API_BASE_URL = 'http://localhost:4000/api';

// API utility functions
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  };
  console.log('API Call:', url, "how many times");
  //console.log('API Call:', url, defaultOptions);
  console.log('Cookies:', document.cookie);

  try {
    const response = await fetch(url, defaultOptions);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response body:', await response.message);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Fetch DiSC questions from server
export const fetchDiscQuestions = async () => {
  const response = await apiCall('/disc-questions');
  return response.data; 
};

// Submit survey answers
export const submitAnswers = async (answers) => {
  return await apiCall('/submit-answers', {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
};

// Specific API functions
export const fetchAdjectives = async () => {
  return await apiCall('/adjectives');
}; 

// Auth API functions
export const login = async (username, password) => {
  // Ensure the body uses the correct keys: username and password
  return await apiCall('/login', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
};

export const getMe = async () => {
  return await apiCall('/me', {
    method: 'GET',
    credentials: 'include',
  });
}; 

// Logout API function
export const logout = async () => {
  return await apiCall('/logout', {
    method: 'POST',
    credentials: 'include',
  });
}; 

// Change password API function
export const changePassword = async (oldPassword, newPassword) => {
  return await apiCall('/change-password', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ oldPassword, newPassword })
  });
}; 

// Get user results API function
export const getResults = async () => {
  return await apiCall('/results', {
    method: 'GET',
    credentials: 'include',
  });
};

// Get specific result by ID API function
export const getResultById = async (resultId) => {
  return await apiCall(`/results/${resultId}`, {
    method: 'GET',
    credentials: 'include',
  });
}; 

// Get instructor information (classes and students)
export const getInstructorInfo = async () => {
  return await apiCall('/instructors/info', {
    method: 'GET',
    credentials: 'include',
  });
}; 

export const getStudentResults = async (student_id) => {
  return await apiCall(`/results?student_id=${student_id}`, {
    method: 'GET',
    credentials: 'include',
  });
};

// Get specific student result by ID (for instructor viewing)
export const getStudentResultById = async (studentId, resultId) => {
  return await apiCall(`/results/${resultId}?student_id=${studentId}`, {
    method: 'GET',
    credentials: 'include',
  });
};

// File upload API function
export const uploadStudentsFile = async (file, classYear, semester) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('classYear', classYear);
  
  // Convert semester to single character: Spring -> S, Fall -> F
  const semesterChar = semester.toUpperCase() === 'SPRING' ? 'S' : 'F';
  formData.append('semester', semesterChar);

  const url = `${API_BASE_URL}/upload-students`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // Include cookies for authentication
      body: formData, // Don't set Content-Type header - browser will set it with boundary
    });
    
    console.log('Upload Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

// Delete students API function
export const deleteStudents = async (studentIds, classId) => {
  return await apiCall('/delete-students', {
    method: 'DELETE',
    credentials: 'include',
    body: JSON.stringify({ studentIds, classId })
  });
};

