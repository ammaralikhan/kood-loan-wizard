function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  const {
    className,
    text,
    htmlFor,
    id,
    name,
    type,
    value,
    attributes,
    properties
  } = options;

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  if (htmlFor) {
    element.htmlFor = htmlFor;
  }

  if (id) {
    element.id = id;
  }

  if (name) {
    element.name = name;
  }

  if (type) {
    element.type = type;
  }

  if (value !== undefined) {
    element.value = value;
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, attributeValue]) => {
      element.setAttribute(key, attributeValue);
    });
  }

  if (properties) {
    Object.assign(element, properties);
  }

  return element;
}

function appendChildren(parent, children) {
  children.forEach((child) => {
    if (child) {
      parent.append(child);
    }
  });

  return parent;
}

function createErrorMessage(id) {
  return createElement('p', {
    className: 'error-message',
    id,
    attributes: { 'aria-live': 'polite' }
  });
}

function createSelectField(config) {
  const { id, labelText, value, options, errorId, onChange } = config;
  const group = createElement('div', { className: 'form-group' });
  const label = createElement('label', { htmlFor: id, text: labelText });
  const select = createElement('select', {
    id,
    name: id,
    attributes: { 'aria-describedby': errorId }
  });

  options.forEach((optionConfig) => {
    const option = createElement('option', {
      value: optionConfig.value,
      text: optionConfig.text
    });

    if (String(optionConfig.value) === String(value)) {
      option.selected = true;
    }

    select.append(option);
  });

  if (onChange) {
    select.addEventListener('change', onChange);
  }

  appendChildren(group, [label, select, createErrorMessage(errorId)]);
  return { group, select };
}

window.DomHelpers = {
  appendChildren,
  createElement,
  createErrorMessage,
  createSelectField
};
