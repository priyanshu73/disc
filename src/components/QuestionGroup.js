
function QuestionGroup({ question, answers, onAnswerChange }) {
  const handleSelection = (type, value) => {
    onAnswerChange(question.id, type, value);
  };

  const groupClass =
    "question-group" + (question.id % 2 !== 0 ? " odd-question" : "");


  return (
    <div className={groupClass}>
      <h4>Question {question.id}</h4>
      <div className="adjective-list-container">
        {/* Header for the columns */}
        <div className="adjective-list-header">
          <span className="header-adjective"></span>
          <span className="header-most">Most</span>
          <span className="header-least">Least</span>
        </div>
        <ul className="adjective-list">
          {question.adjectives.map((adjective, index) => (
            <li key={index} className="adjective-row">
              <span className="adjective-label">{adjective}</span>
              {/* Radio button for 'Most' */}
              <span className="radio-cell">
                <input
                  type="radio"
                  name={`most-${question.id}`}
                  value={adjective}
                  checked={answers.most === adjective}
                  disabled={answers.least === adjective}
                  onChange={() => handleSelection('most', adjective)}
                />
              </span>
              {/* Radio button for 'Least' */}
              <span className="radio-cell">
                <input
                  type="radio"
                  name={`least-${question.id}`}
                  value={adjective}
                  checked={answers.least === adjective}
                  disabled={answers.most === adjective}
                  onChange={() => handleSelection('least', adjective)}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QuestionGroup;