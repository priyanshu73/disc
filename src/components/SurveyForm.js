
import React, { useState, useEffect } from 'react';
import QuestionGroup from './QuestionGroup';   
import { submitAnswers, fetchDiscQuestions } from '../config/api';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { DEV_ANSWERS } from '../devAnswers';

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
      // If response contains a result id, store it for view results
      setLastResultId(response?.resultId || null);
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
    <>
      {process.env.NODE_ENV === 'development' && (
        <button
          type="button"
          style={{
            margin: '16px auto 0 auto',
            display: 'block',
            background: '#e0e7ff',
            color: '#22223b',
            border: '1px solid #a5b4fc',
            borderRadius: 8,
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          onClick={handleDevAutofill}
        >
          Autofill All Answers (DEV)
        </button>
      )}
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        {/* Overlay after submit */}
        {submitted && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '2.5rem 2.5rem 2rem 2.5rem',
              boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
            }}>
              <h2 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: 16 }}>Assessment Submitted!</h2>
              <p style={{ color: '#4a5568', marginBottom: 28 }}>
                Thank you for taking the assessment.<br />Your answers have been submitted successfully.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <button
                  type="button"
                  style={{
                    background: '#4a90e2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </button>
                <button
                  type="button"
                  style={{
                    background: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => navigate(lastResultId ? `/results/${lastResultId}` : `/results/${attemptNumber}`)}
                >
                  View Results
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
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
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
          <button type="submit" style={{ marginTop: 24, minWidth: 120, background: submitting ? '#cbd5e1' : '#4a90e2', color: submitting ? '#a0aec0' : '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: '1.08rem', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={submitting || progress < 100 || submitted}>
            {submitting && (
              <span style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: 10,
              }}>
                <span style={{
                  width: 18,
                  height: 18,
                  border: '2.5px solid #e5e7eb',
                  borderTop: '2.5px solid #38bdf8',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 1s linear infinite',
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </span>
            )}
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </form>
    </>
  );
}

export default SurveyForm;