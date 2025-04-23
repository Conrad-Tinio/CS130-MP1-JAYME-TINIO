import React from 'react';
import { FaPlay, FaEraser, FaUndo } from 'react-icons/fa'; // Icons for our buttons

// Component for the input fields and control buttons
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
      {/* Input fields grid */}
      <div className="input-grid">
        {/* Minterms input */}
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
        
        {/* Variables input */}
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
      
      {/* Control buttons */}
      <div className="button-container">
        {/* Solve button - runs the algorithm */}
        <button
          onClick={solveQuineMcCluskey}
          className="solve-button">
          <FaPlay className="icon" /> Solve
        </button>

        {/* Clear button - empties the input fields */}
        <button
          onClick={clearInput}
          className="clear-button">
          <FaEraser className="icon" /> Clear
        </button>
        
        {/* Reset button - clears results but keeps inputs */}
        <button
          onClick={resetSolver}
          className="reset-button">
          <FaUndo className="icon" /> Reset
        </button>
      </div>
    </div>
  );
}