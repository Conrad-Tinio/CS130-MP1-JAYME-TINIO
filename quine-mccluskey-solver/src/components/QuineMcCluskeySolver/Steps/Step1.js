import React from 'react';
import { GoPencil } from "react-icons/go";

export default function Step1({ groups }) {
  return (
    <div>
      <h2 className="step-heading">
        <GoPencil className="step-icon" /> 
        Step 1: Grouping Minterms by Number of Ones
      </h2>
      <div className="table-container">
        <table className="full-width-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Group (# of 1's)</th>
              <th className="table-cell">Minterm</th>
              <th className="table-cell">Binary</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groups).map(([groupKey, terms]) => (
              terms.map((term, idx) => (
                <tr key={`${groupKey}-${idx}`}>
                  {idx === 0 ? (
                    <td className="table-cell font-medium" rowSpan={terms.length}>
                      {groupKey}
                    </td>
                  ) : null}
                  <td className="table-cell">{term.decimal}</td>
                  <td className="table-cell font-mono">{term.binary}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}