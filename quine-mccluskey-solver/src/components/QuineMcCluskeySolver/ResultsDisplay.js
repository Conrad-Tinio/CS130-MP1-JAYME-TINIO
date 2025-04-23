import React from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import ProgressBar from './progressBar/progressBar'; 
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';

export default function ResultsDisplay({ 
  results, 
  maxterms, 
  currentStep, 
  setCurrentStep, 
  newFunction
}) {
  return (
    <div className="results-container">
      {/* intro text */}
      <div className="results-intro">
        <p className="font-semibold">For POS form, we'll find the minimal product of sums using the minterms.</p>
        <p>Minterms: {maxterms.join(', ')}</p>
      </div>
      
      {/* new function button */}
      <div className='new-function-container'>
        <button className='new-function-button' onClick={newFunction}>
          <FaPlus size={14} style={{ display: 'inline-block', marginRight: '8px' }} /> New Function
        </button>
      </div>
      
      {/* progress bar - shows which step we're on */}
      <ProgressBar currentStep={currentStep} totalSteps={5} />
      
      {/* prev/next buttons */}
      <div className="step-navigation">
        <div className="button-wrapper">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep <= 1}
            className={`nav-button ${currentStep <= 1 ? 'nav-button-disabled' : 'nav-button-enabled'}`}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FaArrowLeft size={14} style={{ display: 'inline-block', marginRight: '8px' }} /> Prev Step
            </span>
          </button>
        </div>
        <div className="step-counter">Step {currentStep} of 5</div>
        <div className="button-wrapper">
          <button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            disabled={currentStep >= 5}
            className={`nav-button ${currentStep >= 5 ? 'nav-button-disabled' : 'nav-button-enabled'}`}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Next Step <FaArrowRight size={14} style={{ display: 'inline-block', marginLeft: '8px' }} />
            </span>
          </button>
        </div>
      </div>
      
      {/* shows the current step */}
      {currentStep === 1 && <Step1 groups={results.groups} />}
      {currentStep === 2 && <Step2 primeImplicants={results.primeImplicants} iterations={results.iterations} />}
      {currentStep === 3 && <Step3 chart={results.chart} maxterms={maxterms} />}
      {currentStep === 4 && <Step4 essentialPIs={results.essentialPIs} variableList={results.variableList} />}
      {currentStep === 5 && <Step5 posExpression={results.posExpression} results={results} />}
    </div>
  );
}