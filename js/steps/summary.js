/**
 * Summary Screen
 * Displays all application answers and final payment
 */
window.Summary = {
  render: function() {
    const state = window.Store.getAppState();
    return `
      <div class="summary">
        <h2>Application Summary</h2>
        
        <div class="summary-item">
          <span>Employment status:</span>
          <span>${state.employment || 'Not selected'}</span>
        </div>
        
 <div class="summary-item">
          <span>Monthly income:</span>
          <span>${state.income || 'Not selected'}</span>
        </div>
        
        <div class="summary-item">
          <span>Loan amount:</span>
          <span>€${(state.loanAmount || 0).toLocaleString('en')}</span>
        </div>
        
        <div class="summary-item">
          <span>Loan period:</span>
          <span>${state.loanPeriod || 'Not selected'} months</span>
        </div>
        
        <div class="summary-item">
          <span>Interest rate:</span>
          <span>${state.interestRate || 'Not selected'}%</span>
        </div>
        
        <div class="summary-item payment">
          <span>Estimated monthly payment:</span>
          <span>€${state.monthlyPayment ? state.monthlyPayment.toFixed(2) : '—'}</span>
        </div>
      </div>
    `;
  }
};