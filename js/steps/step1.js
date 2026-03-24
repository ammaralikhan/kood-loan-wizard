function renderStep1(container, options = {}) {
  const { onStateUpdate } = options;
  const { appendChildren, createElement, createErrorMessage } = window.DomHelpers;
  const state = Store.getAppState();

  container.replaceChildren();

  const section = createElement('section', {
    className: 'step step-panel',
    attributes: { 'data-step': '1' }
  });

  const header = createElement('div', { className: 'step-header' });
  const eyebrow = createElement('p', {
    className: 'step-eyebrow',
    text: 'Step 1 of 4'
  });
  const title = createElement('h1', { text: 'Employment status' });
  const description = createElement('p', {
    className: 'step-description',
    text: 'Select the option that best describes your current situation.'
  });

  appendChildren(header, [eyebrow, title, description]);

  const form = createElement('form', {
    className: 'wizard-form',
    attributes: { novalidate: '' }
  });
  const fieldset = createElement('fieldset', { className: 'form-group' });
  const legend = createElement('legend', {
    className: 'form-label',
    text: 'Employment status'
  });
  const choiceList = createElement('div', { className: 'choice-list radio-group' });
  const errorMessage = createErrorMessage('employment-error');

  const employmentOptions = [
    { value: 'employed', label: 'Employed' },
    { value: 'self-employed', label: 'Self-employed' },
    { value: 'unemployed', label: 'Unemployed' }
  ];

  employmentOptions.forEach((option) => {
    const choiceCard = createElement('div', { className: 'choice-card' });
    const inputId = `employment-${option.value}`;
    const input = createElement('input', {
      id: inputId,
      type: 'radio',
      name: 'employment',
      value: option.value,
      attributes: { 'aria-describedby': 'employment-error' }
    });
    const label = createElement('label', {
      htmlFor: inputId,
      text: option.label
    });

    input.checked = state.employment === option.value;
    input.addEventListener('change', () => {
      Store.updateState({ employment: option.value });

      if (typeof onStateUpdate === 'function') {
        onStateUpdate();
      }
    });

    appendChildren(choiceCard, [input, label]);
    choiceList.append(choiceCard);
  });

  appendChildren(fieldset, [legend, choiceList, errorMessage]);
  form.append(fieldset);
  appendChildren(section, [header, form]);
  container.append(section);
}

window.Step1 = { render: renderStep1 };
