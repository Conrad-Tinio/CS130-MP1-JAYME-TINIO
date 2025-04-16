import React from 'react';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import Step3 from './steps/step3';
import Step4 from './steps/step4';
import Step5 from './steps/step5';

export default function ResultsDisplay({ 
  results, 
  maxterms, 
  currentStep, 
  setCurrentStep, 
  newFunction
}) {
  return (
    <div className="results-container">
      <div className="results-intro">
        <p className="font-semibold">For POS form, we'll find the minimal product of sums using the maxterms.</p>
        <p>Maxterms: {maxterms.join(', ')}</p>
      </div>
      
      <div className='new-function-container'>
      <button className='new-function-button' onClick={newFunction} >New Function</button>
      </div>
      
      {/* Step Navigation */}
      <div className="step-navigation">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep <= 1}
          className={`nav-button ${currentStep <= 1 ? 'nav-button-disabled' : 'nav-button-enabled'}`}
        >
          Previous Step
        </button>
        
        <span className="font-medium">Step {currentStep} of 5</span>
        
        <button
          onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
          disabled={currentStep >= 5}
          className={`nav-button ${currentStep >= 5 ? 'nav-button-disabled' : 'nav-button-enabled'}`}
        >
          Next Step
        </button>
      </div>
      
      {currentStep === 1 && <Step1 groups={results.groups} />}
      {currentStep === 2 && <Step2 primeImplicants={results.primeImplicants} />}
      {currentStep === 3 && <Step3 chart={results.chart} maxterms={maxterms} />}
      {currentStep === 4 && <Step4 essentialPIs={results.essentialPIs} />}
      {currentStep === 5 && <Step5 posExpression={results.posExpression} />}
    </div>
  );
}