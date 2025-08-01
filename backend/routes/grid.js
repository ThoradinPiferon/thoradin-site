const express = require('express');
const router = express.Router();

// Grid action handler
router.post('/action', async (req, res) => {
  try {
    const { gridId, currentScene, action } = req.body;
    
    console.log(`Grid action received: ${gridId} in Scene ${currentScene}, action: ${action}`);
    
    // Scene 1: Matrix animation running
    if (currentScene === 1) {
      // Any grid click fast-forwards Matrix animation
      return res.json({
        success: true,
        newScene: 2,
        matrixAction: 'fastForward',
        message: 'Fast-forwarding Matrix animation'
      });
    }
    
    // Scene 2: Matrix animation ended
    if (currentScene === 2) {
      // Any grid click restarts Matrix animation
      return res.json({
        success: true,
        newScene: 1,
        matrixAction: 'restart',
        message: 'Restarting Matrix animation'
      });
    }
    
    // Scene 3: Matrix animation completed
    if (currentScene === 3) {
      // Only G11.7 navigates to Vault scenario
      if (gridId === 'G11.7') {
        return res.json({
          success: true,
          navigateTo: 'vault',
          message: 'Navigating to Vault scenario'
        });
      } else {
        // Other clicks do nothing in Scene 3
        return res.json({
          success: true,
          message: 'No action for this grid in Scene 3'
        });
      }
    }
    
    // Default response
    res.json({
      success: true,
      message: 'Grid action processed'
    });
    
  } catch (error) {
    console.error('Grid action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process grid action',
      error: error.message
    });
  }
});

module.exports = router; 