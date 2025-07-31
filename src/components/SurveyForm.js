
import React, { useState, useEffect } from 'react';
import QuestionGroup from './QuestionGroup';   
import { submitAnswers, fetchDiscQuestions } from '../config/api';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { DEV_ANSWERS } from '../devAnswers';
import './SurveyForm.css';

const GROUPS_PER_PAGE = 2;

function SurveyForm({ attemptNumber = 1 }) {
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [discQuestions, setDiscQuestions] = useState([]);
  const [lastResultId, setLastResultId] = useState(null);
  const navigate = useNavigate();

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

  // Dev autofill handler
  const handleDevAutofill = () => {
    setAnswers(DEV_ANSWERS);
    setCurrentPage(Math.ceil(Object.keys(DEV_ANSWERS).length / GROUPS_PER_PAGE) - 1);
  };

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
    setSubmitting(true);
    try {
      console.log('Submitting answers:', answers);
      const response = await submitAnswers(answers);
      console.log('Server response:', response);
   
    
      setLastResultId(response?.data?.resultId);
      console.log('Last result id:', lastResultId);
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 1000);
    } catch (error) {
      setSubmitting(false);
      console.error('Failed to submit answers:', error);
    }
  };

  // Show loading spinner while fetching questions
  if (loading) {
    return (
      <div className="survey-loading">
        <LoadingSpinner size="large" color="#4ade80" />
        <p className="survey-loading-text">Loading survey questions...</p>
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
    <div className="survey-form-container">
      {process.env.NODE_ENV === 'development' && (
        <button
          type="button"
          className="dev-autofill-btn"
          onClick={handleDevAutofill}
        >
          Autofill All Answers (DEV) 
        </button>
      )}
      <form onSubmit={handleSubmit} className="survey-form">
        {/* Overlay after submit */}
        {submitted && (
          <div className="survey-success-overlay">
            <div className="survey-success-modal">
              <h2 className="survey-success-title">Assessment Submitted!</h2>
              <p className="survey-success-message">
                Thank you for taking the assessment.<br />Your answers have been submitted successfully.
              </p>
              <div className="survey-success-buttons">
                <button
                  type="button"
                  className="survey-success-btn"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </button>
                <button
                  type="button"
                  className="survey-success-btn secondary"
                  onClick={() => navigate(lastResultId ? `/results/${lastResultId}` : `/`)}
                >
                  View Results {lastResultId}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Progress Bar */}
        <div className="survey-header">
          <h1>GBURG DiSC<sup className="reg-mark">®</sup></h1>
          <h2>
            Choose <span className="highlight-blue">one Most</span> and <span className="highlight-blue">one Least</span> in each of the 28 groups of words
          </h2>
        </div>
        {!submitted && (
          <div className="survey-progress-bar-container">
            <div className="survey-progress-bar-bg">
              <div className="survey-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="survey-progress-bar-label">
              {progress}% complete
            </div>
          </div>
        )}
        <div className="survey-content">
          {!submitted && (
            <>
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
            </>
          )}
        </div>
        {currentPage === totalPages - 1 && (
          <button 
            type="submit" 
            className="survey-submit-btn"
            disabled={submitting || progress < 100 || submitted}
          >
            {submitting && (
              <span className="survey-submit-spinner">
                <span className="survey-submit-spinner-inner" />
              </span>
            )}
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </form>
    </div>
  );
}

export default SurveyForm;