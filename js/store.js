/**
 * Centralized application state
 * Only this file should read/write appState directly
 */

const appState = {
  currentStep: 0,  // CRITICAL FIX: 0 = intro screen state (was 1)
  // Step 1
  employment: null, // 'employed' | 'self-employed' | 'unemployed'
  // Step 2
  income: null,     // '<1000' | '1000-2000' | '>2000'
  loanAmount: null, // number
  loanPeriod: null, // 12 | 24 | 36
  interestRate: null, // number (annual %)
  monthlyPayment: null, // calculated
  // Step 3
  consents: [],     // array of accepted consent IDs
  // Step 4
  additionalInfo: '', // string, min 10 chars
  loanPurpose: null
};

// Safe getter
function getAppState(key) {
  return key ? appState[key] : { ...appState };
}

// Safe setter (FIXED)
function updateState(updates) {
  // Only dispatch event if state actually changed
  const prevState = { ...appState };
  Object.assign(appState, updates);
  
  // Check if state changed before dispatching
  if (JSON.stringify(prevState) !== JSON.stringify(appState)) {
    window.dispatchEvent(new CustomEvent('stateChange', { 
      detail: { updates } 
    }));
  }
}

// Reset for testing
function resetState() {
  Object.assign(appState, {
    currentStep: 0,  // CRITICAL FIX: Reset to intro screen
    employment: null,
    income: null,
    loanAmount: null,
    loanPeriod: null,
    interestRate: null,
    monthlyPayment: null,
    consents: [],
    additionalInfo: '',
    loanPurpose: null
  });
}

// Expose only what's needed
window.Store = { getAppState, updateState, resetState };