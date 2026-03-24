/**
 * Step 1: Employment Status
 * Handles radio selection and validation
 */

window.Step1 = {
  render: function() {
    const currentStatus = window.Store.getAppState('employment');
    return `
      <fieldset class="form-group">
        <legend>What is your employment status?</legend>
        <div class="radio-group">
          <div class="radio-option">
            <input type="radio" id="emp-employed" name="employment" value="employed" 
                   ${currentStatus === 'employed' ? 'checked' : ''}>
            <label for="emp-employed">Employed</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="emp-self" name="employment" value="self-employed" 
                   ${currentStatus === 'self-employed' ? 'checked' : ''}>
            <label for="emp-self">Self-employed</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="emp-unemployed" name="employment" value="unemployed" 
                   ${currentStatus === 'unemployed' ? 'checked' : ''}>
            <label for="emp-unemployed">Unemployed</label>
          </div>
        </div>
        <div class="error-message" id="employment-error"></div>
      </fieldset>
    `;
  },
  
  validate: function() {
    const employment = window.Store.getAppState('employment');
    const result = Validators.employment(employment);
    
    const errorElement = document.getElementById('employment-error');
    if (errorElement) {
      errorElement.textContent = result.isValid ? '' : result.error;
    }
    
    return result.isValid;
  },
  
  init: function() {
    const radioButtons = document.querySelectorAll('input[name="employment"]');
    
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        window.Store.updateState({ employment: e.target.value });
        this.validate();  // CRITICAL FIX: Use 'this' instead of 'Step1'
      });
    });
    
    // Initial validation check
    this.validate();
  }
};

