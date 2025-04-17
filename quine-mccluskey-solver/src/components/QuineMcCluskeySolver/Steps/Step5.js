import React from 'react';
import { FaCheck } from "react-icons/fa6";

export default function Step5({ posExpression }) {
  return (
    <div>
      <h2 className="step-heading">
        <FaCheck className="step-icon" />
        Step 5: Minimized POS Expression
      </h2>
      <p className="step-description">For Product of Sums (POS), we take the complement of each term in the prime implicants:</p>
      
      <div className="result-expression">
        <p className="font-medium">Minimized Boolean Expression (POS):</p>
        <p className="expression-text">{posExpression || '1'}</p>
      </div>
      
      <p className="note-text">
        Note: In POS form, each term is a sum (OR) of literals, and these terms are multiplied (AND) together.
        The expression is in the form: (A+B+C)·(D+E+F)·...
      </p>
    </div>
  );
}