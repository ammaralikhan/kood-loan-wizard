/**
 * Reusable validation helpers
 */

const Validators = {
  required(value, name = 'Field') {
    if (!value && value !== 0) return { isValid: false, error: `${name} is required` };
    return { isValid: true, error: null };
  },
  
  employment(value) {
    const valid = ['employed', 'self-employed', 'unemployed'];
    if (!valid.includes(value)) return { isValid: false, error: 'Select employment status' };
    return { isValid: true, error: null };
  },
  
  loanAmount(value) {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return { isValid: false, error: 'Enter valid amount' };
    if (num > 100000) return { isValid: false, error: 'Max €100,000' };
    return { isValid: true, error: null };
  },
  
  consentChecked(values) {
    if (!values?.length) return { isValid: false, error: 'At least one consent required' };
    return { isValid: true, error: null };
  },
  
  minLength(value, min, name = 'Text') {
    if (value.length < min) return { isValid: false, error: `${name} needs ${min}+ chars` };
    return { isValid: true, error: null };
  }
};

window.Validators = Validators;