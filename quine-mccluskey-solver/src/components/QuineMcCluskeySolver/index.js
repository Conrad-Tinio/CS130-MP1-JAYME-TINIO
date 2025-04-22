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
  
  // Maximum allowed variables (10)
  const MAX_VARIABLES = 10;
  
  // Reset Function: Clears the results only
  const resetSolver = () => {
    setResults(null)
    setCurrentStep(0);
    setError('');
    setMaxterms([]);
  };

  // [MODIFIED] Clear Function: Clears the inputs only
  // Changed formatting of if else statements and function calls
  // Added an additional setError('') to clear the setError('') function
  const clearInput = () => {
    // Clear input fields and show error if already empty
    if (!minterms.trim() && !variables.trim()) {
      setError('There is nothing to clear.');
      return;
    }
    
    setMinterms(''); 
    setVariables('');
    setError('');
  };

  // [MODIFIED] New Function: Clears all inputs and results
  // added resetSolver('') function since other functions before modified version are covered here
  const newFunction = () => {
    // Reset everything - both inputs and solver state
    resetSolver(); 
    setMinterms('');
    setVariables('');
  }

  //[MODIFIED] - see inner comments for modifications
  const solveQuineMcCluskey = () => {
    resetSolver(); // Clear any previous results
    
    try {
      // ======================
      // 1. INPUT VALIDATION
      // ======================
      if (!minterms.trim()) {
        setError('Please enter minterms.');
        return;
      }
  
      if (!variables.trim()) {
        setError('Please enter variables.');
        return;
      }

      const validMinterms = /^[\d,]+$/;
      if (!validMinterms.test(minterms.trim())) {
        setError("Minterms should only be valid integers and no spaces.");
        return;
      }

      const validVariables = /^[\A-Za-z]+$/;
      if (!validVariables.test(variables.trim())) {
        setError("Variables should only be valid English alphabet letters and no spaces.");
        return;
      }
  
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
  
      // Parse and validate minterms
      const mintermList = minterms.split(',')
        .map(term => parseInt(term.trim(), 10))
        .filter(term => !isNaN(term)); // [MODIFICATION] - added functionality to remove NaN values
  
      if (mintermList.length === 0) { // [MODIFICATION] - came from some(isNaN), changed to length === 0 for clarity
        setError('Invalid minterms. Please enter comma-separated numbers.');
        return;
      }
  
      // ======================
      // 2. MAXTERM CALCULATION
      // ======================
      const numVars = variableList.length;
      const maxPossibleValue = Math.pow(2, numVars) - 1;
      
      // Check minterm range validity
      if (mintermList.some(t => t < 0 || t > maxPossibleValue)) {
        setError(`With ${numVars} variables, minterms must be between 0 and ${maxPossibleValue}.`);
        return;
      }
  
      // Calculate maxterms (complement of minterms)
      const allTerms = Array.from({ length: maxPossibleValue + 1 }, (_, i) => i);
      const maxtermList = allTerms.filter(term => !mintermList.includes(term));
      setMaxterms(maxtermList);
  
      // ======================
      // 3. QUINE-MCCLUSKEY ALGORITHM STEPS
      // ======================

      //[MODIFICATION]: removed intermediate variable posTermBinary
      // Step 1: Convert to binary and group by number of ones
      const binaryTerms = convertMaxtermsToBinary(maxtermList, numVars);
      const groups = groupByOnes(binaryTerms);
      
      // Step 2: Find prime implicants
      const primeImplicants = findPrimeImplicants(groups);
      
      // Step 3: Create prime implicant chart
      const chart = createPrimeImplicantChart(primeImplicants, maxtermList);
      
      // Step 4: Find essential prime implicants
      const essentialPIs = findEssentialPrimeImplicants(chart, maxtermList);
      
      // Step 5: Convert to algebraic POS form
      const algebraicTerms = essentialPIs.map(pi => (
        binaryToAlgebraic(pi.term, variableList.slice(0, numVars))
      ));
      const posExpression = algebraicTerms.map(term => `(${term})`).join(' · ');
  
      // ======================
      // 4. STORE RESULTS
      // ======================
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
      
      setCurrentStep(1); // Begin with step 1 displayed
      
    } catch (err) { //[MODIFICATION] - added try-catch block for easier debugging
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