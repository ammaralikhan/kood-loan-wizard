/**
 * Pure loan payment calculator - Amortization formula
 * Source: https://en.wikipedia.org/wiki/Amortization_formula
 */

function calculateMonthlyPayment(principal, annualRate, months) {
  if (principal <= 0 || annualRate < 0 || months <= 0) {
    throw new Error('Invalid loan parameters');
  }

  const r = annualRate / 100 / 12;
  const n = months;

  if (r === 0) {
    return Math.round((principal / n) * 100) / 100;
  }

  const numerator = r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  const payment = principal * (numerator / denominator);

  return Math.round(payment * 100) / 100;
}

window.Calculator = { calculateMonthlyPayment };

// Test in console: Calculator.test()
Calculator.test = function() {
  console.log('🧪 €1000 @ 5% for 12mo:', calculateMonthlyPayment(1000, 5, 12));
  console.log('🧪 €5000 @ 3.5% for 24mo:', calculateMonthlyPayment(5000, 3.5, 24));
};