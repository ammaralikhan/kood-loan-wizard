/**
 * Calculate monthly loan payment using amortization formula
 * @param {number} principal - Loan amount in EUR
 * @param {number} annualRate - Annual interest rate in % (e.g., 5 for 5%)
 * @param {number} months - Loan period in months
 * @returns {number} Monthly payment rounded to 2 decimals
 * 
 * Formula source: https://en.wikipedia.org/wiki/Amortization_formula
 */
function calculateMonthlyPayment(principal, annualRate, months) {
  if (principal <= 0 || annualRate < 0 || months <= 0) {
    throw new Error('Invalid loan parameters');
  }

  const r = annualRate / 100 / 12; // monthly rate as decimal
  const n = months;

  // Edge case: 0% interest
  if (r === 0) {
    return Math.round((principal / n) * 100) / 100;
  }

  const numerator = r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  const payment = principal * (numerator / denominator);

  return Math.round(payment * 100) / 100;
}

// Export for other modules
window.Calculator = { calculateMonthlyPayment };

// Test function
Calculator.test = function() {
  console.log('🧪 €1000 @ 5% for 12mo:', calculateMonthlyPayment(1000, 5, 12));
  console.log('🧪 €5000 @ 3.5% for 24mo:', calculateMonthlyPayment(5000, 3.5, 24));
};