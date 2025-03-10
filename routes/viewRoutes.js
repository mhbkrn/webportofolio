const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

// Main routes
router.get('/', viewController.getHomePage);
router.get('/about', viewController.getAboutPage);
router.get('/projects', viewController.getProjectsPage);
router.get('/contact', viewController.getContactPage);

// Catch all undefined routes and redirect to 404 error page
router.all('*', (req, res) => {
  res.status(404).render('errors/404', {
    title: 'Page Not Found',
    path: req.originalUrl
  });
});

module.exports = router;