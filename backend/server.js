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
  'https://thoradin-site-git-main-thoradinpiferon.vercel.app',
  'https://thoradin-site-dt49cyysm-thoradins-projects.vercel.app'
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

// Temporary endpoint to create scenario 1.2
app.get('/api/create-scenario-1-2', async (req, res) => {
  try {
    console.log('🌱 Creating scenario 1.2...');
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const scenario1_2 = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 2
        }
      },
      update: {},
      create: {
        sceneId: 1,
        subsceneId: 2,
        title: 'Matrix Complete',
        description: 'The spiral has finished its dance...',
        gridConfig: {
          rows: 7,
          cols: 11,
          gap: '2px',
          padding: '20px',
          debug: false,
          invisibleMode: false,
          matrixAnimationMode: false,
          triggerTile: 'F1',
          excelRange: 'A1:G7'
        },
        animationConfig: {
          type: 'matrix_static',
          speed: 'normal',
          colors: {
            primary: '#00ff00',
            secondary: '#00ffcc',
            background: '#000000'
          },
          text: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS",
          duration: 8000,
          effects: {
            glow: true,
            fade: true,
            spiral: false
          },
          interactiveParams: {
            zoomSpeed: 1.2,
            cursorSensitivity: 0.8,
            animationPause: false
          }
        },
        backgroundPath: null
      }
    });
    
    await prisma.$disconnect();
    
    res.json({
      success: true,
      message: 'Scenario 1.2 created successfully',
      scenario: scenario1_2
    });
  } catch (error) {
    console.error('❌ Error creating scenario 1.2:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create scenario 1.2',
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