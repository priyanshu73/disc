import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function QuestionGroup({ question, answers, onAnswerChange, onClear }) {
  const handleSelection = (type, value) => {
    onAnswerChange(question.id, type, value);
  };

  const groupClass =
    "question-group" + (question.id % 2 !== 0 ? " odd-question" : "");

  return (
    <div className={groupClass} style={{ position: "relative" }}>
      {/* Clear icon */}
      
      <h4>Question {question.id}</h4>
      <button
        type="button"
        className="clear-group-btn"
        title="Clear selection"
        onClick={() => onClear(question.id)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.1rem",
          color: "#888"
        }}
        aria-label="Clear selection"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
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