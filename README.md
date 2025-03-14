# Web Developer Portfolio

A modern, responsive web developer portfolio built with Node.js, Express, and EJS. Features a dark/light theme toggle, comprehensive security measures, and an admin dashboard for content management.

## Features

- 🎨 Dark/Light Theme Toggle
- 🔒 Enterprise-Grade Security
  - XSS Protection with xss-clean
  - Comprehensive CSP Headers
  - Rate Limiting for API endpoints
  - MongoDB Atlas Integration
  - Secure Session Management
  - HTTP Parameter Pollution Protection
- 📱 Responsive Design
  - Mobile-first approach
  - Fluid typography
  - Optimized images
  - Smooth animations
- 🚀 Performance Optimized
  - Response Compression
  - Asset Optimization
  - Efficient Database Queries
  - Error Handling & Logging
- 💼 Project Management
  - Admin Dashboard
  - CRUD Operations for Projects
  - Image Upload Support
  - Category Management
- 📝 Contact System
  - Form Validation
  - Error Handling
  - Success Notifications
- 🛠 Technologies Display
  - Dynamic Tech Stack Grid
  - Skill Categories
  - Progress Indicators
- 🔐 Admin Features
  - Secure Authentication
  - User Management
  - Activity Logging
  - Password Recovery

## Technology Stack

- **Backend**
  - Node.js
  - Express.js
  - MongoDB Atlas
  - EJS Template Engine
- **Frontend**
  - HTML5/CSS3
  - Vanilla JavaScript
  - CSS Grid/Flexbox
  - Custom Animations
- **Security**
  - helmet (Security Headers)
  - xss-clean (XSS Protection)
  - express-rate-limit
  - hpp (HTTP Parameter Pollution)
  - bcrypt (Password Hashing)
- **Development**
  - ESLint
  - nodemon
  - Morgan Logger
  - Debug Tools

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm/yarn
- MongoDB Atlas Account
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```properties
   NODE_ENV=development
   PORT=3000
   SESSION_SECRET=your-ultra-secure-secret-key
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
   DB_NAME=portfolio
   ```

4. Initialize admin user:
   ```bash
   node utils/initAdmin.js
   ```

5. Test database connection:
   ```bash
   node utils/testConnection.js
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

### First-Time Setup

1. Log in to admin dashboard at `/admin/login`
   - Default credentials:
     - Username: admin
     - Password: admin123
   - **Important**: Change these immediately after first login

2. Configure your portfolio:
   - Add your projects
   - Update personal information
   - Set up contact form

3. Test all features:
   - Contact form
   - Project filters
   - Admin operations
   - Theme toggle

## Project Structure

```
.
├── app.js                # Application entry point
├── config/              # Configuration files
│   └── database.js      # MongoDB configuration
├── controllers/         # Route controllers
│   ├── adminController.js
│   ├── contactController.js
│   └── viewController.js
├── middleware/         # Express middleware
│   └── auth.js        # Authentication
├── public/            # Static assets
│   ├── css/          # Stylesheets
│   ├── js/           # Client JavaScript
│   └── images/       # Image assets
├── routes/           # Route definitions
├── utils/           # Utility functions
├── views/           # EJS templates
└── .env            # Environment variables
```

## Security Implementation

### Headers & Protection
- **CSP Headers**: Configured in app.js with comprehensive rules
- **XSS Protection**: Input sanitization and output encoding
- **CSRF**: Token validation for forms
- **Rate Limiting**: API endpoint protection

### Database Security
- **MongoDB Atlas**: Cloud-hosted with encryption
- **Connection Pooling**: Optimized database connections
- **Query Sanitization**: Prevention of NoSQL injection

### Authentication
- **Session Management**: Secure cookie configuration
- **Password Security**: bcrypt hashing with salt
- **Access Control**: Role-based authorization

## Error Handling

The application implements a comprehensive error handling system:

1. **Development vs Production**
   - Detailed errors in development
   - Generic messages in production

2. **Error Logging**
   - File-based logging
   - Error categorization
   - Stack trace preservation

3. **User Feedback**
   - Clear error messages
   - Proper HTTP status codes
   - Redirect handling

## Customization

### Theme Configuration

Edit `public/css/base/variables.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Content Management

Use the admin dashboard to:
- Manage projects
- Update personal info
- Configure contact form
- Handle user accounts

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

Licensed under the ISC License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- Font Awesome - Icons
- devicons - Tech stack icons
- MongoDB Atlas - Database hosting
- Express.js community
- Node.js community
