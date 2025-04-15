// Utility functions for Quine-McCluskey algorithm
export const countOnes = (binary) => binary.split('').filter(bit => bit === '1').length;

export const hammingDistance = (str1, str2) => {
  if (str1.length !== str2.length) return -1;
  let distance = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) distance++;
  }
  return distance;
};

// Convert maxterms to binary representation
export const convertToBinary = (maxterms, numVars) => {
  return maxterms.map(term => {
    const binary = term.toString(2).padStart(numVars, '0');
    return { decimal: term, binary, groupKey: countOnes(binary) };
  });
};

// Group maxterms by number of ones
export const groupByOnes = (terms) => {
  const groups = {};
  terms.forEach(term => {
    const onesCount = term.groupKey;
    if (!groups[onesCount]) groups[onesCount] = [];
    groups[onesCount].push(term);
  });
  return groups;
};

// Find prime implicants through recursive combining
export const findPrimeImplicants = (groups) => {
  const markedTerms = new Set();
  const primeImplicants = [];
  const newGroups = {};
  let combined = false;

  // Check if we can combine any more groups
  const groupKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < groupKeys.length - 1; i++) {
    const currentKey = groupKeys[i];
    const nextKey = groupKeys[i + 1];
    
    // Only try to combine groups that differ by 1 in number of ones
    if (nextKey - currentKey !== 1) continue;
    
    const currentGroup = groups[currentKey];
    const nextGroup = groups[nextKey];
    
    if (!newGroups[currentKey]) newGroups[currentKey] = [];
    
    // Try all possible combinations between the two groups
    for (const term1 of currentGroup) {
      for (const term2 of nextGroup) {
        const distance = hammingDistance(term1.binary, term2.binary);
        
        if (distance === 1) {
          combined = true;
          markedTerms.add(JSON.stringify(term1));
          markedTerms.add(JSON.stringify(term2));
          
          // Create a new combined term
          const combinedBinary = term1.binary
            .split('')
            .map((bit, idx) => bit !== term2.binary[idx] ? '-' : bit)
            .join('');
            
          const combinedTerm = {
            binary: combinedBinary,
            decimals: [...new Set([...term1.decimals || [term1.decimal], ...term2.decimals || [term2.decimal]])],
            groupKey: countOnes(combinedBinary.replace(/-/g, '0'))
          };
          
          // Check if we already have this combined term
          const exists = newGroups[currentKey].some(
            t => t.binary === combinedBinary
          );
          
          if (!exists) {
            newGroups[currentKey].push(combinedTerm);
          }
        }
      }
    }
  }
  
  // Add unmarked terms as prime implicants
  for (const key of groupKeys) {
    for (const term of groups[key]) {
      if (!markedTerms.has(JSON.stringify(term))) {
        primeImplicants.push({
          ...term,
          decimals: term.decimals || [term.decimal]
        });
      }
    }
  }
  
  // If we combined terms, continue recursively
  if (combined) {
    const newPrimeImplicants = findPrimeImplicants(newGroups);
    return [...primeImplicants, ...newPrimeImplicants];
  }
  
  return primeImplicants;
};

// Create prime implicant chart
export const createPrimeImplicantChart = (primeImplicants, maxterms) => {
  const chart = {};
  
  for (const pi of primeImplicants) {
    chart[pi.binary] = {
      term: pi.binary,
      decimals: pi.decimals,
      covers: {}
    };
    
    for (const maxterm of maxterms) {
      chart[pi.binary].covers[maxterm] = pi.decimals.includes(maxterm);
    }
  }
  
  return chart;
};

// Find essential prime implicants
export const findEssentialPrimeImplicants = (chart, maxterms) => {
  const essentialPIs = [];
  const coveredMaxterms = new Set();
  
  // Find terms that are covered by only one prime implicant
  for (const maxterm of maxterms) {
    let coveringPIs = 0;
    let lastPI = null;
    
    for (const pi in chart) {
      if (chart[pi].covers[maxterm]) {
        coveringPIs++;
        lastPI = pi;
      }
    }
    
    if (coveringPIs === 1) {
      if (!essentialPIs.includes(lastPI)) {
        essentialPIs.push(lastPI);
      }
      chart[lastPI].decimals.forEach(d => coveredMaxterms.add(d));
    }
  }
  
  // Find remaining terms that need to be covered
  const remainingMaxterms = maxterms.filter(mt => !coveredMaxterms.has(mt));
  
  // If all terms are covered, return essential PIs
  if (remainingMaxterms.length === 0) {
    return essentialPIs.map(pi => chart[pi]);
  }
  
  // Use Petrick's method or a greedy approach for remaining terms
  // For simplicity, we'll use a greedy approach here
  const remainingPIs = Object.keys(chart).filter(pi => !essentialPIs.includes(pi));
  
  while (remainingMaxterms.length > 0) {
    // Find PI that covers the most uncovered maxterms
    let bestPI = null;
    let bestCoverage = 0;
    
    for (const pi of remainingPIs) {
      let coverage = 0;
      for (const mt of remainingMaxterms) {
        if (chart[pi].covers[mt]) coverage++;
      }
      
      if (coverage > bestCoverage) {
        bestCoverage = coverage;
        bestPI = pi;
      }
    }
    
    if (bestPI === null) break; // Can't cover remaining terms
    
    essentialPIs.push(bestPI);
    remainingPIs.splice(remainingPIs.indexOf(bestPI), 1);
    
    // Mark newly covered terms
    for (const mt of remainingMaxterms.slice()) {
      if (chart[bestPI].covers[mt]) {
        remainingMaxterms.splice(remainingMaxterms.indexOf(mt), 1);
      }
    }
  }
  
  return essentialPIs.map(pi => chart[pi]);
};

// Convert binary term to algebraic form (POS)
export const binaryToAlgebraic = (binary, variables) => {
  let algebraic = '';
  
  for (let i = 0; i < binary.length; i++) {
    if (binary[i] === '0') {
      // For POS, '0' in term means complemented variable in sum
      if (algebraic.length > 0) algebraic += '+';
      algebraic += variables[i] + '\'';
    } else if (binary[i] === '1') {
      // For POS, '1' in term means uncomplemented variable in sum
      if (algebraic.length > 0) algebraic += '+';
      algebraic += variables[i];
    }
    // If binary[i] is '-', skip this variable
  }
  
  return algebraic || '1';
};