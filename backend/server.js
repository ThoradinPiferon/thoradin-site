const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Function to find available port
const findAvailablePort = async (startPort) => {
  const net = require('net');
  
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 10) {
      console.error(`No available ports found between ${startPort} and ${startPort + 10}`);
      process.exit(1);
    }
  }
  return port;
};
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(cors({
  origin: NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173'] 
    : process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'GridPlay Backend',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/data', require('./routes/data'));
app.use('/api/grid', require('./routes/grid'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/config', require('./routes/config'));

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist'), {
    maxAge: '1y',
    etag: true
  }));

  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server with port detection
(async () => {
  try {
    const availablePort = await findAvailablePort(PORT);
    app.listen(availablePort, () => {
      console.log(`🚀 GridPlay Backend running on port ${availablePort}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${availablePort}/api/health`);
      console.log(`🎮 Grid API: http://localhost:${availablePort}/api/grid`);
      console.log(`🤖 AI API: http://localhost:${availablePort}/api/ai`);
      if (NODE_ENV === 'development') {
        console.log(`📱 Frontend should be running on http://localhost:3000`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

module.exports = app; 