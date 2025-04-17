import React from 'react';
import { GoPencil } from "react-icons/go";

export default function Step4({ essentialPIs }) {
  return (
    <div>
      <h2 className="step-heading">
        <GoPencil className="step-icon" /> 
        Step 4: Essential Prime Implicants
        </h2>
      <p className="step-description">Essential prime implicants are those that uniquely cover at least one maxterm:</p>
      <div className="table-container">
        <table className="full-width-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Essential Prime Implicant</th>
              <th className="table-cell">Binary Representation</th>
              <th className="table-cell">Covers Maxterms</th>
            </tr>
          </thead>
          <tbody>
            {essentialPIs.map((pi, idx) => (
              <tr key={idx}>
                <td className="table-cell">{`EPI-${idx + 1}`}</td>
                <td className="table-cell font-mono">{pi.term}</td>
                <td className="table-cell">{pi.decimals.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}