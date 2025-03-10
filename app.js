require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const ejsLayouts = require('express-ejs-layouts');
const { connectDB } = require('./config/database');

// Initialize express app
const app = express();

// Set view engine and layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Admin layout middleware
app.use('/admin', (req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

// Global middlewares
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers with comprehensive CSP settings
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "*", "data:", "blob:"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:", "*"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "*"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "*"],
        imgSrc: ["'self'", "data:", "https:", "http:", "*"],
        connectSrc: ["'self'", "*"],
        frameSrc: ["'self'", "*"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "*"]
      }
    }
  })
);

// Add CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again after an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my-ultra-secure-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  })
);

// Routes
const viewRoutes = require('./routes/viewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Route middlewares
app.use('/admin', adminRoutes); // Admin routes should be before the main routes
app.use('/', viewRoutes);
app.use('/api/contact', contactRoutes);

// Connect to MongoDB before starting the server
connectDB().then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle specific HTTP error status codes
app.use('/400', (req, res) => {
  res.status(400).render('errors/400', {
    title: 'Bad Request',
    msg: 'The request could not be understood by the server.'
  });
});

app.use('/401', (req, res) => {
  res.status(401).render('errors/401', {
    title: 'Unauthorized',
    msg: 'You are not authorized to access this resource.'
  });
});

app.use('/403', (req, res) => {
  res.status(403).render('errors/403', {
    title: 'Forbidden',
    msg: 'You don\'t have permission to access this resource.'
  });
});

// 404 page - catch all undefined routes
app.all('*', (req, res) => {
  res.status(404).render('errors/404', {
    title: 'Page Not Found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('ERROR 💥', err);
  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Basic error formatting
  const formattedError = {
    message: err.message,
    status: err.status,
    statusCode: err.statusCode
  };

  // Handle different error types
  switch (err.statusCode) {
    case 400:
      return res.status(400).render('errors/400', {
        title: 'Bad Request',
        msg: formattedError.message || 'The request could not be understood by the server.',
        errorPage: true
      });
    
    case 401:
      return res.status(401).render('errors/401', {
        title: 'Unauthorized',
        msg: formattedError.message || 'You are not authorized to access this resource.',
        errorPage: true
      });
    
    case 403:
      return res.status(403).render('errors/403', {
        title: 'Forbidden',
        msg: formattedError.message || 'You don\'t have permission to access this resource.',
        errorPage: true
      });
    
    case 404:
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
        msg: formattedError.message || 'The page you are looking for could not be found.',
        path: req.originalUrl,
        errorPage: true
      });
    
    case 405:
      return res.status(405).render('errors/405', {
        title: 'Method Not Allowed',
        msg: formattedError.message || 'The requested method is not allowed for this URL.',
        errorPage: true
      });
    
    case 408:
      return res.status(408).render('errors/408', {
        title: 'Request Timeout',
        msg: formattedError.message || 'The server timed out waiting for the request to complete.',
        errorPage: true
      });
    
    case 429:
      return res.status(429).render('errors/429', {
        title: 'Too Many Requests',
        msg: formattedError.message || 'You have exceeded the rate limit. Please try again later.',
        errorPage: true
      });
    
    default:
      // Default to 500 server error
      return res.status(500).render('errors/500', {
        title: 'Something went wrong!',
        msg: process.env.NODE_ENV === 'development' 
          ? formattedError.message || 'An unexpected error occurred.'
          : 'An unexpected error occurred. Our team has been notified.',
        errorPage: true
      });
  }
});

// Rate limiter error handler
app.use((err, req, res, next) => {
  if (err instanceof Error && err.code === 'LIMIT_REACHED') {
    return res.status(429).render('errors/429', {
      title: 'Too Many Requests',
      msg: 'You have exceeded the allowed number of requests. Please try again later.',
      errorPage: true
    });
  }
  next(err);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});