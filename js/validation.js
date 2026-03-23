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