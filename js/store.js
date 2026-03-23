/**
 * Centralized application state - Single Source of Truth
 */

const appState = {
  currentStep: 1,
  employment: null,
  income: null,
  loanAmount: null,
  loanPeriod: null,
  interestRate: null,
  monthlyPayment: null,
  consents: [],
  additionalInfo: ''
};

function getAppState(key) {
  return key ? appState[key] : { ...appState };
}

function updateState(updates) {
  Object.assign(appState, updates);
  window.dispatchEvent(new CustomEvent('stateChange', { detail: { updates } }));
}

function resetState() {
  Object.assign(appState, {
    currentStep: 1,
    employment: null,
    income: null,
    loanAmount: null,
    loanPeriod: null,
    interestRate: null,
    monthlyPayment: null,
    consents: [],
    additionalInfo: ''
  });
}

window.Store = { getAppState, updateState, resetState };