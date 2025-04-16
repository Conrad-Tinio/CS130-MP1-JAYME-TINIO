import React from 'react';

export default function InputSection({ 
  minterms, 
  setMinterms, 
  variables, 
  setVariables, 
  solveQuineMcCluskey, 
  resetSolver, 
  clearInput
}) {
  return (
    <div>
      <div className="input-grid">
        <div>
          <label className="input-label"> Minterms (comma separated) </label>
          <input
            type="text"
            value={minterms}
            onChange={(e) => setMinterms(e.target.value)}
            placeholder="e.g., 0,1,2,5"
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label"> Variables (one letter each) </label>
          <input
            type="text"
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder="e.g., ABCD"
            className="input-field"
          />
        </div>
      </div>
      
      <div className="button-container">
        <button
          onClick={solveQuineMcCluskey}
          className="solve-button">
          Solve
        </button>

        <button
          onClick={clearInput}
          className="clear-button">
          Clear
        </button>
        
        <button
          onClick={resetSolver}
          className="reset-button">
          Reset
        </button>

      </div>
    </div>
  );
}