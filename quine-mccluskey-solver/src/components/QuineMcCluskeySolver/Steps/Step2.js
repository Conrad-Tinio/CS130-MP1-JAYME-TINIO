import React, { useState } from 'react';
import { GoPencil } from "react-icons/go";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Shows all the prime implicants found in the algorithm with iterations
export default function Step2({ primeImplicants, iterations = [] }) {
  const [currentIteration, setCurrentIteration] = useState(0);
  const totalIterations = iterations.length;
  
  // Handles navigation between iterations
  const nextIteration = () => {
    if (currentIteration < totalIterations - 1) {
      setCurrentIteration(currentIteration + 1);
    }
  };
  
  const prevIteration = () => {
    if (currentIteration > 0) {
      setCurrentIteration(currentIteration - 1);
    }
  };
  
  return (
    <div>
      {/* Step header */}
      <h2 className="step-heading">
        <GoPencil className="step-icon" /> 
        Step 2: Finding Prime Implicants
      </h2>
      
      {/* Brief explanation of step */}
      <p className="step-description">We combine terms that differ by exactly one bit position:</p>
      
      {/* Iteration navigation if we have tracked iterations */}
      {iterations && iterations.length > 0 && (
        <div className="step-navigation" style={{ marginBottom: '1rem' }}>
          <div className="button-wrapper">
            <button
              onClick={prevIteration}
              disabled={currentIteration === 0}
              className={`nav-button ${currentIteration === 0 ? 'nav-button-disabled' : 'nav-button-enabled'}`}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaArrowLeft size={14} style={{ display: 'inline-block', marginRight: '8px' }} /> Prev Iteration
              </span>
            </button>
          </div>
          <div className="step-counter">Iteration {currentIteration + 1} of {totalIterations}</div>
          <div className="button-wrapper">
            <button
              onClick={nextIteration}
              disabled={currentIteration >= totalIterations - 1}
              className={`nav-button ${currentIteration >= totalIterations - 1 ? 'nav-button-disabled' : 'nav-button-enabled'}`}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Next Iteration <FaArrowRight size={14} style={{ display: 'inline-block', marginLeft: '8px' }} />
              </span>
            </button>
          </div>
        </div>
      )}
      
      {iterations && iterations.length > 0 ? (
        <>
          {/* Groups in this iteration */}
          <div className="visualization-container" style={{ marginBottom: '1.5rem' }}>
            <h3 className="chart-title">Groups in Iteration {currentIteration + 1}</h3>
            <div className="table-container">
              <table className="full-width-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell">Group (# of 1's)</th>
                    <th className="table-cell">Binary Representation</th>
                    <th className="table-cell">Covers Minterms</th>
                    <th className="table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(iterations[currentIteration].groups).map(([groupKey, terms]) => (
                    terms.map((term, idx) => {
                      // Check if this term was marked (used in combination)
                      const isMarked = iterations[currentIteration].markedTerms.some(
                        m => JSON.stringify(m) === JSON.stringify(term)
                      );
                      
                      // Check if this term became a prime implicant in this iteration
                      const isPrimeImplicant = iterations[currentIteration].primeImplicants.some(
                        pi => pi.binary === term.binary
                      );
                      
                      return (
                        <tr key={`${groupKey}-${idx}`}>
                          {idx === 0 ? (
                            <td className="table-cell font-medium" rowSpan={terms.length}>
                              {groupKey}
                            </td>
                          ) : null}
                          <td className="table-cell font-mono">{term.binary}</td>
                          <td className="table-cell">{(term.decimals || [term.decimal]).join(', ')}</td>
                          <td className="table-cell">
                            {isPrimeImplicant ? (
                              <span style={{ color: '#4ade80' }}>Prime Implicant</span>
                            ) : isMarked ? (
                              <span style={{ color: '#f59e0b' }}>Combined</span>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* New combinations formed */}
          {currentIteration < totalIterations - 1 && Object.keys(iterations[currentIteration].newGroups).length > 0 && (
            <div className="visualization-container" style={{ marginBottom: '1.5rem' }}>
              <h3 className="chart-title">New Combinations for Next Iteration</h3>
              <div className="table-container">
                <table className="full-width-table">
                  <thead>
                    <tr className="table-header">
                      <th className="table-cell">Group (# of 1's)</th>
                      <th className="table-cell">Combined Binary</th>
                      <th className="table-cell">Covers Minterms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(iterations[currentIteration].newGroups).map(([groupKey, terms]) => (
                      terms.map((term, idx) => (
                        <tr key={`new-${groupKey}-${idx}`}>
                          {idx === 0 ? (
                            <td className="table-cell font-medium" rowSpan={terms.length}>
                              {groupKey}
                            </td>
                          ) : null}
                          <td className="table-cell font-mono">{term.binary}</td>
                          <td className="table-cell">{term.decimals.join(', ')}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Prime implicants found in this iteration */}
          {iterations[currentIteration].primeImplicants.length > 0 && (
            <div className="visualization-container">
              <h3 className="chart-title">Prime Implicants Found in Iteration {currentIteration + 1}</h3>
              <div className="table-container">
                <table className="full-width-table">
                  <thead>
                    <tr className="table-header">
                      <th className="table-cell">Prime Implicant</th>
                      <th className="table-cell">Binary Representation</th>
                      <th className="table-cell">Covers Minterms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iterations[currentIteration].primeImplicants.map((pi, idx) => (
                      <tr key={`pi-${idx}`}>
                        <td className="table-cell">{`PI-${idx + 1}`}</td>
                        <td className="table-cell font-mono">{pi.binary}</td>
                        <td className="table-cell">{pi.decimals.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        // Fallback to show just the final prime implicants if iterations not available
        <div className="table-container">
          <table className="full-width-table">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Prime Implicant</th>
                <th className="table-cell">Binary Representation</th>
                <th className="table-cell">Covers Minterms</th>
              </tr>
            </thead>
            <tbody>
              {primeImplicants.map((pi, idx) => (
                <tr key={idx}>
                  <td className="table-cell">{`PI-${idx + 1}`}</td>
                  <td className="table-cell font-mono">{pi.binary}</td>
                  <td className="table-cell">{pi.decimals.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}