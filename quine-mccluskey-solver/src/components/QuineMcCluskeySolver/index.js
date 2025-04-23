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
  // State variables
  const [minterms, setMinterms] = useState(''); // e.g. "1,2,3"
  const [variables, setVariables] = useState(''); // e.g. "ABC"
  const [maxterms, setMaxterms] = useState([]); // complement of minterms
  const [currentStep, setCurrentStep] = useState(0); // tracks which step to display
  const [results, setResults] = useState(null); // algorithm results
  const [error, setError] = useState(''); // error messages
  
  // Max number of variables to prevent performance issues
  const MAX_VARIABLES = 10;
  
  // Resets the results without touching inputs
  const resetSolver = () => {
    setResults(null);
    setCurrentStep(0);
    setError('');
    setMaxterms([]);
  };

  // Clears only the input fields
  const clearInput = () => {
    // Shows error if nothing to clear
    if (!minterms.trim() && !variables.trim()) {
      setError('There is nothing to clear.');
      return;
    }
    
    setMinterms(''); 
    setVariables('');
    setError(''); // clears any existing errors
  };

  // Puts a new function 
  const newFunction = () => {
    resetSolver(); 
    setMinterms('');
    setVariables('');
  }

  // Main solver function
  const solveQuineMcCluskey = () => {
    // Always start fresh
    resetSolver();
    
    try {
      // Ensures the inputs are correctly placed
      if (!minterms.trim()) {
        setError('Please enter minterms.');
        return;
      }

      if (!variables.trim()) {
        setError('Please enter variables.');
        return;
      }

      // Validates minterm format - numbers and commas only
      const validMinterms = /^[\d,]+$/;
      if (!validMinterms.test(minterms.trim())) {
        setError("Minterms should only be valid whole numbers and no spaces.");
        return;
      }

      // Only letters allowed for variables
      const validVariables = /^[\A-Za-z]+$/;
      if (!validVariables.test(variables.trim())) {
        setError("Variables should only be valid English alphabet letters and no spaces/commas.");
        return;
      }

      // Converts to uppercase and check for duplicates
      const variableList = variables.toUpperCase().trim().split('');
      const uniqueVariables = new Set(variableList); 
      if (uniqueVariables.size !== variableList.length) {
        setError("Variables shoud be unique. Please remove any duplicate letters.");
        return;
      }

      if (variableList.length > MAX_VARIABLES) {
        setError(`Too many variables. Maximum allowed is ${MAX_VARIABLES}.`);
        return;
      }

      // Processes minterms input into a numeric array
      const mintermList = minterms.split(',')
        .map(term => parseInt(term.trim(), 10))
        .filter(term => !isNaN(term)); // gets rid of any non-numbers

      const uniqueMinterms = new Set(mintermList)
      if (uniqueMinterms.size !== mintermList.length) {
        setError("Minterms shoud be unique. Please remove any duplicate numbers.");
        return;
      }

      // Makes sure that there are no invalid numbers
      if (mintermList.length === 0) {
        setError('Invalid minterms. Please enter comma-separated numbers.');
        return;
      }

      // Figures out what the maxterms should be
      const numVars = variableList.length;
      const maxPossibleValue = Math.pow(2, numVars) - 1;
      
      // Checks if all minterms are within valid range for the given number of variables
      if (mintermList.some(t => t < 0 || t > maxPossibleValue)) {
        setError(`With ${numVars} variables, minterms must be between 0 and ${maxPossibleValue}.`);
        return;
      }

      // NEW: Check if all possible minterms are selected (tautology case)
      const allPossibleMinterms = Array.from({ length: maxPossibleValue + 1 }, (_, i) => i);
      const isAllMintermsSelected = allPossibleMinterms.every(term => 
        mintermList.includes(term)
      );

      if (isAllMintermsSelected) {
        // Handle tautology case - create a simple result object with just the expression
        setResults({
          isTautology: true,
          posExpression: '1', // Tautology in POS form is just 1
          numVars,
          variableList
        });
        
        // Go directly to final step
        setCurrentStep(5);
        return;
      }

      // Generates the maxterms list (all possible values minus the minterms)
      const allTerms = Array.from({ length: maxPossibleValue + 1 }, (_, i) => i);
      const maxtermList = allTerms.filter(term => !mintermList.includes(term));
      setMaxterms(maxtermList);
      
      // Rest of your algorithm...
      // Step 1: Converts maxterms to binary and group them
      const binaryTerms = convertMaxtermsToBinary(maxtermList, numVars);
      const groups = groupByOnes(binaryTerms);
      
      // Step 2: Finds all prime implicants
      const primeImplicants = findPrimeImplicants(groups);
      
      // Step 3: Builds the prime implicant chart
      const chart = createPrimeImplicantChart(primeImplicants, maxtermList);
      
      // Step 4: Finds essential prime implicants 
      const essentialPIs = findEssentialPrimeImplicants(chart, maxtermList);
      
      // Step 5: Converts to readable algebraic form
      const algebraicTerms = essentialPIs.map(pi => (
        binaryToAlgebraic(pi.term, variableList.slice(0, numVars))
      ));
      // Joins with dot operator for POS form
      const posExpression = algebraicTerms.map(term => `(${term})`).join(' · ');

      // Stores everything for display
      setResults({
        groups,
        binaryTerms,
        primeImplicants,
        chart,
        essentialPIs,
        posExpression,
        numVars,
        variableList,
        isTautology: false
      });
      
      // Shows the first step by default
      setCurrentStep(1);
      
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
      console.error('Quine-McCluskey Error:', err);
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
      
      {/* Show errors if any */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Show results */}
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