import React from 'react';
import { FaCheck } from "react-icons/fa6"; // Using checkmark icon for the final step

// Final step that showcases the minimized boolean expression
export default function Step5({ posExpression, results }) {
  const isTautology = results?.isTautology;

  return (
    <div>
      <h2 className="step-heading">
        <FaCheck className="step-icon" />
        Step 5: Minimized POS Expression
      </h2>
      
      {isTautology ? (
        <p className="step-description">This is a case of Tautology. The function is always true for all input combinations.</p>
      ) : (
        <p className="step-description">For Product of Sums (POS), we take the complement of each term in the prime implicants:</p>
      )}
      
      <div className="result-expression">
        <p className="font-medium">Minimized Boolean Expression (POS):</p>
        <p className="expression-text">{posExpression || '1'}</p>
      </div>
      
      {isTautology ? (
        <p className="note-text">
          Note: When all minterms are included, the function equals 1 (TRUE) for all possible input combinations, resulting in a tautology.
        </p>
      ) : (
        <p className="note-text">
          Note: In POS form, each term is a sum (OR) of literals, and these terms are multiplied (AND) together.
          The expression is in the form: (A+B+C)·(D+E+F)·...
        </p>
      )}
    </div>
  );
}