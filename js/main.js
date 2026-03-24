const stepContainer = document.getElementById('step-container');
const backButton = document.getElementById('back-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const progressBar = document.querySelector('.progress');

document.addEventListener('DOMContentLoaded', async () => {
  await ensureDomHelperLoaded();
  initializeWizard();
});

function initializeWizard() {
  backButton.addEventListener('click', handleBack);
  nextButton.addEventListener('click', handleNext);
  submitButton.addEventListener('click', handleSubmit);

  renderCurrentStep();
}

function renderCurrentStep() {
  const { currentStep } = Store.getAppState();

  if (currentStep === 1) {
    Step1.render(stepContainer, { onStateUpdate: syncUi });
  } else if (currentStep === 2) {
    Step2.render(stepContainer, { onStateUpdate: syncUi });
  } else {
    renderUnavailableStep(currentStep);
  }

  syncUi();
}

function syncUi() {
  updateProgressTracker();
  updateNavigationButtons();
  renderCurrentStepErrors();
}

function updateProgressTracker() {
  const { currentStep } = Store.getAppState();
  const progressSteps = document.querySelectorAll('.progress-step');

  progressBar.setAttribute('aria-valuenow', String(currentStep));

  progressSteps.forEach((stepNode) => {
    const stepNumber = Number(stepNode.dataset.step);
    stepNode.classList.toggle('active', stepNumber === currentStep);
    stepNode.classList.toggle('completed', stepNumber < currentStep);
  });
}

function updateNavigationButtons() {
  const { currentStep } = Store.getAppState();
  const stepValidation = validateCurrentStep();
  const canAdvance = currentStep < 4 && stepValidation.isValid;
  const showSubmit = currentStep === 4;

  backButton.disabled = currentStep === 1;
  nextButton.disabled = !canAdvance;
  nextButton.style.display = showSubmit ? 'none' : '';
  submitButton.style.display = showSubmit ? '' : 'none';
  submitButton.disabled = !showSubmit;
}

function validateCurrentStep() {
  const state = Store.getAppState();

  if (state.currentStep === 1) {
    return Validators.employment(state.employment);
  }

  if (state.currentStep === 2) {
    const incomeResult = Validators.required(state.income, 'Income');
    if (!incomeResult.isValid) {
      return { field: 'income', ...incomeResult };
    }

    const amountResult = Validators.loanAmount(state.loanAmount);
    if (!amountResult.isValid) {
      return { field: 'loanAmount', ...amountResult };
    }

    const periodResult = Validators.required(state.loanPeriod, 'Loan period');
    if (!periodResult.isValid) {
      return { field: 'loanPeriod', ...periodResult };
    }

    const rateResult = Validators.required(state.interestRate, 'Interest rate');
    if (!rateResult.isValid) {
      return { field: 'interestRate', ...rateResult };
    }

    return { isValid: true, error: null, field: null };
  }

  return { isValid: false, error: 'This step is not available yet.', field: null };
}

function renderCurrentStepErrors() {
  clearErrorMessages();

  const validation = validateCurrentStep();
  if (validation.isValid) {
    return;
  }

  const state = Store.getAppState();

  if (state.currentStep === 1) {
    setErrorMessage('employment-error', validation.error);
    return;
  }

  if (state.currentStep === 2 && validation.field) {
    setErrorMessage(`${validation.field}-error`, validation.error);
  }
}

function clearErrorMessages() {
  const errorNodes = stepContainer.querySelectorAll('.error-message');

  errorNodes.forEach((node) => {
    node.textContent = '';
  });
}

function setErrorMessage(id, message) {
  const node = document.getElementById(id);

  if (node) {
    node.textContent = message;
  }
}

function handleNext() {
  const validation = validateCurrentStep();
  if (!validation.isValid) {
    renderCurrentStepErrors();
    return;
  }

  const { currentStep } = Store.getAppState();
  if (currentStep < 4) {
    Store.updateState({ currentStep: currentStep + 1 });
    renderCurrentStep();
  }
}

function handleBack() {
  const { currentStep } = Store.getAppState();
  if (currentStep > 1) {
    Store.updateState({ currentStep: currentStep - 1 });
    renderCurrentStep();
  }
}

function handleSubmit() {
  window.alert('Submit UI is not available yet.');
}

function renderUnavailableStep(stepNumber) {
  const { createElement, appendChildren } = window.DomHelpers;

  stepContainer.replaceChildren();

  const section = createElement('section', {
    className: 'step step-panel',
    attributes: { 'data-step': String(stepNumber) }
  });
  const title = createElement('h1', { text: `Step ${stepNumber}` });
  const description = createElement('p', {
    className: 'step-description',
    text: 'This step will be added by another teammate.'
  });

  appendChildren(section, [title, description]);
  stepContainer.append(section);
}

function ensureDomHelperLoaded() {
  if (window.DomHelpers) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = 'js/dom-helper.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load js/dom-helper.js'));

    document.head.append(script);
  });
}
