import React from 'react';
import { FaPlay, FaEraser, FaUndo } from 'react-icons/fa'; // Importing icons from Font Awesome

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
          <FaPlay className="icon" /> Solve
        </button>

        <button
          onClick={clearInput}
          className="clear-button">
          <FaEraser className="icon" /> Clear
        </button>
        
        <button
          onClick={resetSolver}
          className="reset-button">
          <FaUndo className="icon" /> Reset
        </button>
      </div>
    </div>
  );
}