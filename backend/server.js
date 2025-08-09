import express from 'express';
import cors from 'cors';
import scenarioRoutes from './routes/scenario.js';
import animationRoutes from './routes/animation.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://www.thoradinpiferon.com',
  'https://thoradinpiferon.com',
  'https://thoradin-site.vercel.app',
  'https://thoradin-site-git-main-thoradinpiferon.vercel.app'
];

// Add environment variable for additional origins
if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for correct IP detection
app.set('trust proxy', 1);

// Static file serving for backgrounds
app.use('/backgrounds', express.static('public/backgrounds'));

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Thoradin Clean Architecture API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Database fix endpoint (temporary)
app.get('/api/fix-db', async (req, res) => {
  try {
    console.log('🔧 Manual database fix triggered...');
    const { execSync } = await import('child_process');
    
    // Run the database fix
    execSync('npm run fix:db', { stdio: 'pipe' });
    
    res.json({
      success: true,
      message: 'Database fix completed successfully'
    });
  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database fix failed',
      error: error.message
    });
  }
});

// Scenario routes
app.use('/api/scenario', scenarioRoutes);

// Animation generation routes
app.use('/api/animation', animationRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Thoradin Clean Architecture API running on port ${PORT}`);
  console.log(`🎭 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎭 Scenario API: http://localhost:${PORT}/api/scenario`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; 