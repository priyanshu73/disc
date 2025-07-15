
import React, { useState, useEffect } from 'react';
import { discQuestions } from '../questions'; 
import QuestionGroup from './QuestionGroup';   

function SurveyForm() {

  const [answers, setAnswers] = useState({});
  useEffect(() => {
    console.log(answers);
  }, [answers]);
  const handleAnswerChange = (questionId, type, value) => {

    setAnswers(prevAnswers => {
     
      const newAnswersForQuestion = { ...prevAnswers[questionId], [type]: value };
      return { ...prevAnswers, [questionId]: newAnswersForQuestion };
    });
    
  };

  return (
    <form>
      <div className="survey-header">
      <h1>DiSC<sup className="reg-mark">®</sup> Classic</h1>
    <h2>
      Choose <span className="highlight-blue">one Most</span> and <span className="highlight-blue">one Least</span> in each of the 28 groups of words
    </h2>
  </div>
      {discQuestions.map(question => (
        <QuestionGroup
          key={question.id}
          question={question}
          answers={answers[question.id] || {}}
          onAnswerChange={handleAnswerChange}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default SurveyForm;