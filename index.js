require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const MONGODB_URI = process.env.MONGODB_URI || (!isProduction ? 'mongodb://localhost:27017/agrovision' : null);

const startServer = () => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[${NODE_ENV}] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[${NODE_ENV}] Environment: ${NODE_ENV}`);
    console.log(`Database ready state: ${mongoose.connection.readyState}`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const handleStartup = () => {
  if (MONGODB_URI) {
    connectDB(MONGODB_URI)
      .then(() => {
        startServer();
      })
      .catch((err) => {
        console.error('MongoDB connection failed:', err.message || err);
        console.warn('Starting in degraded mode. Set a valid MONGODB_URI to enable full database functionality.');
        startServer();
      });
  } else {
    console.warn('MONGODB_URI is not configured. Starting in degraded mode.');
    startServer();
  }
};

handleStartup();