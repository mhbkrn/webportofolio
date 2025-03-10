document.addEventListener('DOMContentLoaded', () => {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const techStackSection = document.querySelector('.tech-stack');
  const heroSection = document.querySelector('.hero.fullscreen');
  
  if (scrollIndicator && techStackSection && heroSection) {
    // Initially hide the scroll indicator until fully loaded
    scrollIndicator.style.opacity = '0';
    scrollIndicator.style.visibility = 'hidden';
    
    // Show scroll indicator after a short delay
    setTimeout(() => {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.visibility = 'visible';
    }, 1000);
    
    // Add subtle hover effect
    scrollIndicator.addEventListener('mouseenter', () => {
      scrollIndicator.querySelector('.scroll-arrow').style.animationPlayState = 'paused';
    });
    
    scrollIndicator.addEventListener('mouseleave', () => {
      scrollIndicator.querySelector('.scroll-arrow').style.animationPlayState = 'running';
    });
    
    // Smooth scroll to tech-stack section with enhanced smoothness
    scrollIndicator.addEventListener('click', () => {
      // Hide scroll indicator when clicked
      hideScrollIndicator();
      
      // Calculate offset to account for fixed header
      const headerHeight = document.querySelector('header').offsetHeight;
      const techStackTop = techStackSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      // Use smoother scrolling with requestAnimationFrame for better performance
      smoothScrollTo(techStackTop, 1000); // 1000ms duration for the scroll
    });
    
    // Custom smooth scroll function with easing
    function smoothScrollTo(targetY, duration) {
      const startY = window.pageYOffset;
      const difference = targetY - startY;
      let startTime = null;
      
      // Easing function for natural movement (easeInOutQuad)
      const easeInOutQuad = (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
      };
      
      // Animation step function
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Calculate how far to scroll this frame using the easing function
        const newY = easeInOutQuad(elapsed, startY, difference, duration);
        
        window.scrollTo(0, newY);
        
        // Continue the animation until duration is complete
        if (elapsed < duration) {
          window.requestAnimationFrame(step);
        }
      }
      
      // Start the animation
      window.requestAnimationFrame(step);
    }
    
    // Function to hide the scroll indicator
    function hideScrollIndicator() {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.visibility = 'hidden';
    }
    
    // Function to show the scroll indicator
    function showScrollIndicator() {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.visibility = 'visible';
    }
    
    // Function to check if an element is in the viewport
    function isInViewport(elem) {
      const bounding = elem.getBoundingClientRect();
      // Consider an element in viewport if at least 80% of it is visible
      return (
        bounding.top < window.innerHeight * 0.2 &&
        bounding.bottom > window.innerHeight * 0.8
      );
    }
    
    // Handle scroll events to show/hide the scroll indicator
    window.addEventListener('scroll', () => {
      if (isInViewport(heroSection)) {
        showScrollIndicator();
      } else {
        hideScrollIndicator();
      }
    });

    // Initialize the state based on the initial scroll position
    if (isInViewport(heroSection)) {
      showScrollIndicator();
    } else {
      hideScrollIndicator();
    }
  }

  // Also allow scrolling with arrow keys with enhanced smooth scrolling
  document.addEventListener('keydown', (e) => {
    if (!heroSection || !techStackSection) return;
    
    const isInViewport = (elem) => {
      const bounding = elem.getBoundingClientRect();
      return (
        bounding.top < window.innerHeight * 0.2 &&
        bounding.bottom > window.innerHeight * 0.8
      );
    };
    
    if (isInViewport(heroSection) && (e.key === 'ArrowDown' || e.key === 'PageDown')) {
      e.preventDefault();
      const headerHeight = document.querySelector('header').offsetHeight;
      const techStackTop = techStackSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      smoothScrollTo(techStackTop, 1000);
    }
  });
});