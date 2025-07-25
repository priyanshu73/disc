import React from 'react';
import './ResultsPage.css';

const chartColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const chartLabels = ['D', 'I', 'S', 'C'];
const chartTooltips = ['Dominance', 'Influence', 'Steadiness', 'Conscientiousness'];

const DiSCChart = ({ chartData }) => {
  const maxValue = Math.max(...chartData.map(Math.abs));
  const scale = maxValue > 0 ? 80 / maxValue : 1;

  const scaleMax = Math.ceil(maxValue);
  const scaleValues = [];
  if (scaleMax > 0) {
    for (let i = scaleMax; i >= -scaleMax; i -= Math.ceil(scaleMax / 3)) {
      scaleValues.push(i);
    }
  } else {
    scaleValues.push(0);
  }

  return (
    <div className="chart-card">
      <h2 className="chart-title">Your DiSC Style</h2>
      <div className="chart-container">
        
        <div className="chart-area">
          
          {chartData.map((val, idx) => {
            const barHeight = Math.abs(val) * scale;
            const isPositive = val >= 0;
            const isZero = val === 0;

            return (
              <div key={idx} className="chart-item">
                <div className="chart-bar-container">
                  <div
                    className={`chart-bar ${
                      isZero 
                        ? 'chart-bar-zero' 
                        : isPositive 
                          ? 'chart-bar-positive' 
                          : 'chart-bar-negative'
                    }`}
                    style={{
                      height: isZero ? '8px' : `${barHeight}px`,
                      backgroundColor: isZero ? 'transparent' : chartColors[idx]
                    }}
                  >
                    <div className="chart-value">{val}</div>
                  </div>
                </div>
                <span
                  className="chart-label"
                  title={chartTooltips[idx]}
                >
                  {chartLabels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiSCChart;