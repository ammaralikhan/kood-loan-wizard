/**
 * Step 4: Additional Information
 * Handles textarea input with validation
 */
window.Step4 = {
  render: function() {
    const state = window.Store.getAppState();
    return `
      <fieldset class="form-group">
        <legend>Additional Information</legend>
        
        <div class="form-group">
          <label for="additional-info">Please provide any additional details</label>
          <textarea 
            id="additional-info" 
            name="additionalInfo" 
            rows="5"
            minlength="10"
            placeholder="Type at least 10 characters..."
          >${state.additionalInfo || ''}</textarea>
          <div class="char-counter" id="char-counter">
            ${state.additionalInfo ? state.additionalInfo.length : 0}/10 characters
          </div>
          <div class="error-message" id="additional-info-error"></div>
        </div>
        
        <div class="form-group">
          <label for="loan-purpose">What is the main purpose of your loan?</label>
          <select id="loan-purpose" class="form-control">
            <option value="">Select purpose</option>
            <option value="home" ${state.loanPurpose === 'home' ? 'selected' : ''}>Home purchase</option>
            <option value="renovation" ${state.loanPurpose === 'renovation' ? 'selected' : ''}>Home renovation</option>
            <option value="car" ${state.loanPurpose === 'car' ? 'selected' : ''}>Car purchase</option>
            <option value="business" ${state.loanPurpose === 'business' ? 'selected' : ''}>Business investment</option>
            <option value="other" ${state.loanPurpose === 'other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
      </fieldset>
    `;
  },
  validate: function() {
    const additionalInfo = window.Store.getAppState('additionalInfo');
    // Optional field - only validate if user typed something
    if (additionalInfo.length > 0 && additionalInfo.length < 10) {
      document.getElementById('additional-info-error').textContent = 'Minimum 10 characters required';
      return false;
    }
    document.getElementById('additional-info-error').textContent = '';
    return true;
  },
  init: function() {
    const textarea = document.getElementById('additional-info');
    const counter = document.getElementById('char-counter');
    
    if (textarea && counter) {
      textarea.addEventListener('input', (e) => {
        window.Store.updateState({ additionalInfo: e.target.value });
        counter.textContent = `${e.target.value.length}/10 characters`;
        this.validate();
      });
      
      // Initial count
      counter.textContent = `${textarea.value.length}/10 characters`;
    }
    
    // Loan purpose dropdown
    const loanPurpose = document.getElementById('loan-purpose');
    if (loanPurpose) {
      loanPurpose.addEventListener('change', (e) => {
        window.Store.updateState({ loanPurpose: e.target.value });
      });
    }
    
    this.validate();
  }
};