
import React, { useState, useEffect } from 'react';
import QuestionGroup from './QuestionGroup';   
import { submitAnswers, fetchDiscQuestions } from '../config/api';
import LoadingSpinner from './LoadingSpinner';

const GROUPS_PER_PAGE = 2;

function SurveyForm() {
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [discQuestions, setDiscQuestions] = useState([]);

  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const questions = await fetchDiscQuestions();
        console.log(questions);
        setDiscQuestions(questions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        // You might want to show an error message to the user here
      } finally {
        setTimeout(() => setLoading(false), 750);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const handleAnswerChange = (questionId, type, value) => {
    setAnswers(prevAnswers => {
      const newAnswersForQuestion = { ...prevAnswers[questionId], [type]: value };
      return { ...prevAnswers, [questionId]: newAnswersForQuestion };
    });
  };

  const handleClearGroup = (questionId) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting answers:', answers);
      const response = await submitAnswers(answers);
      console.log('Server response:', response);
    } catch (error) {
      console.error('Failed to submit answers:', error);
    }
  };

  // Show loading spinner while fetching questions
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <LoadingSpinner size="large" color="#4ade80" />
        <p style={{ marginTop: '20px', color: '#666' }}>Loading survey questions...</p>
      </div>
    );
  }

  // Progress bar logic
  const totalQuestions = discQuestions.length;
  const totalPages = Math.ceil(totalQuestions / GROUPS_PER_PAGE);
  const totalAdjectives = totalQuestions * 2; // 2 answers per group
  let answeredCount = 0;
  Object.values(answers).forEach(ans => {
    if (ans.most) answeredCount++;
    if (ans.least) answeredCount++;
  });
  const progress = Math.round((answeredCount / totalAdjectives) * 100);

  // Navigation handlers
  const goPrev = () => setCurrentPage(idx => Math.max(0, idx - 1));
  const goNext = () => setCurrentPage(idx => Math.min(totalPages - 1, idx + 1));

  // Get questions for current page
  const startIdx = currentPage * GROUPS_PER_PAGE;
  const endIdx = Math.min(startIdx + GROUPS_PER_PAGE, totalQuestions);
  const currentQuestions = discQuestions.slice(startIdx, endIdx);

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress Bar */}
      <div className="survey-header">
        <h1>GBURG DiSC<sup className="reg-mark">®</sup></h1>
        <h2>
          Choose <span className="highlight-blue">one Most</span> and <span className="highlight-blue">one Least</span> in each of the 28 groups of words
        </h2>
      </div>
      <div className="survey-progress-bar-container">
        <div className="survey-progress-bar-bg">
          <div className="survey-progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="survey-progress-bar-label">
          {progress}% complete
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="survey-groups-row">
          {currentQuestions.map(q => (
            <QuestionGroup
              key={q.id}
              question={q}
              answers={answers[q.id] || {}}
              onAnswerChange={handleAnswerChange}
              onClear={handleClearGroup}
            />
          ))}
        </div>
        <div className="survey-nav-buttons">
          <button type="button" onClick={goPrev} disabled={currentPage === 0} className="survey-nav-btn">← Previous</button>
          <button type="button" onClick={goNext} disabled={currentPage === totalPages - 1} className="survey-nav-btn">Next →</button>
        </div>
      </div>
      {currentPage === totalPages - 1 && (
        <button type="submit" style={{ marginTop: 24 }}>Submit</button>
      )}
    </form>
  );
}

export default SurveyForm;