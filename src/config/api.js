// API Configuration
export const API_BASE_URL = 'http://localhost:4000/api';

// API utility functions
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
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