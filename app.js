const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');

const app = express();

// Trust proxy for production
app.set('trust proxy', 1);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static assets (CSS, JS, images) - but not index.html
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  maxAge: '1d',
  etag: false
}));

// Page routes (server-rendered)
app.use('/', pageRoutes);

// API routes
app.use('/api', apiRoutes);
app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  service: 'AgroVision API',
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).render('error', {
    message: err.message || 'Internal Server Error',
    error: isDevelopment ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    error: {}
  });
});

module.exports = app;