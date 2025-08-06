import React, { useRef, useEffect, useState } from 'react';
import { discRanges } from '../../disc_chart';
import './Graph.css';

/**
 * Scalable Graph Component
 * 
 * To control the chart size, set CSS custom properties on the parent container:
 * 
 * .my-chart-container {
 *   --chart-width: 800px;
 *   --chart-height: 600px;
 *   --chart-scale: 1.5; // Optional: override scale factor
 * }
 * 
 * Or set them directly on the chart-container class:
 * .chart-container {
 *   --chart-width: 400px;
 *   --chart-height: 300px;
 * }
 * 
 * The component automatically scales all elements proportionally based on the width.
 * All CSS properties and SVG elements scale proportionally without distortion.
 */

const Graph = ({ chartData, chartType, segno }) => {
  const discGridRef = useRef(null);
  const [discAreaWidth, setDiscAreaWidth] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeGraphType, setActiveGraphType] = useState('III'); // Default to Graph III

  // DiSC colors - professional and clean
  const discColors = {
    'D': '#dc2626', // Professional red for Dominance
    'I': '#ea580c', // Professional orange for Influence  
    'S': '#16a34a', // Professional green for Steadiness
    'C': '#2563eb'  // Professional blue for Conscientiousness
  };

  const discFullNames = {
    'D': 'Dominance',
    'I': 'Influence',
    'S': 'Steadiness', 
    'C': 'Conscientiousness'
  };

  // Graph type options
  const graphTypes = ['I', 'II', 'III'];

  // Handle graph type toggle
  const handleGraphToggle = (graphType) => {
    setActiveGraphType(graphType);
  };

  // Calculate the width of the main DISC grid area dynamically
  useEffect(() => {
    const updateWidth = () => {
      if (discGridRef.current) {
        // The total width of the parent div containing left column, DISC columns, and right column
        const totalContainerWidth = discGridRef.current.offsetWidth;
        const leftColumnWidth = 64; // w-16
        const rightColumnWidth = 64; // w-16
        // The actual width available for the 4 DISC columns
        setDiscAreaWidth(totalContainerWidth - leftColumnWidth - rightColumnWidth);
      }
    };

    updateWidth(); // Set initial width

    // Add resize observer for responsiveness
    const resizeObserver = new ResizeObserver(updateWidth);
    const currentRef = discGridRef.current; // Copy ref to variable
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  // For now, use the same difference data for all graphs
  // We'll implement different chart data logic later
  const finalData = chartData.differences || chartData;
  console.log(finalData);
  console.log(chartData.mostCounts);
  console.log(chartData.leastCounts);
  const chartLabels = ['D', 'I', 'S', 'C'];
  const chartTooltips = ['Dominance', 'Influence', 'Steadiness', 'Conscientiousness'];
  
  // Function to get segment for a given value and DiSC type
  const getSegmentForValue = (value, discType) => {
    // Map uppercase labels to lowercase for discRanges lookup
    const discTypeMap = {
      'D': 'D',
      'I': 'i', // discRanges uses lowercase 'i'
      'S': 'S', 
      'C': 'C'
    };
    const lookupType = discTypeMap[discType];
    const ranges = discRanges[lookupType];
    if (!ranges) return null;
    const found = ranges.find(r => value >= r.min && value <= r.max);
    return found ? found.segment : null;
  };
  
  // Calculate segments for each DiSC type
  const segments = finalData.map((value, idx) => {
    const discType = chartLabels[idx];
    const segment = getSegmentForValue(value, discType);
    console.log(`DiSC Type: ${discType}, Value: ${value}, Segment: ${segment}`);
    return {
      value,
      segment: segment,
      label: chartLabels[idx],
      tooltip: chartTooltips[idx]
    };
  });

  // Convert segment number (1-7) to intensity value (1-28)
  function getIntensityFromSegment(segmentValue) {
    // Each segment spans 4 intensity levels
    // Segment 7: 25-28, Segment 6: 21-24, Segment 5: 17-20, 
    // Segment 4: 13-16, Segment 3: 9-12, Segment 2: 5-8, Segment 1: 1-4
    const segmentRanges = {
      7: [25, 28],
      6: [21, 24], 
      5: [17, 20],
      4: [13, 16],
      3: [9, 12],
      2: [5, 8],
      1: [1, 4]
    };
    
    const range = segmentRanges[segmentValue];
    if (!range) return 14.5; // fallback to middle
    
    // Return the middle of the range
    return (range[0] + range[1]) / 2;
  }

  // Calculate Y position based on intensity value (1-28)
  const getYPosition = (intensityValue) => {
    // Each row is 20px (h-5 = 1.25rem = 20px)
    const rowHeight = 20;
    const totalRows = 28;
    
    // Intensity 28 should be at the top (row 0), intensity 1 at bottom (row 27)
    // Ensure proper alignment with segment numbers and prevent overlap with bottom section
    const rowIndex = totalRows - intensityValue;
    const yPosition = rowIndex * rowHeight + (rowHeight / 2);
    
    // Ensure the position stays within the grid bounds (increased to 580px)
    return Math.max(10, Math.min(570, yPosition));
  };

  // Calculate X position for each DISC column in pixels for SVG
  // This function now uses the dynamically calculated discAreaWidth
  const getXPositionPixels = (column) => {
    const leftColumnWidth = 64; // Corresponds to w-16
    const singleDiscColumnWidth = discAreaWidth / 4;

    // X position is relative to the start of the entire grid container
    return leftColumnWidth + (column * singleDiscColumnWidth) + (singleDiscColumnWidth / 2);
  };

  // Convert segment values to intensity values (1-28 scale)
  const dataPoints = segments.map((segment, column) => ({
    column,
    value: getIntensityFromSegment(segment.segment || 4),
    label: segment.label,
    fullName: discFullNames[segment.label],
    segment: segment.segment,
    originalValue: segment.value
  }));

  // Parse segno to extract individual digits
  const parseSegno = (segno) => {
    if (!segno) return [];
    // Convert to string and split into individual digits
    const digits = segno.toString().replace(/[^0-9]/g, '').split('');
    return digits.slice(0, 4); // Take first 4 digits
  };

  const segmentNumbers = parseSegno(segno);

  return (
    <>
      <div className="chart-container">
        {/* Header with Graph Toggle */}
        <div className="chart-header">
          <div className="chart-header-toggle">
            {graphTypes.map((graphType) => (
              <button
                key={graphType}
                className={`graph-toggle-btn ${activeGraphType === graphType ? 'active' : ''}`}
                onClick={() => handleGraphToggle(graphType)}
              >
                Graph {graphType}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content container */}
        <div className="chart-main-content">
          {/* Column headers */}
          <div className="chart-headers">
            {/* Left intensity column */}
            <div className="intensity-header">
              <div className="header-text">INTENSITY</div>
            </div>
            
            {/* DISC columns */}
            <div className="disc-headers">
              {chartLabels.map((letter, index) => (
                <div key={letter} className="disc-header">
                  <div className="disc-header-text">{letter}</div>
                </div>
              ))}
            </div>
            
            {/* Right segment column */}
            <div className="segment-header">
              <div className="header-text">SEGMENT</div>
            </div>
          </div>

          {/* Grid area with numbers */}
          <div ref={discGridRef} className="chart-grid-area">
            {/* Left intensity numbers */}
            <div className="intensity-numbers">
              {Array.from({length: 28}, (_, i) => (
                <div key={i} className="intensity-number">
                  {28 - i}
                </div>
              ))}
            </div>
            
            {/* DISC grid columns */}
            <div className="disc-grid">
              {/* D Column */}
              <div className="disc-column">
                {Array.from({length: 28}, (_, i) => (
                  <div key={i} className="grid-cell-new"></div>
                ))}
              </div>
              
              {/* I Column */}
              <div className="disc-column">
                {Array.from({length: 28}, (_, i) => (
                  <div key={i} className="grid-cell-new"></div>
                ))}
              </div>
              
              {/* S Column */}
              <div className="disc-column">
                {Array.from({length: 28}, (_, i) => (
                  <div key={i} className="grid-cell-new"></div>
                ))}
              </div>
              
              {/* C Column */}
              <div className="disc-column">
                {Array.from({length: 28}, (_, i) => (
                  <div key={i} className="grid-cell-new"></div>
                ))}
              </div>
            </div>
            
            {/* Right segment numbers */}
            <div className="segment-numbers">
              {[7, 6, 5, 4, 3, 2, 1].map((segmentNum) => (
                <div key={segmentNum} className="segment-number">
                  {segmentNum}
                </div>
              ))}
            </div>

            {/* Line graph overlay */}
            {discAreaWidth > 0 && ( // Only render SVG if width is calculated
              <svg className="chart-svg-overlay">
                {/* Draw lines between points */}
                {dataPoints.map((point, index) => {
                  if (index < dataPoints.length - 1) {
                    const nextPoint = dataPoints[index + 1];
                    return (
                      <line
                        key={index}
                        x1={getXPositionPixels(point.column)}
                        y1={getYPosition(point.value)}
                        x2={getXPositionPixels(nextPoint.column)}
                        y2={getYPosition(nextPoint.value)}
                        stroke="#94a3b8" // Light gray for connecting lines
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    );
                  }
                  return null;
                })}
                
                {/* Draw dots at data points */}
                {dataPoints.map((point, index) => (
                  <g key={index}>
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
                    {/* Hover effect - larger circle */}
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
                
                {/* Tooltip */}
                {hoveredPoint && (
                  <g>
                    {/* Tooltip background */}
                    <rect
                      x={getXPositionPixels(hoveredPoint.column) + 10}
                      y={getYPosition(hoveredPoint.value) - 50}
                      width="160"
                      height="70"
                      fill="rgba(0, 0, 0, 0.95)"
                      rx="8"
                      ry="8"
                    />
                    {/* Tooltip text */}
                    <text
                      x={getXPositionPixels(hoveredPoint.column) + 20}
                      y={getYPosition(hoveredPoint.value) - 30}
                      fill="white"
                      fontSize="13"
                      fontWeight="bold"
                    >
                      {hoveredPoint.label} - {hoveredPoint.fullName}
                    </text>
                    <text
                      x={getXPositionPixels(hoveredPoint.column) + 20}
                      y={getYPosition(hoveredPoint.value) - 15}
                      fill="white"
                      fontSize="11"
                    >
                      Segment: {hoveredPoint.segment}
                    </text>
                    <text
                      x={getXPositionPixels(hoveredPoint.column) + 20}
                      y={getYPosition(hoveredPoint.value)}
                      fill="white"
                      fontSize="11"
                    >
                      Value: {hoveredPoint.originalValue}
                    </text>
                    <text
                      x={getXPositionPixels(hoveredPoint.column) + 20}
                      y={getYPosition(hoveredPoint.value) + 15}
                      fill="white"
                      fontSize="11"
                    >
                      Intensity: {Math.round(hoveredPoint.value)}
                    </text>
                  </g>
                )}
              </svg>
            )}
          </div>

          {/* Bottom section with values */}
          <div className="chart-bottom">
            {/* Left spacer */}
            <div className="bottom-spacer"></div>
            
            {/* Numbers row */}
            <div className="bottom-numbers">
              {segments.map((segment, index) => (
                <div key={index} className="bottom-number">
                  {segment.segment || 0}
                </div>
              ))}
            </div>
            
            {/* Right section */}
            <div className="bottom-label">
              <div className="bottom-label-text">
                Segment<br/>Number
              </div>
            </div>
          </div>

          {/* Footer labels */}
          <div className="chart-footer">
            <div className="footer-left">
              Appraiser
            </div>
            <div className="footer-right">
              <div className="footer-label-text">
                Classical<br/>Pattern
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Segment Numbers Section - Outside the chart container */}
     
    </>
  );
};

export default Graph; 