const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const gridController = require('../controllers/gridController');
const { generateGridResponse } = require('../config/openai');
const router = express.Router();

// Validation middleware
const validateGridInteraction = [
  body('gridRow').isInt({ min: 0, max: 100 }).withMessage('Grid row must be a valid number'),
  body('gridCol').isInt({ min: 0, max: 100 }).withMessage('Grid column must be a valid number'),
  body('interactionType').isIn(['click', 'hover', 'longPress']).withMessage('Invalid interaction type'),
  body('emotionalState').optional().isString().trim(),
  body('symbolicContext').optional().isString().trim()
];

// Handle grid interaction (requires authentication)
router.post('/interact', authenticateToken, validateGridInteraction, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  await gridController.handleGridInteraction(req, res);
});

// Get user's grid interaction history
router.get('/history', authenticateToken, async (req, res) => {
  await gridController.getGridHistory(req, res);
});

// Get grid statistics
router.get('/stats', authenticateToken, async (req, res) => {
  await gridController.getGridStats(req, res);
});

// Start a new grid session
router.post('/session/start', authenticateToken, async (req, res) => {
  await gridController.startGridSession(req, res);
});

// Test grid interaction (for development) - No database required
router.post('/test', async (req, res) => {
  try {
    const { gridRow, gridCol, interactionType, emotionalState, symbolicContext } = req.body;
    
    // Generate AI response without database
    const aiResult = await generateGridResponse({
      gridRow: gridRow || 1,
      gridCol: gridCol || 1,
      emotionalState: emotionalState || 'curious',
      symbolicContext: symbolicContext || 'testing',
      interactionType: interactionType || 'click'
    });
    
    res.json({
      success: true,
      message: 'Grid test interaction successful',
      data: {
        interaction: {
          gridRow: gridRow || 1,
          gridCol: gridCol || 1,
          interactionType: interactionType || 'click',
          emotionalState: emotionalState || 'curious',
          symbolicContext: symbolicContext || 'testing',
          timestamp: new Date().toISOString()
        },
        aiResponse: {
          response: aiResult.response,
          model: aiResult.model,
          responseTime: aiResult.responseTime
        }
      }
    });
  } catch (error) {
    console.error('Grid test error:', error);
    res.status(500).json({
      success: false,
      message: 'Test interaction failed',
      error: error.message
    });
  }
});

module.exports = router; 