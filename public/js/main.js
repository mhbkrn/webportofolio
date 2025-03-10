// Preloader
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  preloader.classList.add('hidden');
  
  // Remove preloader from DOM after animation completes
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
  // Toggle Nav
  nav.classList.toggle('active');
  
  // Animate Links
  navLinks.forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = '';
    } else {
      link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
    }
  });
  
  // Burger Animation
  burger.classList.toggle('toggle');
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData);
    
    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.location.href = '/contact?success=true';
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

// Project Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-card');

if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(button => button.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filterValue = btn.dataset.filter;
      
      projectItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Theme Switching
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference, else use system preference
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme with animation
const setTheme = (theme) => {
  // Add transition class to body
  document.body.classList.add('mode-transition');
  
  // Set the theme after a small delay to allow animation to start
  setTimeout(() => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon and its color
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      themeIcon.style.color = '#ffd700'; // Golden yellow for sun icon
    } else {
      themeIcon.className = 'fas fa-moon';
      themeIcon.style.color = '#6c757d'; // Muted color for moon icon
    }
  }, 50);
  
  // Remove the transition class after animation completes
  setTimeout(() => {
    document.body.classList.remove('mode-transition');
  }, 500);
};

// Initialize theme
setTheme(getPreferredTheme());

// Handle theme toggle click
themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

// Show button when user scrolls down 300px from the top
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

// Smooth scroll to top when button is clicked
backToTopButton.addEventListener('click', () => {
  // For modern browsers
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // For older browsers
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// Add mouse movement interaction for hero section
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  
  if (hero && heroBg) {
    hero.addEventListener('mousemove', (e) => {
      const { width, height } = hero.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;
      const mouseX = e.clientX - hero.offsetLeft;
      const mouseY = e.clientY - hero.offsetTop;
      
      const moveX = (mouseX - centerX) * 0.02;
      const moveY = (mouseY - centerY) * 0.02;
      
      heroBg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    });
    
    hero.addEventListener('mouseleave', () => {
      heroBg.style.transform = 'translate(0, 0) scale(1)';
    });
  }
});