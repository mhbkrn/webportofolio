// Admin dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
  const projectForm = document.querySelector('.project-form form');
  
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic form validation
      const fields = ['title', 'description', 'image', 'technologies', 'githubLink', 'liveLink', 'category'];
      const values = {};
      let hasError = false;

      fields.forEach(field => {
        const input = document.getElementById(field);
        const value = input.value.trim();
        values[field] = value;
        
        if (!value) {
          hasError = true;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });

      if (hasError) {
        showError('Please fill in all required fields');
        return;
      }

      // Submit the form if validation passes
      projectForm.submit();
    });
  }

  // Delete confirmation
  const deleteForms = document.querySelectorAll('.delete-form');
  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Are you sure you want to delete this project?')) {
        e.preventDefault();
      }
    });
  });
});

// Show error message
function showError(message) {
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message alert alert-danger';
  errorDiv.textContent = message;
  
  const form = document.querySelector('.project-form');
  form.insertBefore(errorDiv, form.firstChild);

  if (!message.includes('Please fill in all fields')) {
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}