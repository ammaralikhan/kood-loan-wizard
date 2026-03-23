/**
 * Application Navigation Controller
 * Handles step routing, button states, and UI synchronization
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM references
  const stepContainer = document.getElementById('step-container');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  // Current step renderer (imported from step files)
  const stepRenderers = {
    1: window.Step1?.render || (() => '<p>Step 1 loading...</p>'),
    2: window.Step2?.render || (() => '<p>Step 2 loading...</p>'),
    3: window.Step3?.render || (() => '<p>Step 3 loading...</p>'),
    4: window.Step4?.render || (() => '<p>Step 4 loading...</p>')
  };

  // Render current step
  function renderStep(stepNum) {
    // Validate current step before rendering next
    if (stepNum > 1 && !validateCurrentStep()) {
      return;
    }
    
    stepContainer.innerHTML = stepRenderers[stepNum]();
    
    // Initialize step-specific functionality
    if (window[`Step${stepNum}`] && typeof window[`Step${stepNum}`].init === 'function') {
      window[`Step${stepNum}`].init();
    }
    
    updateNavigation(stepNum);
    updateProgress(stepNum);
    window.Store.updateState({ currentStep: stepNum });
  }

  // Update button states
  function updateNavigation(stepNum) {
    backBtn.disabled = stepNum === 1;
    
    if (stepNum === 4) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
    } else {
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
      
      // Enable Next button only if current step is valid
      nextBtn.disabled = !validateCurrentStep();
    }
  }

  // Update progress tracker UI
  function updateProgress(current) {
    progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.toggle('active', stepNum === current);
      step.classList.toggle('completed', stepNum < current);
      step.setAttribute('aria-current', stepNum === current ? 'step' : 'false');
    });
  }

  // Validate current step
  function validateCurrentStep() {
    const currentStep = window.Store.getAppState('currentStep');
    return window[`Step${currentStep}`]?.validate?.() ?? true;
  }

  // SINGLE event listeners (NO DUPLICATES)
  backBtn.addEventListener('click', () => {
    const current = window.Store.getAppState('currentStep');
    if (current > 1) {
      // Update state FIRST
      window.Store.updateState({ currentStep: current - 1 });
    }
  });

  nextBtn.addEventListener('click', () => {
    const current = window.Store.getAppState('currentStep');
    if (current < 4 && validateCurrentStep()) {
      // Update state FIRST
      window.Store.updateState({ currentStep: current + 1 });
    }
  });

  submitBtn.addEventListener('click', () => {
    alert('✅ Application submitted! (UI demo only)');
    console.log('Final state:', window.Store.getAppState());
  });

  // State change handler (TRIGGERS RENDER)
  window.addEventListener('stateChange', (e) => {
    if (e.detail.updates.currentStep !== undefined) {
      renderStep(e.detail.updates.currentStep);
    } else {
      // Update button state when other fields change
      nextBtn.disabled = !validateCurrentStep();
    }
  });

  // Initial render
  renderStep(window.Store.getAppState('currentStep'));
});