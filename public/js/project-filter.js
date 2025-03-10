document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectItems = document.querySelector('.project-items');
  const noProjectsMessage = document.createElement('div');
  noProjectsMessage.className = 'no-projects';
  noProjectsMessage.innerHTML = '<p>No projects found in this category.</p>';

  function filterProjects(category) {
    let hasVisibleProjects = false;

    projectCards.forEach(card => {
      const projectCategory = card.dataset.category;
      if (category === 'all' || projectCategory === category) {
        card.style.display = '';
        card.classList.add('fade-in');
        hasVisibleProjects = true;
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });

    // Show/hide no projects message
    if (!hasVisibleProjects) {
      projectItems.appendChild(noProjectsMessage);
    } else if (projectItems.contains(noProjectsMessage)) {
      projectItems.removeChild(noProjectsMessage);
    }

    // Update active state of filter buttons
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Update URL without page reload
    const url = new URL(window.location.href);
    if (category === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
  }

  // Initialize all cards with fade-in on page load
  function initializeCards() {
    const url = new URL(window.location.href);
    const initialCategory = url.searchParams.get('category') || 'all';
    
    // Add staggered fade-in to all cards that should be visible
    projectCards.forEach((card, index) => {
      const projectCategory = card.dataset.category;
      if (initialCategory === 'all' || projectCategory === initialCategory) {
        setTimeout(() => {
          card.classList.add('fade-in');
        }, index * 100); // Stagger each card by 100ms
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Update active state of filter buttons
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === initialCategory);
    });
  }

  // Initialize cards on page load
  requestAnimationFrame(() => {
    initializeCards();
  });

  // Add click event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      filterProjects(category);
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const url = new URL(window.location.href);
    const category = url.searchParams.get('category') || 'all';
    filterProjects(category);
  });
});