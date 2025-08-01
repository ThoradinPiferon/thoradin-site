import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import net from 'net';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for proper IP detection behind Render/Vercel
app.set('trust proxy', 1);

// Function to find available port
const findAvailablePort = async (startPort) => {
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

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173'] 
    : ['https://thoradin-site.vercel.app', 'https://thoradin-site-git-main-thoradinpiferon.vercel.app', 'https://thoradin-site-thoradinpiferon.vercel.app', 'https://www.thoradinpiferon.com', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// If no specific origins are configured, allow all (for debugging)
if (NODE_ENV === 'production' && corsOptions.origin.length === 0) {
  corsOptions.origin = true; // Allow all origins
}

app.use(cors(corsOptions));
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

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GridPlay Backend API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      data: '/api/data',
      grid: '/api/grid',
      ai: '/api/ai',
      config: '/api/config'
    },
    documentation: 'This is the backend API for the GridPlay application. The frontend is deployed separately on Vercel.'
  });
});

// API Routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import dataRoutes from './routes/data.js';
import gridRoutes from './routes/grid.js';
import aiRoutes from './routes/ai.js';
import configRoutes from './routes/config.js';
import sceneRoutes from './routes/scene.js';
import adminRoutes from './routes/admin.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/grid', gridRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/config', configRoutes);
app.use('/api/scene', sceneRoutes);
app.use('/api/admin', adminRoutes);

// Handle non-API routes in production
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.json({
        success: false,
        message: 'Frontend not found. This is the backend API only.',
        apiEndpoints: {
          health: '/api/health',
          auth: '/api/auth',
          users: '/api/users',
          data: '/api/data',
          grid: '/api/grid',
          ai: '/api/ai',
          config: '/api/config'
        }
      });
    }
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

export default app; 