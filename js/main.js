/**
 * Application Navigation Controller
 * Handles step routing with single source of truth (state)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM references
  const introScreen = document.getElementById('intro-screen');
  const wizardContainer = document.getElementById('wizard-container');
  const stepContainer = document.getElementById('step-container');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressTracker = document.querySelector('.progress');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  // Step renderers (1-4 = wizard steps, 5 = summary)
  const stepRenderers = {
    1: window.Step1?.render || (() => '<p>Step 1 loading...</p>'),
    2: window.Step2?.render || (() => '<p>Step 2 loading...</p>'),
    3: window.Step3?.render || (() => '<p>Step 3 loading...</p>'),
    4: window.Step4?.render || (() => '<p>Step 4 loading...</p>'),
    5: window.Summary?.render || (() => '<p>Summary loading...</p>')
  };

  // Render current step
  function renderStep(stepNum) {
    // Only validate when moving FORWARD to next step
    if (stepNum > window.Store.getAppState('currentStep') && !validateCurrentStep()) {
      return false;
    }
    
    // Hide intro screen when rendering any step
    if (introScreen) {
      introScreen.style.display = 'none';
    }
    
    // Show wizard container when rendering steps
    if (wizardContainer && stepNum > 0) {
      wizardContainer.style.display = 'block';
    }
    
    // Hide/show progress tracker (hidden on summary screen)
    if (progressTracker) {
      progressTracker.style.display = (stepNum <= 4 && stepNum > 0) ? 'flex' : 'none';
    }
    
    // Render step content
    stepContainer.innerHTML = stepRenderers[stepNum]();
    
    // Initialize step-specific functionality
    const stepModule = stepNum === 5 ? window.Summary : window[`Step${stepNum}`];
    if (stepModule?.init) stepModule.init();
    
    // Update UI state
    updateNavigation(stepNum);
    updateProgress(stepNum);
    
    return true;
  }

  // Update button states based on current step
  function updateNavigation(stepNum) {
    // Back button disabled on first step
    backBtn.disabled = stepNum === 1;
    
    // Handle next/submit buttons based on step
    if (stepNum === 5) {
      // Summary screen - show submit button
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
    } else {
      // Wizard steps - show next button
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
      
      // Enable next button only if current step is valid
      nextBtn.disabled = !validateCurrentStep();
    }
  }

  // Update progress tracker UI (steps 1-4 only)
  function updateProgress(current) {
    // Only update progress for steps 1-4
    if (current > 4 || current === 0) return;
    
    progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.toggle('active', stepNum === current);
      step.classList.toggle('completed', stepNum < current);
      step.setAttribute('aria-current', stepNum === current ? 'step' : 'false');
    });
    
    // Update ARIA attributes
    if (progressTracker) {
      progressTracker.setAttribute('aria-valuenow', String(Math.min(current, 4)));
      progressTracker.setAttribute('aria-valuemax', '4');
    }
  }

  // Validate current step
  function validateCurrentStep() {
    const currentStep = window.Store.getAppState('currentStep');
    
    // No validation needed for intro screen (step 0) or summary screen (step 5)
    if (currentStep === 0 || currentStep === 5) return true;
    
    // Validate wizard steps
    const validator = window[`Step${currentStep}`]?.validate;
    return validator ? validator() : true;
  }

  // Intro screen handler
  document.getElementById('start-btn')?.addEventListener('click', () => {
    // Start at step 1
    window.Store.updateState({ currentStep: 1 });
  });

  // Event listeners - SINGLE source of truth (state-driven)
  backBtn.addEventListener('click', () => {
    const current = window.Store.getAppState('currentStep');
    if (current > 1) {
      // Move to previous step
      window.Store.updateState({ currentStep: current - 1 });
    }
  });

  nextBtn.addEventListener('click', () => {
    const current = window.Store.getAppState('currentStep');
    // Allow navigation from step 4 to summary (step 5)
    if (current < 5 && validateCurrentStep()) {
      window.Store.updateState({ currentStep: current + 1 });
    }
  });

  submitBtn.addEventListener('click', () => {
    // UI-only submission (no backend)
    alert('✅ Application submitted successfully!');
    console.log('Final application state:', window.Store.getAppState());
  });

  // State change handler - TRIGGERS RENDER
  window.addEventListener('stateChange', (e) => {
    if (e.detail.updates.currentStep !== undefined) {
      // Render new step when currentStep changes
      renderStep(e.detail.updates.currentStep);
    } else {
      // Update button state when form fields change (without step change)
      const currentStep = window.Store.getAppState('currentStep');
      if (currentStep > 0 && currentStep < 5) {
        nextBtn.disabled = !validateCurrentStep();
      }
    }
  });

  // Initial state setup - CRITICAL FIX: Hide wizard container initially
  if (introScreen) {
    introScreen.style.display = 'flex';
  }
  
  if (wizardContainer) {
    wizardContainer.style.display = 'none';
  }
  
  // DO NOT render any step initially - wait for state change to currentStep=1
});