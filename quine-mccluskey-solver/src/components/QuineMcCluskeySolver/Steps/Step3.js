import React from 'react';
import { GoPencil } from "react-icons/go";

export default function Step3({ chart = {}, maxterms = [] }) {
  // Dynamic styles (colors, widths)
  const NEON_PURPLE = '#d8b4fe';
  const NEON_GLOW = '0 0 5px #d8b4fe, 0 0 10px #d8b4fe';
  
  return (
    <div>
      <h2 className="step-heading">
        <GoPencil className="step-icon" /> 
        Step 3: Prime Implicant Chart
        </h2>
      <p className="step-description">This chart shows which maxterms are covered by each prime implicant:</p>
      
      <div 
        className="chart-outer-container"
        style={{ borderColor: NEON_PURPLE, boxShadow: NEON_GLOW }}
      >
        <div className="chart-container">
          {/* Header Row */}
          <div className="chart-header-row">
            <div className="chart-header-empty"></div>
            {(maxterms || []).map((mt, idx) => (
              <div 
                key={idx} 
                className="chart-header-number"
              >
                {mt}
              </div>
            ))}
          </div>
          
          {/* Implicant Grid */}
          <div className="implicant-grid">
            {Object.entries(chart || {}).map(([binary, pi], rowIdx) => (
              <div 
                key={rowIdx} 
                className="implicant-row"
              >
                <div className="binary-cell">
                  <span className="font-mono">{binary}</span>
                </div>
                
                {(maxterms || []).map((mt, colIdx) => {
                  const hasX = pi?.covers?.[mt];
                  return (
                    <div 
                      key={colIdx} 
                      className={`chart-cell ${hasX ? 'dashed-border' : 'solid-border'}`}
                      style={{ 
                        borderColor: NEON_PURPLE,
                        boxShadow: hasX ? NEON_GLOW : 'none',
                      }}
                    >
                      {hasX ? (
                        <span 
                          className="x-mark"
                          style={{ color: NEON_PURPLE, textShadow: NEON_GLOW }}
                        >
                          X
                        </span>
                      ) : (
                        <span style={{ visibility: 'hidden' }}>X</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}