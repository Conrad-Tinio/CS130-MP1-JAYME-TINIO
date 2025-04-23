// Converts decimal maxterms to their binary representation
export const convertMaxtermsToBinary = (maxterms, numVars) => {
  // Added basic error checking
  if (!Array.isArray(maxterms)) throw new Error('An unexpected error occured. Please try again.');
  if (typeof numVars !== 'number') throw new Error('An unexpected error occured. Please try again.');
  
  return maxterms.map(term => {
    // Converts to binary and pads with leading zeros
    const binary = term.toString(2).padStart(numVars, '0');
    return { 
      decimal: term, 
      binary, 
      groupKey: countOnes(binary),
      decimals: [term] // Initializes with this term
    };
  });
};

// Counts how many 1's are in a binary string
export const countOnes = (binary) => {
  return binary.split('').reduce((count, bit) => count + (bit === '1' ? 1 : 0), 0);
};

// Groups terms by the number of 1's they contain
export const groupByOnes = (terms) => {
  return terms.reduce((groups, term) => {
    const onesCount = term.groupKey;
    // Creates the array if it doesn't exist yet
    groups[onesCount] = groups[onesCount] || [];
    groups[onesCount].push(term);
    return groups;
  }, {});
};

// Calculates how many bits are different between two binary strings
export const checkDifferingBits = (string1, string2) => {
  if (string1.length !== string2.length) {
    throw new Error('Strings must be of equal length for Hamming distance calculation');
  }
  
  // Counts how many positions have different bits
  return string1.split('').reduce((differentBits, bit, i) => 
    differentBits + (bit !== string2[i] ? 1 : 0), 0);
};

// Core algorithm to find prime implicants - MODIFIED to track iterations
export const findPrimeImplicants = (groups, iterations = []) => {
  // Keeps track of terms combined
  const markedTerms = new Set();  
  const primeImplicants = [];
  const newGroups = {};
  let combined = false;
  
  // Save current state as an iteration
  iterations.push({
    groups: JSON.parse(JSON.stringify(groups)),
    markedTerms: [], // We'll fill this at the end
    newGroups: {}, // We'll fill this at the end
    primeImplicants: []
  });

  // Gets group keys and sort them numerically
  const groupKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);
  
  // Looks for terms that differ by exactly 1 bit
  for (let i = 0; i < groupKeys.length - 1; i++) {
    const currentKey = groupKeys[i];
    const nextKey = groupKeys[i + 1];
    
    // Skips if groups aren't adjacent (# of 1's differs by more than 1)
    if (nextKey - currentKey !== 1) continue;
    
    // Initializes the group in newGroups if not there yet
    newGroups[currentKey] = newGroups[currentKey] || [];
    
    // Compares each term in current group with each in next group
    for (const currentTerm of groups[currentKey]) {
      for (const nextTerm of groups[nextKey]) {
        // If they differ by exactly 1 bit, combines them
        if (checkDifferingBits(currentTerm.binary, nextTerm.binary) === 1) {
          combined = true;
          // Marks both terms as used
          markedTerms.add(JSON.stringify(currentTerm));
          markedTerms.add(JSON.stringify(nextTerm));
          
          // Creates the combined term with a dash for the differing bit
          const combinedBinary = currentTerm.binary
            .split('')
            .map((bit, idx) => bit !== nextTerm.binary[idx] ? '-' : bit)
            .join('');
            
          // Builds the new combined term object
          const combinedTerm = {
            binary: combinedBinary,
            // Combines and deduplicate the decimal values
            decimals: [...new Set([
              ...(currentTerm.decimals || [currentTerm.decimal]),
              ...(nextTerm.decimals || [nextTerm.decimal])
            ])],
            groupKey: countOnes(combinedBinary.replace(/-/g, '0'))
          };
          
          // Avoids duplicates in the new group
          if (!newGroups[currentKey].some(t => t.binary === combinedBinary)) {
            newGroups[currentKey].push(combinedTerm); 
          }
        }
      }
    }
  }

  // Collect terms that weren't combined (prime implicants)
  groupKeys.forEach(key => {
    groups[key].forEach(term => {
      if (!markedTerms.has(JSON.stringify(term))) {
        primeImplicants.push({
          ...term,
          decimals: term.decimals || [term.decimal] 
        });
      }
    });
  });
  
  // Update the current iteration with results
  const currentIteration = iterations[iterations.length - 1];
  currentIteration.markedTerms = Array.from(markedTerms).map(t => JSON.parse(t));
  currentIteration.newGroups = JSON.parse(JSON.stringify(newGroups));
  currentIteration.primeImplicants = JSON.parse(JSON.stringify(primeImplicants));
  
  // If terms are combined, recursively checks for more prime implicants
  // Otherwise process is done
  return combined 
    ? [...primeImplicants, ...findPrimeImplicants(newGroups, iterations)]
    : primeImplicants;
};

