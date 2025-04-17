// Utility functions for Quine-McCluskey algorithm


// Convert maxterms to binary representation
// [MODIFIED] - Added input validation for debugging purposes
// Pre initialized decimals array
export const convertMaxtermsToBinary = (maxterms, numVars) => {
  if (!Array.isArray(maxterms)) throw new Error('Maxterms must be an array');
  if (typeof numVars !== 'number') throw new Error('numVars must be a number');
  
  return maxterms.map(term => {
    const binary = term.toString(2).padStart(numVars, '0');
    return { 
      decimal: term, 
      binary, 
      groupKey: countOnes(binary),
      decimals: [term] // Initialize decimals array for consistency
    };
  });
};

//[MODIFIED] - replaced filter.length() with reduce() which allows it to go directly to a string
export const countOnes = (binary) => {
  // Use reduce for cleaner counting
  return binary.split('').reduce((count, bit) => count + (bit === '1' ? 1 : 0), 0);
};

// [MODIFIED] - used reduce
export const groupByOnes = (terms) => {
  return terms.reduce((groups, term) => {
    const onesCount = term.groupKey;
    groups[onesCount] = groups[onesCount] || [];
    groups[onesCount].push(term);
    return groups;
  }, {});
};

//[MODIFIED] - throws an explicit error instead of -1
// Uses reduce to allow for better implementation
export const checkDifferingBits = (string1, string2) => {
  // Early return with explicit error if lengths differ
  if (string1.length !== string2.length) {
    throw new Error('Strings must be of equal length for Hamming distance calculation');
  }
  
  return string1.split('').reduce((differentBits, bit, i) => 
    differentBits + (bit !== string2[i] ? 1 : 0), 0);
};

//[MODIFIED] - Refer to modified comments below for changes
export const findPrimeImplicants = (groups) => {
  const markedTerms = new Set();  
  const primeImplicants = [];
  const newGroups = {};
  let combined = false;

  //[MODIFIED] - changed numeric sorting to explicit numeric sorting
  const groupKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < groupKeys.length - 1; i++) {
    const currentKey = groupKeys[i];
    const nextKey = groupKeys[i + 1];
    
    if (nextKey - currentKey !== 1) continue; // [MODIFIED] - Added short circuit with continue
    
    newGroups[currentKey] = newGroups[currentKey] || []; // [MODIFIED] - changed group initialization to || []
    
    //[MODIFIED] - changed to for...of loops
    for (const currentTerm of groups[currentKey]) {
      for (const nextTerm of groups[nextKey]) {
        if (checkDifferingBits(currentTerm.binary, nextTerm.binary) === 1) {
          combined = true;
          //[MODIFIED] - Explicitly showing JSON.stringify
          markedTerms.add(JSON.stringify(currentTerm));
          markedTerms.add(JSON.stringify(nextTerm));
          
          const combinedBinary = currentTerm.binary
            .split('')
            .map((bit, idx) => bit !== nextTerm.binary[idx] ? '-' : bit)
            .join('');
            
          const combinedTerm = {
            binary: combinedBinary,
            decimals: [...new Set([ //[MODIFIED] - Explicit creation of new set to avoid duplication
              ...(currentTerm.decimals || [currentTerm.decimal]), // [MODIFIED] - Fallback to .decimal
              ...(nextTerm.decimals || [nextTerm.decimal])
            ])],
            groupKey: countOnes(combinedBinary.replace(/-/g, '0')) // Count non-dash bits
          };
          
          if (!newGroups[currentKey].some(t => t.binary === combinedBinary)) { // [MODIFIED] - simplified duplicate through .some() and direct comparison of binary strings
            newGroups[currentKey].push(combinedTerm); 
          }
        }
      }
    }
  }

  // Collect unmarked terms
  groupKeys.forEach(key => { // [MODIFIED] - replaced nested for loops with for each loops
    groups[key].forEach(term => {
      if (!markedTerms.has(JSON.stringify(term))) {
        primeImplicants.push({
          ...term, // [MODIFIED] - consistent object spreading
          decimals: term.decimals || [term.decimal] // [MODIFIED] - added safety check
        });
      }
    });
  });
  
  //[MODIFIED] - added ternary conditional
  return combined 
    ? [...primeImplicants, ...findPrimeImplicants(newGroups)]
    : primeImplicants;
};

// Create prime implicant chart
//[MODIFIED] - added reduce and eliminated nested for loops
export const createPrimeImplicantChart = (primeImplicants, maxterms) => {
  return primeImplicants.reduce((chart, pi) => {
    chart[pi.binary] = {
      term: pi.binary,
      decimals: pi.decimals,
      covers: maxterms.reduce((cov, mt) => {
        cov[mt] = pi.decimals.includes(mt);
        return cov;
      }, {})
    };
    return chart;
  }, {});
};

//[MODIFIED] - see comments to see modifications
export const findEssentialPrimeImplicants = (chart, maxterms) => {
  const essentialPIs = [];
  const coveredMaxterms = new Set();
  
  // First pass: Find essential PIs
  maxterms.forEach(maxterm => {
    const coveringPIs = Object.keys(chart)
      .filter(pi => chart[pi].covers[maxterm]); //[MODIFIED] - combined Object.keys() and .filter() into a single expression
    
    if (coveringPIs.length === 1) {
      const [pi] = coveringPIs; //[MODIFIED] - replaced coveringPIs[0]
      if (!essentialPIs.includes(pi)) { // [MODIFIED] - checks if there are duplicate PIs
        essentialPIs.push(pi);
        chart[pi].decimals.forEach(d => coveredMaxterms.add(d));
      }
    }
  });
  
  // Second pass: Greedy coverage for remaining terms
  const remainingMaxterms = maxterms.filter(mt => !coveredMaxterms.has(mt));
  const remainingPIs = Object.keys(chart)
    .filter(pi => !essentialPIs.includes(pi))
    .sort((a, b) => 
      countCoveredTerms(chart[b], remainingMaxterms) - 
      countCoveredTerms(chart[a], remainingMaxterms)
    ); // [MODIFIED] - added countCoveredTerms helper function for cleaner operation
  
  for (const pi of remainingPIs) {
    if (remainingMaxterms.length === 0) break; //[MODIFIED] - added break in the case that all terms are covered
    
    const newlyCovered = remainingMaxterms
      .filter(mt => chart[pi].covers[mt]);
    
    if (newlyCovered.length > 0) {
      essentialPIs.push(pi);
      newlyCovered.forEach(mt => coveredMaxterms.add(mt));
      remainingMaxterms = remainingMaxterms
        .filter(mt => !coveredMaxterms.has(mt));
    } //[MODIFIED] - update remainingMaxterms in-place after each selection
  }
  
  return essentialPIs.map(pi => chart[pi]);
};

// [MODIFIED] - Helper function for coverage counting logic
const countCoveredTerms = (pi, terms) => 
  terms.filter(mt => pi.covers[mt]).length;


// Convert binary term to algebraic form (POS)
//[MODIFIED] - see function for all modified comments
export const binaryToAlgebraic = (binary, variables) => {
  const terms = []; //[MODIFIED] - Replaced string concatenation with array collection
  
  for (let i = 0; i < binary.length; i++) { //[MODIFIED] - Simplified complemented term handling
    if (binary[i] === '0') terms.push(variables[i] + "'");
    else if (binary[i] === '1') terms.push(variables[i]); //[MODIFIED] - Simplified uncomplemented term handling
    // '-' is skipped
  }
  
  return terms.join('+') || '1'; //[MODIFIED] - Single join operation at the end and empty product is 1 in POS
};