import React from 'react';
import { GoPencil } from "react-icons/go";

// Displays the prime implicant chart in a grid format
export default function Step3({ chart = {}, maxterms = [] }) {
  // Colors for the neon effect - matches our theme
  const NEON_PURPLE = '#d8b4fe';
  const NEON_GLOW = '0 0 5px #d8b4fe, 0 0 10px #d8b4fe';
  
  return (
    <div>
      <h2 className="step-heading">
        <GoPencil className="step-icon" /> 
        Step 3: Prime Implicant Chart
      </h2>
      <p className="step-description">This chart shows which maxterms are covered by each prime implicant:</p>
      
      {/* Main chart container with glowing border */}
      <div 
        className="chart-outer-container"
        style={{ borderColor: NEON_PURPLE, boxShadow: NEON_GLOW }}
      >
        <div className="chart-container">
          {/* Top row with maxterm numbers */}
          <div className="chart-header-row">
            <div className="chart-header-empty"></div>
            {/* Maps all maxterms across the top */}
            {(maxterms || []).map((mt, idx) => (
              <div 
                key={idx} 
                className="chart-header-number"
              >
                {mt}
              </div>
            ))}
          </div>
          
          {/* Grid rows - one for each prime implicant */}
          <div className="implicant-grid">
            {Object.entries(chart || {}).map(([binary, pi], rowIdx) => (
              <div 
                key={rowIdx} 
                className="implicant-row"
              >
                {/* Left column shows the binary pattern */}
                <div className="binary-cell">
                  <span className="font-mono">{binary}</span>
                </div>
                
                {/* Creates a cell for each maxterm column */}
                {(maxterms || []).map((mt, colIdx) => {
                  // Checks if this implicant covers this maxterm
                  const hasX = pi?.covers?.[mt];
                  
                  return (
                    <div 
                      key={colIdx} 
                      className={`chart-cell ${hasX ? 'dashed-border' : 'solid-border'}`}
                      style={{ 
                        borderColor: NEON_PURPLE,
                        // Adds glow effect only for covered cells
                        boxShadow: hasX ? NEON_GLOW : 'none',
                      }}
                    >
                      {/* Shows X for covered maxterms */}
                      {hasX ? (
                        <span 
                          className="x-mark"
                          style={{ color: NEON_PURPLE, textShadow: NEON_GLOW }}
                        >
                          X
                        </span>
                      ) : (
                        // Empty placeholder to maintain cell sizing
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