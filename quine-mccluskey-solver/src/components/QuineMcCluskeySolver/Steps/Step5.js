import React from 'react';
import { FaCheck } from "react-icons/fa6"; // Using checkmark icon for the final step

// Final step that showcases the minimized boolean expression
export default function Step5({ posExpression, isTautology }) {
  return (
    <div>
      {/* Step header with checkmark icon */}
      <h2 className="step-heading">
        <FaCheck className="step-icon" />
        Step 5: Minimized POS Expression
      </h2>
      
      {isTautology ? (
        <p className="step-description">
          <strong>This is a special case of Tautology.</strong> All possible minterms are selected, 
          resulting in a function that is always true (1) regardless of input values.
        </p>
      ) : (
        <p className="step-description">For Product of Sums (POS), we take the complement of each term in the prime implicants:</p>
      )}
      
      {/* Box containing the final expression */}
      <div className="result-expression">
        <p className="font-medium">Minimized Boolean Expression (POS):</p>
        {/* Shows the expression or '1' if empty */}
        <p className="expression-text">{posExpression || '1'}</p>
      </div>
      
      {/* Explanation of POS notation for clarity */}
      <p className="note-text">
        Reminder: In Product of Sums (POS) form, each term is a sum (OR) of literals, and these terms are multiplied (AND) together.
        The expression is in the form: (A+B+C)·(D+E+F)·...
      </p>
    </div>
  );
}