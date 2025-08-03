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
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true
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