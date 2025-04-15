import React from 'react';

export default function Step3({ chart, maxterms }) {
  return (
    <div>
      <h2 className="step-heading">Step 3: Prime Implicant Chart</h2>
      <p className="step-description">This chart shows which maxterms are covered by each prime implicant:</p>
      <div className="table-container">
        <table className="full-width-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Prime Implicant</th>
              {maxterms.map(mt => (
                <th key={mt} className="table-cell">{mt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(chart).map(([binary, pi], idx) => (
              <tr key={idx}>
                <td className="table-cell font-mono">{binary}</td>
                {maxterms.map(mt => (
                  <td key={mt} className="table-cell text-center">
                    {pi.covers[mt] ? '✓' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}