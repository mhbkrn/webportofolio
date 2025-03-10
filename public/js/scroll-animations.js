// Scroll reveal functionality
document.addEventListener('DOMContentLoaded', () => {
  // Function to check if an element is in viewport
  const isInViewport = (element, offset = 150) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset || document.documentElement.clientHeight - offset) &&
      rect.bottom >= 0
    );
  };

  // All elements with fade-in class that should animate on scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  
  // First check for elements already in view on page load
  fadeElements.forEach(element => {
    if (isInViewport(element)) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });

  // Then add scroll event to reveal elements when they come into view
  const handleScroll = () => {
    fadeElements.forEach(element => {
      if (isInViewport(element)) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Throttle function to limit the scroll event firing too often
  const throttle = (callback, delay) => {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return callback(...args);
    };
  };

  // Add scroll event listener with throttling
  window.addEventListener('scroll', throttle(handleScroll, 100));
});