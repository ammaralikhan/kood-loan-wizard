/**
 * Step 3: Consents
 * Handles consent checkboxes with proper validation
 */

window.Step3 = {
  render: function() {
    const state = window.Store.getAppState();
    const consents = state.consents || [];
    
    return `
      <fieldset class="form-group">
        <legend>Consents</legend>
        
        <div class="form-group">
          <label class="consent-label">
            <input type="checkbox" id="consent-marketing" name="consents" value="marketing"
                   ${consents.includes('marketing') ? 'checked' : ''}>
            <span>I agree to receive marketing communications</span>
          </label>
        </div>
        
        <div class="form-group">
 <label class="consent-label">
            <input type="checkbox" id="consent-terms" name="consents" value="terms"
                   ${consents.includes('terms') ? 'checked' : ''}>
            <span>I accept the terms and conditions *</span>
          </label>
        </div>
        
        <div class="form-group">
          <label class="consent-label">
            <input type="checkbox" id="consent-credit" name="consents" value="credit"
                   ${consents.includes('credit') ? 'checked' : ''}>
            <span>I authorize credit checks</span>
          </label>
        </div>
        
        <div class="error-message" id="consents-error"></div>
      </fieldset>
    `;
  },
  
  validate: function() {
    const state = window.Store.getAppState();
    const consents = state.consents || [];
    
    // At least one consent required (terms is mandatory)
    const isTermsChecked = consents.includes('terms');
    const isValid = isTermsChecked; // For this example, we'll require only terms
    
    // Update error message
    const errorElement = document.getElementById('consents-error');
    if (errorElement) {
      errorElement.textContent = isValid ? '' : 'You must accept the terms and conditions';
    }
    
    return isValid;
  },
  
  init: function() {
    // Handle checkbox changes
    document.querySelectorAll('input[name="consents"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const checked = Array.from(document.querySelectorAll('input[name="consents"]:checked'))
          .map(cb => cb.value);
        
        window.Store.updateState({ consents: checked });
        this.validate();
      });
    });
    
    // Initial validation
    this.validate();
  }
};