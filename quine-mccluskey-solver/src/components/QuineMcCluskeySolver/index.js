import { useState } from 'react';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import {
  convertMaxtermsToBinary,
  groupByOnes,
  findPrimeImplicants,
  createPrimeImplicantChart,
  findEssentialPrimeImplicants,
  binaryToAlgebraic
} from '../../utils/quineUtils';
import './QuineMcCluskeySolver.css';

export default function QuineMcCluskeySolver() {
  // Initialize the constants to be used 
  const [minterms, setMinterms] = useState('');         // Stores the user input for minterms (e.g. 1,2,3)
  const [variables, setVariables] = useState('');       // Stores the user input for variables (e.g. ABC)
  const [maxterms, setMaxterms] = useState([]);         // Stores the calculated maxterms (the complement of the minterms)
  const [currentStep, setCurrentStep] = useState(0);    // Stores the current step of the process (from 0-5 based on our whole implementation)
  const [results, setResults] = useState(null);         // Stores the calculated results based on the Quine-McCluskey Algorithm
  const [error, setError] = useState('');               // Stores the error messages for invalid inputs or actions
  
  // Reset Function: Clears the results only
  const resetSolver = () => {
    setResults(null);
    setCurrentStep(0);
    setError('');
    setMaxterms([]);
  };

  // Clear Function: Clears the inputs only
  const clearInput = () => {
    setMinterms(''); 
    setVariables('');

    // If there are no inputs, print this error message
    if(!minterms.trim() && !variables.trim()) {
      setError('There is nothing to clear.')
    }
  };

  // New Function: Clears all inputs and results
  const newFunction = () => {
    setResults(null);
    setCurrentStep(0);
    setError('');
    setMaxterms([]);
    setMinterms(''); 
    setVariables('');
  }

  // Function for solving the Quine-McCluskey in (POS) Form
  const solveQuineMcCluskey = () => {
    resetSolver();
    
    try {
      // Validate the minterms input
      if (!minterms.trim()) {
        setError('Please enter minterms.');
        return;
      }
      
      // Validate the variables input
      if (!variables.trim()) {
        setError('Please enter variables.');
        return;
      }
      
      // Splits the user minterm inputs separated by commas into an array of strings
      // The map then iterates through each term from the array (from the splitting)
      // Each of the term is is them trimmed off any trailing whitespaces and converted to an integer of base 10
      const mintermList = minterms.split(',').map(term => parseInt(term.trim(), 10));

      // Splits the user variable inputs trims leading/trailing whitespaces
      // The split strings are then stored in an array
      const variableList = variables.trim().split('');
      
      // Check for valid minterms
      if (mintermList.some(isNaN)) {
        setError('Invalid minterms. Please enter comma-separated numbers.');
        return;
      }
      
      // Variable Consistency: This block checks if the minterms are within the valid range of the variables
      // This applies the concept of: with n variables, we are expected to have [2^n - 1] valid minterms
      const numVars = variableList.length;
      const maxPossibleValue = Math.pow(2, numVars) - 1;
      if (mintermList.some(t => t < 0 || t > maxPossibleValue)) {
        setError(`With ${numVars} variables, minterms must be between 0 and ${maxPossibleValue}.`);
        return;
      }
      
      // NOTE: For the POS Form, we need to get the Maxterms (complement of the Minterms)
      const allTerms = Array.from({ length: maxPossibleValue + 1 }, (_, i) => i);   // Creates an array of all the possible terms 
      const maxtermList = allTerms.filter(term => !mintermList.includes(term));     // Filters all the terms by EXCLUDING minterms
      setMaxterms(maxtermList);                                                     // Stores the maxterms 
      
      // Step 1: Convert to binary and group by number of ones
      const binaryTerms = convertMaxtermsToBinary(maxtermList, numVars);
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
        resetSolver={resetSolver}
        clearInput={clearInput}
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
          newFunction={newFunction}
        />
      )}
    </div>
  );
}