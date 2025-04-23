import React from 'react';
import { GoPencil } from "react-icons/go";
import { binaryToAlgebraic } from '../../../utils/quineUtils'; // needed for conversion

// shows the essential prime implicants - final terms for the minimal expression
export default function Step4({ essentialPIs, variableList }) {  // added variableList param
  return (
    <div>
      <h2 className="step-heading">
        <GoPencil className="step-icon" /> 
        Step 4: Essential Prime Implicants
      </h2>
      <p className="step-description">Essential prime implicants are those that uniquely cover at least one maxterm:</p>
      
      {/* table of essential PIs */}
      <div className="table-container">
        <table className="full-width-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Boolean Expression</th>
              <th className="table-cell">Binary Representation</th>
              <th className="table-cell">Covers Maxterms</th>
            </tr>
          </thead>
          <tbody>
            {essentialPIs.map((pi, idx) => {
              return (
                <tr key={idx}>
                  {/* use the actual variables from input instead of generating A,B,C */}
                  <td className="table-cell">{binaryToAlgebraic(pi.term, variableList)}</td>
                  <td className="table-cell font-mono">{pi.term}</td>
                  <td className="table-cell">{pi.decimals.join(', ')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}