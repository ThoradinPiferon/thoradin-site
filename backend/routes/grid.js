const express = require('express');
const router = express.Router();
const sceneEngine = require('../services/sceneEngine');

/**
 * Grid action handler with modular scene engine
 * 
 * This route now uses the SceneEngine to determine what happens when a tile is clicked.
 * The engine can handle complex scene transitions, effects, and logic based on:
 * - Current scene/subscene state
 * - Grid coordinates clicked
 * - Scene logic defined in database or fallback logic
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

    // Use the scene engine to determine the next scene state
    const nextScene = await sceneEngine.getNextScene({
      currentScene: parseInt(currentScene),
      currentSubscene: parseInt(currentSubscene),
      gridId,
      action
    });

    console.log(`✅ Scene Engine Response:`, nextScene);

    // Return the scene engine response
    res.json({
      success: true,
      ...nextScene
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

module.exports = router; 