/**
 * Step 2: Income & Loan Calculator
 * Handles income selection, loan parameters, and live payment calculation
 */

window.Step2 = {
  render: function() {
    const state = window.Store.getAppState();
    return `
      <fieldset class="form-group">
        <legend>Income and Loan Details</legend>
        
        <!-- Income Selection -->
        <div class="form-group">
          <label for="income-select">Monthly income</label>
          <select id="income-select" class="form-control">
            <option value="">Select income range</option>
            <option value="<1000" ${state.income === '<1000' ? 'selected' : ''}>&lt; €1,000</option>
            <option value="1000-2000" ${state.income === '1000-2000' ? 'selected' : ''}>€1,000 – €2,000</option>
            <option value=">2000" ${state.income === '>2000' ? 'selected' : ''}>&gt; €2,000</option>
          </select>
          <div class="error-message" id="income-error"></div>
        </div>
        
        <!-- Loan Amount (with slider) -->
        <div class="form-group">
          <label for="loan-amount">Loan amount (€)</label>
          <div class="slider-container">
            <input type="range" id="loan-amount-slider" min="500" max="100000" step="100" 
                   value="${state.loanAmount || 5000}" class="slider">
            <div class="slider-value" id="loan-amount-value">€${(state.loanAmount || 5000).toLocaleString('en')}</div>
          </div>
          <input type="number" id="loan-amount" min="100" max="100000" step="100" 
                 placeholder="e.g. 5000" class="form-control"
                 value="${state.loanAmount || ''}">
          <div class="error-message" id="loan-amount-error"></div>
        </div>
        
        <!-- Loan Period (with slider) -->
        <div class="form-group">
          <label for="loan-period">Loan period (months)</label>
          <div class="slider-container">
            <input type="range" id="loan-period-slider" min="6" max="84" step="1" 
                   value="${state.loanPeriod || 36}" class="slider">
            <div class="slider-value" id="loan-period-value">${state.loanPeriod || 36} months</div>
          </div>
          <select id="loan-period" class="form-control">
            <option value="">Select period</option>
            <option value="12" ${state.loanPeriod === 12 ? 'selected' : ''}>12 months</option>
            <option value="24" ${state.loanPeriod === 24 ? 'selected' : ''}>24 months</option>
            <option value="36" ${state.loanPeriod === 36 ? 'selected' : ''}>36 months</option>
            <option value="48" ${state.loanPeriod === 48 ? 'selected' : ''}>48 months</option>
            <option value="60" ${state.loanPeriod === 60 ? 'selected' : ''}>60 months</option>
            <option value="72" ${state.loanPeriod === 72 ? 'selected' : ''}>72 months</option>
            <option value="84" ${state.loanPeriod === 84 ? 'selected' : ''}>84 months</option>
            <!-- Custom values will be added dynamically by JavaScript -->
          </select>
          <div class="error-message" id="loan-period-error"></div>
        </div>
        
        <!-- Interest Rate -->
        <div class="form-group">
          <label for="interest-rate">Annual interest rate (%)</label>
          <select id="interest-rate" class="form-control">
            <option value="">Select rate</option>
            <option value="3.5" ${state.interestRate === 3.5 ? 'selected' : ''}>3.5%</option>
            <option value="5.0" ${state.interestRate === 5.0 ? 'selected' : ''}>5.0%</option>
            <option value="7.5" ${state.interestRate === 7.5 ? 'selected' : ''}>7.5%</option>
          </select>
          <div class="error-message" id="interest-rate-error"></div>
        </div>
        
        <!-- Payment Result -->
        <div class="form-group payment-result ${state.monthlyPayment ? 'visible' : ''}">
          <label>Estimated monthly payment</label>
          <div class="payment-amount" id="payment-amount">
            ${state.monthlyPayment ? `€${state.monthlyPayment.toFixed(2)}` : '—'}
          </div>
          <div class="payment-hint">*This is an estimate. Actual payment may vary.</div>
        </div>
      </fieldset>
    `;
  },
  
  validate: function() {
    const state = window.Store.getAppState();
    let isValid = true;
    
    // DEFENSIVE: Helper to safely set error messages
    const setError = (id, message) => {
      const el = document.getElementById(id);
      if (el) el.textContent = message;
    };
    
    // Validate income
    const incomeResult = Validators.required(state.income, 'Income');
    setError('income-error', incomeResult.isValid ? '' : incomeResult.error);
    if (!incomeResult.isValid) isValid = false;
    
    // Validate loan amount
    const amountResult = Validators.loanAmount(state.loanAmount);
    setError('loan-amount-error', amountResult.isValid ? '' : amountResult.error);
    if (!amountResult.isValid) isValid = false;
    
    // Validate period
    const periodResult = Validators.required(state.loanPeriod, 'Loan period');
    setError('loan-period-error', periodResult.isValid ? '' : periodResult.error);
    if (!periodResult.isValid) isValid = false;
    
    // Validate interest rate
    const rateResult = Validators.required(state.interestRate, 'Interest rate');
    setError('interest-rate-error', rateResult.isValid ? '' : rateResult.error);
    if (!rateResult.isValid) isValid = false;
    
    return isValid;
  },
  
  calculatePayment: function() {
    const state = window.Store.getAppState();
    
    // Only calculate if all required values exist
    if (state.loanAmount && state.loanPeriod && state.interestRate) {
      try {
        const payment = Calculator.calculateMonthlyPayment(
          Number(state.loanAmount),
          Number(state.interestRate),
          Number(state.loanPeriod)
        );
        window.Store.updateState({ monthlyPayment: payment });
        
        // Update payment display immediately
        const paymentNode = document.getElementById('payment-amount');
        if (paymentNode) {
          paymentNode.textContent = `€${payment.toFixed(2)}`;
          paymentNode.closest('.payment-result').classList.add('visible');
        }
      } catch (e) {
        console.warn('Calculation error:', e.message);
        window.Store.updateState({ monthlyPayment: null });
      }
    } else {
      window.Store.updateState({ monthlyPayment: null });
      const paymentNode = document.getElementById('payment-amount');
      if (paymentNode) {
        paymentNode.textContent = '—';
        paymentNode.closest('.payment-result').classList.remove('visible');
      }
    }
  },
  
  init: function() {
    // Income selection
    const incomeSelect = document.getElementById('income-select');
    if (incomeSelect) {
      incomeSelect.addEventListener('change', (e) => {
        window.Store.updateState({ income: e.target.value || null });
        this.validate();
        this.calculatePayment();
      });
    }
    
    // Loan amount (both slider and input)
    const loanAmountSlider = document.getElementById('loan-amount-slider');
    const loanAmountInput = document.getElementById('loan-amount');
    const loanAmountValue = document.getElementById('loan-amount-value');
    
    if (loanAmountSlider && loanAmountInput && loanAmountValue) {
      // Slider → Input + Value display
      loanAmountSlider.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        loanAmountInput.value = value;
        loanAmountValue.textContent = `€${value.toLocaleString('en')}`;
        window.Store.updateState({ loanAmount: value });
        this.validate();
        this.calculatePayment();
      });
      
      // Input → Slider + Value display
      loanAmountInput.addEventListener('input', (e) => {
        const value = e.target.value ? Number(e.target.value) : null;
        if (value !== null && !isNaN(value)) {
          loanAmountSlider.value = value;
          loanAmountValue.textContent = `€${value.toLocaleString('en')}`;
        }
        window.Store.updateState({ loanAmount: value });
        this.validate();
        this.calculatePayment();
      });
      
      // Format on blur
      loanAmountInput.addEventListener('blur', (e) => {
        if (e.target.value && !isNaN(e.target.value)) {
          const num = Number(e.target.value);
          e.target.value = num.toLocaleString('en', { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
          });
        }
      });
    }
    
    // Loan period (both slider and select) 
    const loanPeriodSlider = document.getElementById('loan-period-slider');
    const loanPeriodSelect = document.getElementById('loan-period');
    const loanPeriodValue = document.getElementById('loan-period-value');

    if (loanPeriodSlider && loanPeriodSelect && loanPeriodValue) {
      // Helper: Add custom option to dropdown if it doesn't exist
      const ensureOptionExists = (value) => {
        // Check if option already exists
        for (let option of loanPeriodSelect.options) {
          if (option.value === String(value)) return;
        }
        // Add new custom option
        const newOption = new Option(`${value} months`, value);
        loanPeriodSelect.add(newOption);
      };

      // Slider → Select + Value display
      loanPeriodSlider.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        ensureOptionExists(value); // Add custom option if needed
        loanPeriodSelect.value = value;
        loanPeriodValue.textContent = `${value} months`;
        window.Store.updateState({ loanPeriod: value });
        this.validate();
        this.calculatePayment();
      });
      
      // Select → Slider + Value display
      loanPeriodSelect.addEventListener('change', (e) => {
        const value = e.target.value ? Number(e.target.value) : null;
        if (value !== null) {
          loanPeriodSlider.value = value;
          loanPeriodValue.textContent = `${value} months`;
        }
        window.Store.updateState({ loanPeriod: value });
        this.validate();
        this.calculatePayment();
      });
    }
    
    // Interest rate
    const interestRate = document.getElementById('interest-rate');
    if (interestRate) {
      interestRate.addEventListener('change', (e) => {
        const value = e.target.value ? Number(e.target.value) : null;
        window.Store.updateState({ interestRate: value });
        this.validate();
        this.calculatePayment();
      });
    }
    
    // Initial calculation and validation
    this.calculatePayment();
    this.validate();
  }
};