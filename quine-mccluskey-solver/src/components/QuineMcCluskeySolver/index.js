import { useState } from 'react';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import {
  convertToBinary,
  groupByOnes,
  findPrimeImplicants,
  createPrimeImplicantChart,
  findEssentialPrimeImplicants,
  binaryToAlgebraic
} from '../../utils/quineUtils';
import './QuineMcCluskeySolver.css';

export default function QuineMcCluskeySolver() {
  const [minterms, setMinterms] = useState('');
  const [variables, setVariables] = useState('');
  const [maxterms, setMaxterms] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  // Reset to initial state
  const resetSolver = () => {
    setResults(null);
    setCurrentStep(0);
    setError('');
    setMaxterms([]);
  };

  // Solve using Quine-McCluskey algorithm
  const solveQuineMcCluskey = () => {
    resetSolver();
    
    try {
      // Validate inputs
      if (!minterms.trim()) {
        setError('Please enter minterms.');
        return;
      }
      
      if (!variables.trim()) {
        setError('Please enter variables.');
        return;
      }
      
      const mintermList = minterms.split(',').map(t => parseInt(t.trim(), 10));
      const variableList = variables.trim().split('');
      
      // Check for valid minterms
      if (mintermList.some(isNaN)) {
        setError('Invalid minterms. Please enter comma-separated numbers.');
        return;
      }
      
      // Check for consistent number of variables
      const numVars = variableList.length;
      const maxPossibleValue = Math.pow(2, numVars) - 1;
      
      if (mintermList.some(t => t < 0 || t > maxPossibleValue)) {
        setError(`With ${numVars} variables, minterms must be between 0 and ${maxPossibleValue}.`);
        return;
      }
      
      // For POS, we need maxterms (the complement of minterms)
      const allTerms = Array.from({ length: maxPossibleValue + 1 }, (_, i) => i);
      const maxtermList = allTerms.filter(t => !mintermList.includes(t));
      setMaxterms(maxtermList);
      
      // Step 1: Convert to binary and group by number of ones
      const binaryTerms = convertToBinary(maxtermList, numVars);
      const groups = groupByOnes(binaryTerms);
      
      // Step 2: Find prime implicants
      const primeImplicants = findPrimeImplicants(groups);
      
      // Step 3: Create prime implicant chart
      const chart = createPrimeImplicantChart(primeImplicants, maxtermList);
      
      // Step 4: Find essential prime implicants
      const essentialPIs = findEssentialPrimeImplicants(chart, maxtermList);
      
      // Step 5: Convert to algebraic form (POS)
      const algebraicTerms = essentialPIs.map(pi => {
          const posTermBinary = pi.term;
          return binaryToAlgebraic(posTermBinary, variableList.slice(0, numVars));
      });

      const posExpression = algebraicTerms.map(term => `(${term})`).join(' · ');
    
      // Set results for display
      setResults({
        groups,
        binaryTerms,
        primeImplicants,
        chart,
        essentialPIs,
        posExpression,
        numVars,
        variableList
      });
      
      // Start at step 1
      setCurrentStep(1);
      
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className="solver-container">
      <h1 className="solver-title">Quine-McCluskey Solver (POS Form)</h1>
      
      <InputSection 
        minterms={minterms}
        setMinterms={setMinterms}
        variables={variables} 
        setVariables={setVariables}
        solveQuineMcCluskey={solveQuineMcCluskey}
      />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {results && (
        <ResultsDisplay
          results={results}
          maxterms={maxterms}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
    </div>
  );
}