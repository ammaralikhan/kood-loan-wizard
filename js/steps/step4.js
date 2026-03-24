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
          <label for="additional-info">Tell us more about your loan purpose (optional)</label>
          <textarea id="additional-info" rows="4" 
                    placeholder="Minimum 10 characters (optional)" 
                    class="form-control">${state.additionalInfo || ''}</textarea>
          <div class="error-message" id="additional-info-error"></div>
          <div class="hint">Characters: <span id="char-count">0</span>/10</div>
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
    const textarea = document.getElementById('additional-info');
    const info = textarea?.value || '';
    
    // Update state
    window.Store.updateState({ additionalInfo: info });
    
    // Optional field - only validate if user started typing
    if (info.length === 0 || info.length >= 10) {
      document.getElementById('additional-info-error').textContent = '';
      return true;
    }
    
    document.getElementById('additional-info-error').textContent = 
      'Minimum 10 characters required';
    return false;
  },
  
  init: function() {
    const textarea = document.getElementById('additional-info');
    const charCount = document.getElementById('char-count');
    
    if (textarea && charCount) {
      textarea.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
        this.validate();
      });
      
      // Initial count
      charCount.textContent = textarea.value.length;
    }
    
    // Loan purpose
    const loanPurpose = document.getElementById('loan-purpose');
    if (loanPurpose) {
      loanPurpose.addEventListener('change', (e) => {
        window.Store.updateState({ loanPurpose: e.target.value });
      });
    }
    
    this.validate();
  }
};