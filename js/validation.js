/**
 * Reusable validation functions
 * All return { isValid: boolean, error: string|null }
 */

const Validators = {
  required(value, fieldName = 'Field') {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, error: null };
  },

  employment(value) {
    const valid = ['employed', 'self-employed', 'unemployed'];
    if (!valid.includes(value)) {
      return { isValid: false, error: 'Please select an employment status' };
    }
    return { isValid: true, error: null };
  },

  loanAmount(value) {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return { isValid: false, error: 'Enter a valid loan amount' };
    }
    if (num > 100000) {
      return { isValid: false, error: 'Maximum loan amount is €100,000' };
    }
    return { isValid: true, error: null };
  },

  consentChecked(values) {
    if (!Array.isArray(values) || values.length === 0) {
      return { isValid: false, error: 'At least one consent is required' };
    }
    return { isValid: true, error: null };
  },

  minLength(value, min, fieldName = 'Text') {
    if (value.length < min) {
      return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
    }
    return { isValid: true, error: null };
  }
};

window.Validators = Validators;


function validateStep1() {
  const employment = Store.getAppState('employment');
  return Validators.employment(employment);
}

function validateStep2() {
  const income = Store.getAppState('income');
  const loanAmount = Store.getAppState('loanAmount');
  const loanPeriod = Store.getAppState('loanPeriod');
  const interestRate = Store.getAppState('interestRate');

  const incomeCheck = Validators.required(income, 'Income');
  const loanAmountCheck = Validators.loanAmount(loanAmount);
  const loanPeriodCheck = Validators.required(loanPeriod, 'Loan period');
  const interestRateCheck = Validators.required(interestRate, 'Interest rate');

  if (!incomeCheck.isValid) return incomeCheck;
  if (!loanAmountCheck.isValid) return loanAmountCheck;
  if (!loanPeriodCheck.isValid) return loanPeriodCheck;
  if (!interestRateCheck.isValid) return interestRateCheck;

  return { isValid: true, error: null };
}

function validateStep3() {
  const consents = Store.getAppState('consents');
  return Validators.consentChecked(consents);
}

function validateStep4() {
  const additionalInfo = Store.getAppState('additionalInfo');
  return Validators.minLength(additionalInfo, 10, 'Additional info');
}

function validateStep(stepNumber) {
  switch (stepNumber) {
    case 1: return validateStep1();
    case 2: return validateStep2();
    case 3: return validateStep3();
    case 4: return validateStep4();
    default: return { isValid: false, error: 'Unknown step' };
  }
}

window.Validation = { validateStep };