// Creates a chart showing which prime implicants cover which maxterms
export const createPrimeImplicantChart = (primeImplicants, maxterms) => {
  return primeImplicants.reduce((chart, pi) => {
    chart[pi.binary] = {
      term: pi.binary,
      decimals: pi.decimals,
      // Creates a map of which maxterms this implicant covers
      covers: maxterms.reduce((cov, mt) => {
        cov[mt] = pi.decimals.includes(mt);
        return cov;
      }, {})
    };
    return chart;
  }, {});
};

// Finds the essential prime implicants that cover all maxterms
export const findEssentialPrimeImplicants = (chart, maxterms) => {
  const essentialPIs = [];
  const coveredMaxterms = new Set();
  
  // Finds essential prime implicants (ones that uniquely cover a maxterm)
  maxterms.forEach(maxterm => {
    // Finds all PIs that cover this maxterm
    const coveringPIs = Object.keys(chart)
      .filter(pi => chart[pi].covers[maxterm]);
    
    // If only one PI covers this maxterm, it's essential
    if (coveringPIs.length === 1) {
      const [pi] = coveringPIs; // Destructuring is cleaner than [0]
      if (!essentialPIs.includes(pi)) {
        essentialPIs.push(pi);
        // Marks all maxterms covered by this PI
        chart[pi].decimals.forEach(d => coveredMaxterms.add(d));
      }
    }
  });
  
  // Uses greedy approach to see if more PIs are needed to cover all maxterms
  let remainingMaxterms = maxterms.filter(mt => !coveredMaxterms.has(mt));
  
  // Sorts remaining PIs by how many uncovered maxterms they cover
  const remainingPIs = Object.keys(chart)
    .filter(pi => !essentialPIs.includes(pi))
    .sort((a, b) => 
      countCoveredTerms(chart[b], remainingMaxterms) - 
      countCoveredTerms(chart[a], remainingMaxterms)
    );
  
  // Adds PIs that cover the most remaining maxterms
  for (const pi of remainingPIs) {
    // If everything is covered, process is done
    if (remainingMaxterms.length === 0) break;
    
    // Finds which uncovered maxterms this PI covers
    const newlyCovered = remainingMaxterms
      .filter(mt => chart[pi].covers[mt]);
    
    // If it covers anything, add it
    if (newlyCovered.length > 0) {
      essentialPIs.push(pi);
      // Updates covered and remaining maxterms
      newlyCovered.forEach(mt => coveredMaxterms.add(mt));
      remainingMaxterms = remainingMaxterms
        .filter(mt => !coveredMaxterms.has(mt));
    }
  }
  
  // Returns the actual PI objects, not just their keys
  return essentialPIs.map(pi => chart[pi]);
};

// Helper to count how many terms a PI covers
const countCoveredTerms = (pi, terms) => 
  terms.filter(mt => pi.covers[mt]).length;

// Converts binary term to algebraic form
export const binaryToAlgebraic = (binary, variables) => {
  // Builds the sum-term (for POS)
  const terms = [];
  
  for (let i = 0; i < binary.length; i++) {
    // In POS, 1 means complemented
    if (binary[i] === '1') terms.push(variables[i] + "'");
    // 0 means uncomplemented
    else if (binary[i] === '0') terms.push(variables[i]);
  }
  
  // Joins with + for sum term, return 1 if empty (identity)
  return terms.join('+') || '1';
};