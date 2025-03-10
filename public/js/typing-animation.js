document.addEventListener('DOMContentLoaded', () => {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  // List of roles/descriptions to cycle through
  const roles = [
    'a Web Developer',
    'a Problem Solver',
    'a Creative Thinker'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100; // Base typing speed in ms

  function type() {
    // Current role being typed/deleted
    const currentRole = roles[roleIndex];
    
    // Speed adjustments
    if (isDeleting) {
      // Faster when deleting
      typingSpeed = 50;
    } else {
      // Slower when typing
      typingSpeed = 100;
    }
    
    // Add/remove characters
    if (!isDeleting && charIndex < currentRole.length) {
      // Typing
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Switch between typing and deleting
      isDeleting = !isDeleting;
      
      if (!isDeleting) {
        // Move to next role after deleting
        roleIndex = (roleIndex + 1) % roles.length;
        // Pause at the end of deletion
        typingSpeed = 500;
      } else {
        // Pause at the end of typing
        typingSpeed = 1000;
      }
    }
    
    // Set up next iteration
    setTimeout(type, typingSpeed);
  }
  
  // Start the typing animation
  setTimeout(type, 1000);
});