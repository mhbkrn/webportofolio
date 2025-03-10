const asyncHandler = require('express-async-handler');
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// Admin authentication functions
exports.getLogin = (req, res) => {
  // If already logged in, redirect to admin dashboard
  if (req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: 'Admin Login',
    layout: 'layouts/main' // Use main layout for login page
  });
};

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  // Basic validation
  if (!username || !password) {
    return res.status(400).render('admin/login', {
      title: 'Admin Login',
      layout: 'layouts/main',
      error: 'Username and password are required'
    });
  }

  try {
    // Get database connection
    const db = getDB();
    
    // Find the admin user in the database
    const admin = await db.collection('admins').findOne({ username });
    
    // If user doesn't exist or password doesn't match
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).render('admin/login', {
        title: 'Admin Login',
        layout: 'layouts/main',
        error: 'Invalid credentials'
      });
    }
    
    // Update last login time
    await db.collection('admins').updateOne(
      { _id: admin._id }, 
      { $set: { lastLogin: new Date() } }
    );
    
    // Set session data
    req.session.isAdmin = true;
    req.session.adminId = admin._id.toString();
    req.session.adminUsername = admin.username;
    
    // Redirect to admin dashboard
    res.redirect('/admin');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('admin/login', {
      title: 'Admin Login',
      layout: 'layouts/main',
      error: 'An error occurred during login. Please try again.'
    });
  }
});

exports.logout = (req, res) => {
  // Destroy session
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

// Get all projects
exports.getProjects = asyncHandler(async (req, res) => {
  const db = getDB();
  const projects = await db.collection('projects').find({}).toArray();
  res.render('admin/projects', {
    title: 'Manage Projects',
    active: 'projects',
    projects,
    adminUsername: req.session.adminUsername // Pass admin username to template
  });
});

// Get add project form
exports.getAddProject = asyncHandler(async (req, res) => {
  res.render('admin/add-project', {
    title: 'Add Project',
    active: 'projects'
  });
});

// Add new project
exports.addProject = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    const { title, description, image, technologies, githubLink, liveLink, category } = req.body;
    
    // Validate required fields
    if (!title || !description || !image || !technologies || !githubLink || !liveLink || !category) {
      return res.status(400).render('admin/add-project', {
        title: 'Add Project',
        active: 'projects',
        error: 'All fields are required',
        data: req.body // Pass back the form data
      });
    }

    // Convert technologies string to array if it's a string
    const techArray = typeof technologies === 'string' ? 
      technologies.split(',').map(tech => tech.trim()) : 
      technologies;

    const project = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      category: category.trim(),
      technologies: techArray.filter(tech => tech.length > 0), // Remove empty entries
      githubLink: githubLink.trim(),
      liveLink: liveLink.trim(),
      createdAt: new Date()
    };

    await db.collection('projects').insertOne(project);
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).render('admin/add-project', {
      title: 'Add Project',
      active: 'projects',
      error: 'Error adding project. Please try again.',
      data: req.body
    });
  }
});

// Get edit project form
exports.getEditProject = asyncHandler(async (req, res) => {
  const db = getDB();
  const project = await db.collection('projects').findOne({
    _id: new ObjectId(req.params.id)
  });

  if (!project) {
    return res.status(404).render('errors/404', {
      title: 'Project Not Found',
      msg: 'The project you are trying to edit does not exist.'
    });
  }

  res.render('admin/edit-project', {
    title: 'Edit Project',
    active: 'projects',
    project
  });
});

// Update project
exports.updateProject = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    const { title, description, image, technologies, githubLink, liveLink, category } = req.body;
    
    // Validate required fields
    if (!title || !description || !image || !technologies || !githubLink || !liveLink || !category) {
      const project = await db.collection('projects').findOne({
        _id: new ObjectId(req.params.id)
      });
      
      return res.render('admin/edit-project', {
        title: 'Edit Project',
        active: 'projects',
        error: 'All fields are required',
        project: {
          ...project,
          ...req.body
        }
      });
    }

    const techArray = typeof technologies === 'string' ? 
      technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0) : 
      technologies;

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          title: title.trim(),
          description: description.trim(),
          image: image.trim(),
          category: category.trim(),
          technologies: techArray,
          githubLink: githubLink.trim(),
          liveLink: liveLink.trim(),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).render('errors/404', {
        title: 'Project Not Found',
        msg: 'The project you are trying to update does not exist.',
        layout: 'layouts/main'
      });
    }

    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error updating project:', error);
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    res.status(500).render('admin/edit-project', {
      title: 'Edit Project',
      active: 'projects',
      error: 'Error updating project. Please try again.',
      project: {
        ...project,
        ...req.body
      }
    });
  }
});

// Delete project
exports.deleteProject = asyncHandler(async (req, res) => {
  const db = getDB();
  await db.collection('projects').deleteOne({
    _id: new ObjectId(req.params.id)
  });

  res.redirect('/admin/projects');
});

// Admin User Management

