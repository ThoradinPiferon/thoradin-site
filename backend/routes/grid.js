const express = require('express');
const router = express.Router();

// Grid action handler with scene/subscene system
router.post('/action', async (req, res) => {
  try {
    const { gridId, currentScene, currentSubscene, action } = req.body;
    
    console.log(`Grid action received: ${gridId} in Scene ${currentScene}.${currentSubscene}, action: ${action}`);
    
    // Scene 1.1: Matrix spiral running
    if (currentScene === 1 && currentSubscene === 1) {
      // Any grid click fast-forwards Matrix animation and transitions to Scene 1.2
      return res.json({
        success: true,
        newScene: 1,
        newSubscene: 2,
        matrixAction: 'fastForward',
        message: 'Fast-forwarding Matrix animation to Scene 1.2'
      });
    }
    
    // Scene 1.2: Matrix spiral static
    if (currentScene === 1 && currentSubscene === 2) {
      // G11.7 navigates to Vault (Scene 2.1)
      if (gridId === 'G11.7') {
        return res.json({
          success: true,
          newScene: 2,
          newSubscene: 1,
          navigateTo: 'vault',
          message: 'Navigating to Vault scenario (Scene 2.1)'
        });
      } else {
        // Any other grid click restarts Matrix animation (back to Scene 1.1)
        return res.json({
          success: true,
          newScene: 1,
          newSubscene: 1,
          matrixAction: 'restart',
          message: 'Restarting Matrix animation (Scene 1.1)'
        });
      }
    }
    
    // Scene 2.1: Vault interface
    if (currentScene === 2 && currentSubscene === 1) {
      // In Vault, grid clicks can trigger different actions
      if (gridId === 'G11.7') {
        // Return to homepage (Scene 1.1)
        return res.json({
          success: true,
          newScene: 1,
          newSubscene: 1,
          matrixAction: 'restart',
          message: 'Returning to homepage (Scene 1.1)'
        });
      } else {
        // Other grid clicks in Vault can have specific actions
        return res.json({
          success: true,
          message: 'Vault grid interaction processed'
        });
      }
    }
    
    // Default response for unknown scenes
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