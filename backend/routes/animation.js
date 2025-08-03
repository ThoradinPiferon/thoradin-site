import express from 'express';
import canvasGenerator from '../services/canvasGenerator.js';

const router = express.Router();

/**
 * 🎨 ANIMATION GENERATION API
 * 
 * POST /api/animation/generate
 * Generates canvas animations on the backend and returns the file path
 */

// Generate animation
router.post('/generate', async (req, res) => {
  try {
    const { 
      type = 'matrix_spiral', 
      config = {},
      scenarioId,
      subsceneId 
    } = req.body;
    
    console.log(`🎨 Generating animation: ${type} for scenario ${scenarioId}.${subsceneId}`);
    
    let backgroundPath;
    
    switch (type) {
      case 'matrix_spiral':
        backgroundPath = await canvasGenerator.generateMatrixSpiral(type, config);
        break;
        
      case 'static':
        backgroundPath = await canvasGenerator.generateStaticBackground(config);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: `Unknown animation type: ${type}`
        });
    }
    
    console.log(`✅ Animation generated: ${backgroundPath}`);
    
    res.json({
      success: true,
      backgroundPath,
      type,
      config,
      scenarioId,
      subsceneId
    });
    
  } catch (error) {
    console.error('❌ Error generating animation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get animation status
router.get('/status/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = `public/backgrounds/${filename}`;
    
    // Check if file exists
    const fs = await import('fs');
    const exists = fs.existsSync(filepath);
    
    res.json({
      success: true,
      filename,
      exists,
      path: exists ? `/backgrounds/${filename}` : null
    });
    
  } catch (error) {
    console.error('❌ Error checking animation status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router; 