// Get all admin users
exports.getAdminUsers = asyncHandler(async (req, res) => {
  const db = getDB();
  const adminUsers = await db.collection('admins')
    .find({}, { projection: { password: 0 } }) // Exclude password from results
    .toArray();
    
  res.render('admin/users', {
    title: 'Manage Admins',
    active: 'users',
    adminUsers,
    adminUsername: req.session.adminUsername
  });
});

// Get form to add a new admin user
exports.getAddAdminUser = asyncHandler(async (req, res) => {
  res.render('admin/add-user', {
    title: 'Add Admin User',
    active: 'users',
    adminUsername: req.session.adminUsername
  });
});

// Add a new admin user
exports.addAdminUser = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    const { username, password, email, fullName } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).render('admin/add-user', {
        title: 'Add Admin User',
        active: 'users',
        error: 'Username and password are required',
        data: {
          username,
          email,
          fullName
        },
        adminUsername: req.session.adminUsername
      });
    }
    
    // Check if username already exists
    const existingUser = await db.collection('admins').findOne({ username });
    if (existingUser) {
      return res.status(400).render('admin/add-user', {
        title: 'Add Admin User',
        active: 'users',
        error: 'Username already exists',
        data: {
          username,
          email,
          fullName
        },
        adminUsername: req.session.adminUsername
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new admin user
    const adminUser = {
      username: username.trim(),
      password: hashedPassword,
      email: email ? email.trim() : null,
      fullName: fullName ? fullName.trim() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.session.adminUsername,
      lastLogin: null
    };
    
    await db.collection('admins').insertOne(adminUser);
    res.redirect('/admin/users');
    
  } catch (error) {
    console.error('Error adding admin user:', error);
    res.status(500).render('admin/add-user', {
      title: 'Add Admin User',
      active: 'users',
      error: 'Error adding admin user. Please try again.',
      data: req.body,
      adminUsername: req.session.adminUsername
    });
  }
});

// Get form to edit an admin user
exports.getEditAdminUser = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    const adminUser = await db.collection('admins').findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!adminUser) {
      return res.status(404).render('errors/404', {
        title: 'Admin User Not Found',
        msg: 'The admin user you are trying to edit does not exist.'
      });
    }
    
    res.render('admin/edit-user', {
      title: 'Edit Admin User',
      active: 'users',
      adminUser,
      adminUsername: req.session.adminUsername
    });
    
  } catch (error) {
    console.error('Error retrieving admin user:', error);
    res.redirect('/admin/users');
  }
});

// Update an admin user
exports.updateAdminUser = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    const { username, password, email, fullName } = req.body;
    
    // Validate required fields
    if (!username) {
      const adminUser = await db.collection('admins').findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { password: 0 } }
      );
      
      return res.status(400).render('admin/edit-user', {
        title: 'Edit Admin User',
        active: 'users',
        error: 'Username is required',
        adminUser: {
          ...adminUser,
          ...req.body
        },
        adminUsername: req.session.adminUsername
      });
    }
    
    // Check if username is taken by another user
    const existingUser = await db.collection('admins').findOne({
      username,
      _id: { $ne: new ObjectId(req.params.id) }
    });
    
    if (existingUser) {
      const adminUser = await db.collection('admins').findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { password: 0 } }
      );
      
      return res.status(400).render('admin/edit-user', {
        title: 'Edit Admin User',
        active: 'users',
        error: 'Username already exists',
        adminUser: {
          ...adminUser,
          ...req.body
        },
        adminUsername: req.session.adminUsername
      });
    }
    
    // Build update object
    const updateData = {
      username: username.trim(),
      email: email ? email.trim() : null,
      fullName: fullName ? fullName.trim() : null,
      updatedAt: new Date(),
      updatedBy: req.session.adminUsername
    };
    
    // Only update password if provided
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const result = await db.collection('admins').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).render('errors/404', {
        title: 'Admin User Not Found',
        msg: 'The admin user you are trying to update does not exist.'
      });
    }
    
    // Update session if current admin updated their own account
    if (req.params.id === req.session.adminId && username !== req.session.adminUsername) {
      req.session.adminUsername = username;
    }
    
    res.redirect('/admin/users');
    
  } catch (error) {
    console.error('Error updating admin user:', error);
    res.status(500).render('admin/edit-user', {
      title: 'Edit Admin User',
      active: 'users',
      error: 'Error updating admin user. Please try again.',
      adminUser: req.body,
      adminUsername: req.session.adminUsername
    });
  }
});

// Delete an admin user
exports.deleteAdminUser = asyncHandler(async (req, res) => {
  try {
    const db = getDB();
    
    // Prevent an admin from deleting their own account
    if (req.params.id === req.session.adminId) {
      return res.status(400).redirect('/admin/users?error=self-delete');
    }
    
    // Get count of admin users to prevent deleting the last admin
    const adminCount = await db.collection('admins').countDocuments();
    if (adminCount <= 1) {
      return res.status(400).redirect('/admin/users?error=last-admin');
    }
    
    await db.collection('admins').deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.redirect('/admin/users?error=delete-failed');
  }
});