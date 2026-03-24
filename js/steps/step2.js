function renderStep2(container, options = {}) {
  const { onStateUpdate } = options;
  const { appendChildren, createElement, createSelectField, createErrorMessage } = window.DomHelpers;
  const state = Store.getAppState();

  container.replaceChildren();

  const section = createElement('section', {
    className: 'step step-panel',
    attributes: { 'data-step': '2' }
  });

  const header = createElement('div', { className: 'step-header' });
  appendChildren(header, [
    createElement('p', { className: 'step-eyebrow', text: 'Step 2 of 4' }),
    createElement('h1', { text: 'Income and loan calculator' }),
    createElement('p', {
      className: 'step-description',
      text: 'Fill in your income and loan details to see the estimated monthly payment.'
    })
  ]);

  const form = createElement('form', {
    className: 'wizard-form',
    attributes: { novalidate: '' }
  });

  const incomeField = createSelectField({
    id: 'income',
    labelText: 'Monthly income',
    value: state.income || '',
    options: [
      { value: '', text: 'Select income range' },
      { value: 'lt1000', text: 'Less than 1000 EUR' },
      { value: '1000-2000', text: '1000 EUR to 2000 EUR' },
      { value: 'gt2000', text: 'More than 2000 EUR' }
    ],
    errorId: 'income-error',
    onChange: (event) => {
      const nextValue = event.target.value || null;
      Store.updateState({ income: nextValue });
      syncMonthlyPayment(paymentValue);
      notifyStateUpdate(onStateUpdate);
    }
  });

  const amountGroup = createElement('div', { className: 'form-group' });
  const amountLabel = createElement('label', {
    htmlFor: 'loanAmount',
    text: 'Loan amount'
  });
  const rangeRow = createElement('div', { className: 'range-row' });
  const amountInput = createElement('input', {
    id: 'loanAmount',
    name: 'loanAmount',
    type: 'range',
    value: state.loanAmount || 5000,
    attributes: {
      min: '500',
      max: '100000',
      step: '100',
      'aria-describedby': 'loanAmount-error loanAmountOutput'
    }
  });
  const amountOutput = createElement('output', {
    id: 'loanAmountOutput',
    text: formatCurrency(state.loanAmount || 5000),
    attributes: { for: 'loanAmount' }
  });

  amountInput.addEventListener('input', (event) => {
    const amount = Number(event.target.value);
    amountOutput.textContent = formatCurrency(amount);
    Store.updateState({ loanAmount: amount });
    syncMonthlyPayment(paymentValue);
    notifyStateUpdate(onStateUpdate);
  });

  appendChildren(rangeRow, [amountInput, amountOutput]);
  appendChildren(amountGroup, [
    amountLabel,
    rangeRow,
    createErrorMessage('loanAmount-error')
  ]);

  const formGrid = createElement('div', { className: 'form-grid' });

  const periodField = createSelectField({
    id: 'loanPeriod',
    labelText: 'Loan period',
    value: state.loanPeriod || '',
    options: [
      { value: '', text: 'Select period' },
      { value: '12', text: '12 months' },
      { value: '24', text: '24 months' },
      { value: '36', text: '36 months' }
    ],
    errorId: 'loanPeriod-error',
    onChange: (event) => {
      const nextValue = event.target.value ? Number(event.target.value) : null;
      Store.updateState({ loanPeriod: nextValue });
      syncMonthlyPayment(paymentValue);
      notifyStateUpdate(onStateUpdate);
    }
  });

  const rateField = createSelectField({
    id: 'interestRate',
    labelText: 'Interest rate',
    value: state.interestRate || '',
    options: [
      { value: '', text: 'Select rate' },
      { value: '3.5', text: '3.5%' },
      { value: '5', text: '5%' },
      { value: '7.5', text: '7.5%' }
    ],
    errorId: 'interestRate-error',
    onChange: (event) => {
      const nextValue = event.target.value ? Number(event.target.value) : null;
      Store.updateState({ interestRate: nextValue });
      syncMonthlyPayment(paymentValue);
      notifyStateUpdate(onStateUpdate);
    }
  });

  appendChildren(formGrid, [periodField.group, rateField.group]);

  const paymentCard = createElement('section', {
    className: 'payment-card',
    attributes: { 'aria-live': 'polite' }
  });
  const paymentLabel = createElement('p', {
    className: 'payment-label',
    text: 'Estimated monthly payment'
  });
  const paymentValue = createElement('p', {
    className: 'payment-value',
    id: 'monthly-payment-value',
    text: state.monthlyPayment ? formatCurrency(state.monthlyPayment) : '--'
  });

  appendChildren(paymentCard, [paymentLabel, paymentValue]);
  appendChildren(form, [incomeField.group, amountGroup, formGrid, paymentCard]);
  appendChildren(section, [header, form]);
  container.append(section);

  syncMonthlyPayment(paymentValue);
}

function syncMonthlyPayment(paymentNode) {
  const state = Store.getAppState();

  if (state.loanAmount && state.loanPeriod && state.interestRate) {
    const payment = Calculator.calculateMonthlyPayment(
      Number(state.loanAmount),
      Number(state.interestRate),
      Number(state.loanPeriod)
    );

    Store.updateState({ monthlyPayment: payment });
    paymentNode.textContent = formatCurrency(payment);
    return;
  }

  Store.updateState({ monthlyPayment: null });
  paymentNode.textContent = '--';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-EE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(Number(value));
}

function notifyStateUpdate(callback) {
  if (typeof callback === 'function') {
    callback();
  }
}

window.Step2 = { render: renderStep2 };
