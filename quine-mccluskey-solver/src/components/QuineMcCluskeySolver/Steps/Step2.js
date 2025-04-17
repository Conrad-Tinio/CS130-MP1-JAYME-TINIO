import React from 'react';
import { GoPencil } from "react-icons/go";

export default function Step2({ primeImplicants }) {
  return (
    <div>
      <h2 className="step-heading">
        <GoPencil className="step-icon" /> 
        Step 2: Finding Prime Implicants
        </h2>
      <p className="step-description">We combine terms that differ by exactly one bit position:</p>
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
    </div>
  );
}