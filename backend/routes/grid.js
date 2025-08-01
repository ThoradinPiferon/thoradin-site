const express = require('express');
const router = express.Router();
const sceneEngine = require('../services/sceneEngine');

/**
 * Grid action handler with modular scene engine
 * 
 * This route now uses the SceneEngine's evaluateSceneTransition to determine 
 * what happens when a tile is clicked. The engine provides a clean API wrapper
 * for scene evaluation and transition logic.
 */
router.post('/action', async (req, res) => {
  try {
    const { gridId, currentScene, currentSubscene, action } = req.body;

    console.log(`🎮 Grid action received: ${gridId} in Scene ${currentScene}.${currentSubscene}, action: ${action}`);

    // Validate required parameters
    if (!gridId || !currentScene || !currentSubscene || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: gridId, currentScene, currentSubscene, action'
      });
    }

    // Use the scene engine to evaluate the scene transition
    const transition = await sceneEngine.evaluateSceneTransition({
      currentSceneId: parseInt(currentScene),
      subsceneId: parseInt(currentSubscene),
      gridId,
      action
    });

    console.log(`✅ Scene Engine Transition Result:`, transition);

    // Return the scene engine response
    res.json({
      success: true,
      ...transition
    });

  } catch (error) {
    console.error('❌ Grid action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process grid action',
      error: error.message
    });
  }
});

/**
 * Get all available scenes (for debugging/management)
 */
router.get('/scenes', async (req, res) => {
  try {
    const scenes = await sceneEngine.getAllScenes();
    res.json({
      success: true,
      scenes,
      count: scenes.length
    });
  } catch (error) {
    console.error('Error getting scenes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scenes',
      error: error.message
    });
  }
});

/**
 * Get scene data by scene and subscene IDs
 */
router.get('/scene/:sceneId/:subsceneId', async (req, res) => {
  try {
    const { sceneId, subsceneId } = req.params;
    const sceneData = await sceneEngine.getSceneData(
      parseInt(sceneId), 
      parseInt(subsceneId)
    );

    if (!sceneData) {
      return res.status(404).json({
        success: false,
        message: `Scene ${sceneId}.${subsceneId} not found`
      });
    }

    res.json({
      success: true,
      scene: sceneData
    });
  } catch (error) {
    console.error('Error getting scene data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scene data',
      error: error.message
    });
  }
});

/**
 * Create or update a scene (admin function)
 */
router.post('/scene', async (req, res) => {
  try {
    const sceneData = req.body;
    
    // Validate required fields
    if (!sceneData.sceneId || !sceneData.subsceneId || !sceneData.title) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sceneId, subsceneId, title'
      });
    }

    const scene = await sceneEngine.upsertScene(sceneData);
    
    res.json({
      success: true,
      message: 'Scene created/updated successfully',
      scene
    });
  } catch (error) {
    console.error('Error upserting scene:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update scene',
      error: error.message
    });
  }
});

/**
 * Test scene transition evaluation (debug endpoint)
 */
router.post('/test-transition', async (req, res) => {
  try {
    const { currentSceneId, subsceneId, gridId, action } = req.body;

    if (!currentSceneId || !subsceneId || !gridId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: currentSceneId, subsceneId, gridId, action'
      });
    }

    const transition = await sceneEngine.evaluateSceneTransition({
      currentSceneId: parseInt(currentSceneId),
      subsceneId: parseInt(subsceneId),
      gridId,
      action
    });

    res.json({
      success: true,
      transition,
      testParams: { currentSceneId, subsceneId, gridId, action }
    });
  } catch (error) {
    console.error('Error testing transition:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test transition',
      error: error.message
    });
  }
});

module.exports = router; 