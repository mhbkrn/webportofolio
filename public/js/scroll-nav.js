// Script to handle navigation visibility based on scroll position
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  
  let lastScrollY = window.scrollY;
  let heroHeight = 0;
  let heroContentPosition = 0;
  let hasPassedHeroContent = false;
  
  // Get the initial positions
  function updatePositions() {
    if (heroSection && heroContent) {
      heroHeight = heroSection.offsetHeight;
      heroContentPosition = heroContent.offsetTop + heroSection.offsetTop;
    }
  }
  
  // Initial update
  updatePositions();
  
  // Make header visible initially
  header.classList.add('visible');
  
  // Update on resize
  window.addEventListener('resize', updatePositions);

  // Handle scroll events
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Mark if we've passed the hero content
    if (currentScrollY > heroContentPosition) {
      hasPassedHeroContent = true;
    }
    
    // Only hide nav when we've scrolled past hero content at least once
    if (hasPassedHeroContent) {
      // Hide nav when scrolling down and passing the hero content
      if (currentScrollY > heroContentPosition && currentScrollY > lastScrollY) {
        header.classList.add('hidden');
        header.classList.remove('visible');
      } 
      // Show nav when scrolling up or at the top
      else {
        header.classList.remove('hidden');
        header.classList.add('visible');
      }
    }
    
    // Save last scroll position
    lastScrollY = currentScrollY;
  });

  // Add scroll event listener to handle hero background
  document.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroRect = hero.getBoundingClientRect();
    const isHeroVisible = heroRect.bottom > 0;
    
    // Only show hero background when hero section is visible
    if (isHeroVisible) {
      hero.style.visibility = 'visible';
      hero.style.opacity = Math.max(0, Math.min(1, heroRect.bottom / heroRect.height));
    } else {
      hero.style.visibility = 'hidden';
    }
  });
});