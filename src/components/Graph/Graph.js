// =============================================================================
// GRAPH.JS - COMPLETE REACT COMPONENT
// =============================================================================
// Copy this entire file to: src/components/Graph/Graph.js
// Make sure to uncomment the imports section below and adjust paths as needed
// =============================================================================


import React, { useRef, useEffect, useState } from 'react';
import { discRanges, MostRanges, LeastRanges } from '../../disc_chart'; // Fixed import path
import './Graph.css';

/**
 * =============================================================================
 * SCALABLE DISC GRAPH COMPONENT - FIXED
 * =============================================================================
 *
 * FEATURES:
 * - Fixed layout overlap issue.
 * - Interactive graph type switching (Graph I, II, III).
 * - Hover tooltips on data points.
 * - Fully responsive design via CSS custom properties.
 *
 * PROPS:
 * @param {Object} chartData - Contains 'differences' array, e.g., { differences: [-10, 5, 12, -2] }
 * @param {string} chartType - The starting graph type ('I', 'II', or 'III').
 * @param {string|number} segno - A string of segment numbers, e.g., "3635".
 * =============================================================================
 */
const Graph = ({ chartData, chartType, segno }) => {
  // =============================================================================
  // STATE AND REFS
  // =============================================================================
  const discGridRef = useRef(null);
  const [discAreaWidth, setDiscAreaWidth] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeGraphType, setActiveGraphType] = useState(chartType || 'III');

  // =============================================================================
  // CONFIGURATION CONSTANTS
  // =============================================================================
  const discColors = { D: '#dc2626', I: '#ea580c', S: '#16a34a', C: '#2563eb' };
  const discFullNames = { D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Conscientiousness' };
  const chartLabels = ['D', 'I', 'S', 'C'];
  const graphTypes = ['I', 'II', 'III'];

  // =============================================================================
  // DYNAMIC WIDTH CALCULATION
  // =============================================================================
  useEffect(() => {
    const updateWidth = () => {
      if (discGridRef.current) {
        const totalContainerWidth = discGridRef.current.offsetWidth;
        const leftColumnWidth = 64; // Intensity column width
        const rightColumnWidth = 64; // Segment column width
        setDiscAreaWidth(totalContainerWidth - leftColumnWidth - rightColumnWidth);
      }
    };

    updateWidth(); // Set initial width

    // Add resize observer for responsiveness
    const resizeObserver = new ResizeObserver(updateWidth);
    const currentRef = discGridRef.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  // =============================================================================
  // DATA PROCESSING FUNCTIONS
  // =============================================================================
  const getSegmentForValue = (value, discType, graphType) => {
    const discTypeMap = {
      'D': 'D',
      'I': 'i', // discRanges uses lowercase 'i'
      'S': 'S', 
      'C': 'C'
    };
    const lookupType = discTypeMap[discType];
    
    let ranges;
    if (graphType === 'I') {
      ranges = MostRanges[lookupType];
    } else if (graphType === 'II') {
      ranges = LeastRanges[lookupType];
    } else {
      ranges = discRanges[lookupType]; // Graph III uses differences
    }
    
    if (!ranges) return 4; // Default to middle segment
    const found = ranges.find(r => value >= r.min && value <= r.max);
    return found ? found.segment : 4;
  };

  const getIntensityFromSegment = (segmentValue) => {
    const segmentRanges = {
      7: [25, 28], // Highest intensity
      6: [21, 24], 
      5: [17, 20],
      4: [13, 16], // Middle intensity
      3: [9, 12],
      2: [5, 8],
      1: [1, 4]    // Lowest intensity
    };
    
    const range = segmentRanges[segmentValue];
    if (!range) return 14.5; // Default to middle
    
    // Return the middle of the range for positioning
    return (range[0] + range[1]) / 2;
  };

  const getYPosition = (intensityValue) => {
    const rowHeight = 20; // Each row is 20px high
    const totalRows = 28;
    
    // Intensity 28 at top (row 0), intensity 1 at bottom (row 27)
    const rowIndex = totalRows - intensityValue;
    const yPosition = rowIndex * rowHeight + (rowHeight / 2);
    
    // Keep within bounds of the 560px grid area
    return Math.max(10, Math.min(550, yPosition));
  };

  const getXPositionPixels = (column) => {
    const leftColumnWidth = 64; // Intensity column width
    const singleDiscColumnWidth = discAreaWidth / 4; // Each DISC column width

    // X position relative to the start of the entire grid container
    return leftColumnWidth + (column * singleDiscColumnWidth) + (singleDiscColumnWidth / 2);
  };

  const parseSegno = (segno) => {
    if (!segno) return ["4", "3", "2", "5"]; // Default values
    const digits = segno.toString().replace(/[^0-9]/g, '').split('');
    return digits.slice(0, 4); // Take first 4 digits for D, I, S, C
  };

  // =============================================================================
  // DATA PREPARATION
  // =============================================================================
  let finalData;
  if (activeGraphType === 'I') {
    finalData = chartData?.mostCounts || [0, 0, 0, 0];
  } else if (activeGraphType === 'II') {
    finalData = chartData?.leastCounts || [0, 0, 0, 0];
  } else {
    finalData = chartData?.differences || [0, 0, 0, 0];
  }
  
  const segments = finalData.map((value, idx) => {
    const discType = chartLabels[idx];
    const segment = getSegmentForValue(value, discType, activeGraphType);
    return {
      value,
      segment: segment,
      label: chartLabels[idx],
    };
  });

  const dataPoints = segments.map((segment, column) => ({
    column,
    value: getIntensityFromSegment(segment.segment),
    label: segment.label,
    fullName: discFullNames[segment.label],
    segment: segment.segment,
    originalValue: segment.value
  }));

  const segmentNumbers = parseSegno(segno);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  const handleGraphToggle = (graphType) => {
    setActiveGraphType(graphType);
    console.log(`Switched to Graph ${graphType}`);
  };

  // =============================================================================
  // RENDER COMPONENT
  // =============================================================================
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-header-toggle">
          {graphTypes.map((type) => (
            <button
              key={type}
              className={`graph-toggle-btn ${activeGraphType === type ? 'active' : ''}`}
              onClick={() => handleGraphToggle(type)}
            >
              Graph {type}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-main-content">
        <div className="chart-headers">
          <div className="intensity-header"><div className="header-text">INTENSITY</div></div>
          <div className="disc-headers">
            {chartLabels.map(letter => <div key={letter} className="disc-header"><div className="disc-header-text">{letter}</div></div>)}
          </div>
          <div className="segment-header"><div className="header-text">SEGMENT</div></div>
        </div>

        <div ref={discGridRef} className="chart-grid-area">
          <div className="intensity-numbers">
            {Array.from({ length: 28 }, (_, i) => <div key={i} className="intensity-number">{28 - i}</div>)}
          </div>
          <div className="disc-grid">
            {chartLabels.map(letter => (
              <div key={letter} className="disc-column">
                {Array.from({ length: 28 }, (_, i) => <div key={i} className="grid-cell-new"></div>)}
              </div>
            ))}
          </div>
          <div className="segment-numbers">
            {[7, 6, 5, 4, 3, 2, 1].map(num => <div key={num} className="segment-number">{num}</div>)}
          </div>

          {discAreaWidth > 0 && (
            <svg className="chart-svg-overlay">
              {dataPoints.map((point, index) => {
                if (index < dataPoints.length - 1) {
                  const nextPoint = dataPoints[index + 1];
                  return (
                    <line
                      key={`line-${index}`}
                      x1={getXPositionPixels(point.column)}
                      y1={getYPosition(point.value)}
                      x2={getXPositionPixels(nextPoint.column)}
                      y2={getYPosition(nextPoint.value)}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  );
                }
                return null;
              })}
              {dataPoints.map((point, index) => (
                <g key={`point-${index}`}>
                  <circle
                    cx={getXPositionPixels(point.column)}
                    cy={getYPosition(point.value)}
                    r="6"
                    fill={discColors[point.label]}
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx={getXPositionPixels(point.column)}
                    cy={getYPosition(point.value)}
                    r="8"
                    fill="transparent"
                    stroke={discColors[point.label]}
                    strokeWidth="2"
                    opacity={hoveredPoint === point ? 0.3 : 0}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
              {hoveredPoint && (
                <g>
                  <rect
                    x={getXPositionPixels(hoveredPoint.column) + 10}
                    y={getYPosition(hoveredPoint.value) - 35}
                    width="140"
                    height="45"
                    fill="white"
                    rx="8"
                    ry="8"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                  />
                  <text
                    x={getXPositionPixels(hoveredPoint.column) + 20}
                    y={getYPosition(hoveredPoint.value) - 18}
                    fill="#1e293b"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {hoveredPoint.label} - {hoveredPoint.fullName}
                  </text>
                  <text
                    x={getXPositionPixels(hoveredPoint.column) + 20}
                    y={getYPosition(hoveredPoint.value) - 2}
                    fill="#475569"
                    fontSize="10"
                    fontWeight="500"
                  >
                    Value: {hoveredPoint.originalValue}
                  </text>
                </g>
              )}
            </svg>
          )}
        </div>

        <div className="chart-bottom">
          <div className="bottom-spacer"></div>
          <div className="bottom-numbers">
            {segments.map((s, i) => <div key={i} className="bottom-number">{s.segment}</div>)}
          </div>
          <div className="bottom-label"><div className="bottom-label-text">Segment<br />Number</div></div>
        </div>

        <div className="chart-footer">
          <div className="footer-left">Appraiser</div>
          <div className="footer-right"><div className="footer-label-text">Classical<br />Pattern</div></div>
        </div>
      </div>
    </div>
  );
};

export default Graph;