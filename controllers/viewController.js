const asyncHandler = require('express-async-handler');
const { getDB } = require('../config/database');

// Helper function to handle database errors
const handleDatabaseError = (error, res, page, data = {}) => {
  console.error(`Error fetching data for ${page}:`, error);
  return res.render(page, {
    ...data,
    projects: [],
    featuredProjects: [],
    categories: [],
    currentCategory: 'all'
  });
};

// Get home page with featured projects
exports.getHomePage = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    const featuredProjects = await db.collection('projects')
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    return res.render('home', {
      title: 'Web Developer Portfolio',
      active: 'home',
      featuredProjects: featuredProjects || []
    });
  } catch (error) {
    return handleDatabaseError(error, res, 'home', {
      title: 'Web Developer Portfolio',
      active: 'home'
    });
  }
});

// Get about page
exports.getAboutPage = (req, res) => {
  return res.render('about', {
    title: 'About Me',
    active: 'about'
  });
};

// Get projects page with category filtering
exports.getProjectsPage = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    let query = {};
    
    // Add category filter if provided
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Get all projects with optional category filter
    const [projects, categories] = await Promise.all([
      db.collection('projects')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection('projects')
        .distinct('category')
    ]);

    return res.render('projects', {
      title: 'My Projects',
      active: 'projects',
      projects: projects || [],
      categories: categories || [],
      currentCategory: req.query.category || 'all'
    });
  } catch (error) {
    return handleDatabaseError(error, res, 'projects', {
      title: 'My Projects',
      active: 'projects'
    });
  }
});

// Get contact page
exports.getContactPage = (req, res) => {
  return res.render('contact', {
    title: 'Contact Me',
    active: 'contact',
    success: req.query.success === 'true'
  });
};