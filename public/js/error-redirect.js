// Error page handling
document.addEventListener('DOMContentLoaded', () => {
  // Add ripple effect to error page buttons
  const errorButtons = document.querySelectorAll('.error-actions .btn');
  
  errorButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });
  
  // Add countdown elements
  const errorContent = document.querySelector('.error-content');
  if (errorContent) {
    const countdownText = document.createElement('div');
    countdownText.classList.add('countdown-text');
    
    const progressBar = document.createElement('div');
    progressBar.classList.add('redirect-progress');
    
    const progressBarInner = document.createElement('div');
    progressBarInner.classList.add('redirect-progress-bar');
    progressBar.appendChild(progressBarInner);
    
    errorContent.appendChild(countdownText);
    errorContent.appendChild(progressBar);
    
    let timeLeft = 10;
    let redirectTimer;
    
    const updateCountdown = () => {
      countdownText.textContent = `Redirecting to home in ${timeLeft} seconds...`;
      progressBarInner.style.width = (timeLeft * 10) + '%';
      
      if (timeLeft > 0) {
        timeLeft--;
        redirectTimer = setTimeout(updateCountdown, 1000);
      } else {
        window.location.href = '/';
      }
    };
    
    // Pause countdown on hover
    errorContent.addEventListener('mouseenter', () => {
      clearTimeout(redirectTimer);
      countdownText.textContent = 'Move mouse away to resume countdown...';
    });
    
    errorContent.addEventListener('mouseleave', () => {
      updateCountdown();
    });
    
    // Start countdown
    updateCountdown();
  }
});