import React, { useState } from 'react';
import Graph from './Graph/Graph';
import './ResultsPage/ResultsPage.css';

const DiSCChart = ({ chartData, segno }) => {
  const [activeGraph, setActiveGraph] = useState('III'); // Default to Graph III

  const handleGraphToggle = (graphType) => {
    setActiveGraph(graphType);
  };

  return (
    <div className="chart-card">
      <h2 className="chart-title">
        Your DiSC Style
         </h2>
      
      <Graph 
        chartData={chartData} 
        chartType={activeGraph} 
        segno={segno} 
      />
    </div>
  );
};

export default DiSCChart;