window.Step4 = {

  render: function() {
    const currentValue = window.Store.getAppState('additionalInfo');
    return `
      <fieldset class="form-group">
        <legend>Additional Information</legend>
        <div class="input-group">
          <label for="additional-info">Please provide any additional details</label>
          <textarea 
            id="additional-info" 
            name="additionalInfo" 
            rows="5"
            minlength="10"
            placeholder="Type at least 10 characters..."
          >${currentValue || ''}</textarea>
          <div class="char-counter" id="char-counter">
            ${currentValue ? currentValue.length : 0}/10 characters
          </div>
          <div class="error-message" id="additional-info-error"></div>
        </div>
      </fieldset>
    `;
  },

  validate: function() {
    const additionalInfo = window.Store.getAppState('additionalInfo');
    const result = Validators.minLength(additionalInfo, 10, 'Additional info');

    const errorElement = document.getElementById('additional-info-error');
    if (errorElement) {
      errorElement.textContent = result.isValid ? '' : result.error;
    }

    return result.isValid;
  },

  init: function() {
    const textarea = document.getElementById('additional-info');
    const counter = document.getElementById('char-counter');

    textarea.addEventListener('input', (e) => {
      window.Store.updateState({ additionalInfo: e.target.value });
      counter.textContent = `${e.target.value.length}/10 characters`;
      Step4.validate();
    });

    this.validate();
  }
};