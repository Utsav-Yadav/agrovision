require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrovision';
const NODE_ENV = process.env.NODE_ENV || 'development';

connectDB(MONGODB_URI).then(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[${NODE_ENV}] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[${NODE_ENV}] Environment: ${NODE_ENV}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});