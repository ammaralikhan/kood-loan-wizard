function renderStep3(container, options = {}) {
  const { onStateUpdate } = options;
  const { appendChildren, createElement, createErrorMessage } = window.DomHelpers;
  const state = Store.getAppState();

  container.replaceChildren();

  const section = createElement('section', {
    className: 'step step-panel',
    attributes: { 'data-step': '3' }
  });

  const header = createElement('div', { className: 'step-header' });
  appendChildren(header, [
    createElement('p', { className: 'step-eyebrow', text: 'Step 3 of 4' }),
    createElement('h1', { text: 'Consents and confirmations' }),
    createElement('p', {
      className: 'step-description',
      text: 'Please review the statements below and confirm the required consents.'
    })
  ]);

  const form = createElement('form', {
    className: 'wizard-form',
    attributes: { novalidate: '' }
  });

  const fieldset = createElement('fieldset', { className: 'form-group' });
  const legend = createElement('legend', {
    className: 'form-label',
    text: 'Required before continuing'
  });

  const consentList = createElement('div', { className: 'choice-list checkbox-group' });
  const errorMessage = createErrorMessage('consents-error');

  const consentOptions = [
    {
      value: 'terms',
      label: 'I confirm that the information provided in this application is accurate and complete.',
      note: 'Required'
    },
    {
      value: 'credit-check',
      label: 'I agree that my application may be reviewed to assess my eligibility for a loan.',
      note: 'Required'
    },
    {
      value: 'marketing',
      label: 'I would like to receive loan-related offers and updates by email.',
      note: 'Optional'
    }
  ];

  consentOptions.forEach((option) => {
    const choiceCard = createElement('div', { className: 'choice-card consent-card' });
    const inputId = `consent-${option.value}`;
    const input = createElement('input', {
      id: inputId,
      type: 'checkbox',
      name: 'consents',
      value: option.value,
      attributes: { 'aria-describedby': 'consents-error' }
    });
    const label = createElement('label', {
      htmlFor: inputId,
      text: option.label
    });
    const note = createElement('p', {
      className: 'consent-note',
      text: option.note
    });

    input.checked = state.consents.includes(option.value);

    input.addEventListener('change', (event) => {
      const currentConsents = Store.getAppState('consents') || [];
      const nextConsents = event.target.checked
        ? [...new Set([...currentConsents, option.value])]
        : currentConsents.filter((item) => item !== option.value);

      Store.updateState({ consents: nextConsents });

      if (typeof onStateUpdate === 'function') {
        onStateUpdate();
      }
    });

    appendChildren(choiceCard, [input, label, note]);
    consentList.append(choiceCard);
  });

  appendChildren(fieldset, [legend, consentList, errorMessage]);
  form.append(fieldset);
  appendChildren(section, [header, form]);
  container.append(section);
}

window.Step3 = { render: renderStep3 };
