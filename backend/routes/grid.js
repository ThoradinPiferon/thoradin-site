import express from 'express';
import SceneEngine from '../services/sceneEngine.js';
import { logTileInteraction } from '../services/soulKeyService.js';

const router = express.Router();
const sceneEngine = new SceneEngine();

/**
 * Grid action handler with modular scene engine
 * 
 * This route now uses the SceneEngine's evaluateSceneTransition to determine 
 * what happens when a tile is clicked. The engine provides a clean API wrapper
 * for scene evaluation and transition logic.
 */
router.post('/action', async (req, res) => {
  try {
    const { gridId, currentScene, currentSubscene, action, sessionId } = req.body;

    console.log(`🎮 Grid action received: ${gridId} in Scene ${currentScene}.${currentSubscene}, action: ${action}`);
    console.log(`🔍 Backend received: currentScene=${currentScene}, currentSubscene=${currentSubscene}`);

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

    // Log to SoulKey system if sessionId provided
    if (sessionId) {
      try {
        await logTileInteraction(sessionId, {
          scene: parseInt(currentScene),
          subscene: parseInt(currentSubscene),
          gridTile: gridId,
          zoomTarget: transition.zoomTo || null,
          nextScene: transition.sceneId && transition.subsceneId ? {
            sceneId: transition.sceneId,
            subsceneId: transition.subsceneId,
            message: transition.message
          } : null
        });
      } catch (soulKeyError) {
        console.warn('⚠️ SoulKey logging failed:', soulKeyError.message);
        // Don't fail the main request if SoulKey logging fails
      }
    }

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
 * Get scenario data by scene and subscene IDs (query parameters)
 * Returns complete scenario information including grid config, next scenes, and metadata
 */
router.get('/scenario', async (req, res) => {
  try {
    const { sceneId, subsceneId } = req.query;
    
    if (!sceneId || !subsceneId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: sceneId, subsceneId'
      });
    }

    console.log(`🎭 Scenario request: Scene ${sceneId}.${subsceneId}`);

    // Get scene data from scene engine
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

    // Use nextScenes as-is (already parsed by SceneEngine)
    const nextScenes = sceneData.nextScenes || [];
    
    // Handle effects and choices - they might already be parsed by SceneEngine
    const effects = typeof sceneData.effects === 'string' ? JSON.parse(sceneData.effects) : (sceneData.effects || {});
    const choices = typeof sceneData.choices === 'string' ? JSON.parse(sceneData.choices) : (sceneData.choices || []);

    // Build scenario response
    const scenario = {
      sceneId: parseInt(sceneId),
      subsceneId: parseInt(subsceneId),
      gridConfig: {
        rows: sceneData.gridConfig?.rows || 7,
        cols: sceneData.gridConfig?.cols || 11,
        gap: sceneData.gridConfig?.gap || '2px',
        padding: sceneData.gridConfig?.padding || '20px',
        debug: sceneData.gridConfig?.debug || false,
        invisibleMode: sceneData.gridConfig?.invisibleMode || false,
        matrixAnimationMode: sceneData.gridConfig?.matrixAnimationMode || false,
        triggerTile: sceneData.gridConfig?.triggerTile || null
      },
      nextScenes: nextScenes.map(nextScene => ({
        sceneId: nextScene.sceneId,
        subsceneId: nextScene.subsceneId,
        triggerTile: nextScene.triggerTile,
        label: nextScene.label
      })),
      tiles: sceneData.tiles || [],
      metadata: {
        title: sceneData.title,
        description: sceneData.description,
        backgroundType: sceneData.backgroundType,
        backgroundImage: sceneData.animationUrl || null,
        effects: effects,
        choices: choices,
        echoTriggers: sceneData.echoTriggers || []
      }
    };

    console.log(`✅ Scenario for Scene ${sceneId}.${subsceneId}:`, {
      gridConfig: scenario.gridConfig,
      nextScenesCount: scenario.nextScenes.length,
      backgroundType: scenario.metadata.backgroundType
    });

    res.json({
      success: true,
      ...scenario
    });
  } catch (error) {
    console.error('❌ Scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scenario data',
      error: error.message
    });
  }
});

/**
 * Get grid configuration by scene and subscene IDs (query parameters)
 */
router.get('/', async (req, res) => {
  try {
    const { sceneId, subsceneId } = req.query;
    
    if (!sceneId || !subsceneId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: sceneId, subsceneId'
      });
    }

    console.log(`🔄 Grid config request: Scene ${sceneId}.${subsceneId}`);

    // Get scene data from scene engine
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

    // Return grid configuration based on scene data
    const gridConfig = {
      rows: sceneData.gridConfig?.rows || 7,
      cols: sceneData.gridConfig?.cols || 11,
      gap: sceneData.gridConfig?.gap || '2px',
      padding: sceneData.gridConfig?.padding || '20px',
      debug: sceneData.gridConfig?.debug || false,
      invisibleMode: sceneData.gridConfig?.invisibleMode || false,
      matrixAnimationMode: sceneData.gridConfig?.matrixAnimationMode || false,
      triggerTile: sceneData.gridConfig?.triggerTile || null
    };

    console.log(`✅ Grid config for Scene ${sceneId}.${subsceneId}:`, gridConfig);

    res.json({
      success: true,
      sceneId: parseInt(sceneId),
      subsceneId: parseInt(subsceneId),
      gridConfig
    });
  } catch (error) {
    console.error('❌ Grid config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get grid configuration',
      error: error.message
    });
  }
});

/**
 * Get scene data by scene and subscene IDs (path parameters)
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

/**
 * Debug endpoint to test SceneEngine functionality
 */
router.get('/debug', async (req, res) => {
  try {
    console.log('🔍 Debug: SceneEngine object:', typeof sceneEngine);
    console.log('🔍 Debug: SceneEngine methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sceneEngine)));
    console.log('🔍 Debug: evaluateSceneTransition exists:', typeof sceneEngine.evaluateSceneTransition);
    
    res.json({
      success: true,
      debug: {
        sceneEngineType: typeof sceneEngine,
        hasEvaluateSceneTransition: typeof sceneEngine.evaluateSceneTransition === 'function',
        methods: Object.getOwnPropertyNames(Object.getPrototypeOf(sceneEngine))
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: error.message
    });
  }
});

/**
 * Get SoulKey insights for a session
 */
router.get('/soulkey/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log(`🎭 SoulKey: Requesting insights for session ${sessionId}`);
    
    const { getSessionInsights } = await import('../services/soulKeyService.js');
    
    const insights = await getSessionInsights(sessionId);
    
    console.log(`✅ SoulKey: Insights generated for session ${sessionId}`);
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('❌ Error getting SoulKey insights:', error);
    
    // Return a more graceful error response
    res.status(404).json({
      success: false,
      message: 'Session not found or SoulKey service unavailable',
      error: error.message,
      sessionId: req.params.sessionId
    });
  }
});

/**
 * Get all active SoulKey sessions
 */
router.get('/soulkey/sessions/active', async (req, res) => {
  try {
    const { getActiveSessions } = await import('../services/soulKeyService.js');
    
    const activeSessions = getActiveSessions();
    
    res.json({
      success: true,
      activeSessions,
      count: activeSessions.length
    });
  } catch (error) {
    console.error('Error getting active sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active sessions',
      error: error.message
    });
  }
});

export default router; 