const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Authentication routes (no auth middleware needed)
router.get('/login', adminController.getLogin);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Apply auth middleware to all protected admin routes
router.use(authMiddleware);

// Admin dashboard index - redirect to projects
router.get('/', (req, res) => {
  res.redirect('/admin/projects');
});

// Project management routes
router.get('/projects', adminController.getProjects);
router.get('/projects/add', adminController.getAddProject);
router.post('/projects/add', adminController.addProject);
router.get('/projects/edit/:id', adminController.getEditProject);
router.post('/projects/edit/:id', adminController.updateProject);
router.post('/projects/delete/:id', adminController.deleteProject);

// Admin user management routes
router.get('/users', adminController.getAdminUsers);
router.get('/users/add', adminController.getAddAdminUser);
router.post('/users/add', adminController.addAdminUser);
router.get('/users/edit/:id', adminController.getEditAdminUser);
router.post('/users/edit/:id', adminController.updateAdminUser);
router.post('/users/delete/:id', adminController.deleteAdminUser);

module.exports = router;