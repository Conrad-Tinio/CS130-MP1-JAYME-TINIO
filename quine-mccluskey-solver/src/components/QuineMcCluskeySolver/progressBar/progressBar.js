//[NEW] - Progress bar component

import React from 'react';

export default function ProgressBar({ currentStep, totalSteps = 5 }) {
  // Calculates progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Defines neon colors (same colors sa step3)
  const NEON_PURPLE = '#d8b4fe';
  const NEON_GLOW = '0 0 5px #d8b4fe, 0 0 10px #d8b4fe';
  
  return (
    <div className="progress-bar-container">
      <div className="progress-steps">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div 
            key={index} 
            className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
            style={{
              backgroundColor: index + 1 <= currentStep ? NEON_PURPLE : '#4c1d95', // Gives off darker purple for inactive
              boxShadow: index + 1 <= currentStep ? NEON_GLOW : 'none',
              color: index + 1 <= currentStep ? '#4c1d95' : '#f3f4f6', // Lighter color for text on dark background
              border: index + 1 <= currentStep ? 'none' : '2px solid #d8b4fe', // Lighter border for inactive steps
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div 
        className="progress-bar-track"
        style={{ borderColor: NEON_PURPLE }}
      >
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: NEON_PURPLE,
            boxShadow: NEON_GLOW
          }}
        />
      </div>
    </div>
  );
}