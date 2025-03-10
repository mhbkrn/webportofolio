const authMiddleware = (req, res, next) => {
  // Check if user is authenticated via session
  const isAdmin = req.session.isAdmin;
  
  if (!isAdmin) {
    // Redirect to login page
    return res.redirect('/admin/login');
  }
  
  // User is authenticated, proceed to the next middleware/controller
  next();
};

module.exports = authMiddleware;