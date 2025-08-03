import express from 'express';
import { prisma } from '../config/database.js';

const router = express.Router();

// GET /api/scene/:sceneId/:subsceneId - Get scene by scene and subscene ID
router.get('/:sceneId/:subsceneId', async (req, res) => {
  try {
    const { sceneId, subsceneId } = req.params;
    
    // Validate scene and subscene IDs are numbers
    const sceneIdNum = parseInt(sceneId);
    const subsceneIdNum = parseInt(subsceneId);
    
    if (isNaN(sceneIdNum) || isNaN(subsceneIdNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scene or subscene ID. Expected numbers.'
      });
    }

    const scene = await prisma.sceneSubscene.findUnique({
      where: {
        sceneId_subsceneId: {
          sceneId: sceneIdNum,
          subsceneId: subsceneIdNum
        },
        isActive: true
      }
    });

    if (!scene) {
      return res.status(404).json({
        success: false,
        message: `Scene not found for Scene ${sceneId}.${subsceneId}`,
        sceneId: sceneIdNum,
        subsceneId: subsceneIdNum
      });
    }

    // Parse JSON fields
    const parsedScene = {
      ...scene,
      gridConfig: scene.gridConfig ? JSON.parse(scene.gridConfig) : {},
      effects: scene.effects ? JSON.parse(scene.effects) : {},
      choices: scene.choices ? JSON.parse(scene.choices) : [],
      nextScene: scene.nextScene ? JSON.parse(scene.nextScene) : null
    };

    res.json({
      success: true,
      data: parsedScene
    });

  } catch (error) {
    console.error('Scene fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching scene',
      error: error.message
    });
  }
});

// GET /api/scene - Get all active scenes
router.get('/', async (req, res) => {
  try {
    const scenes = await prisma.sceneSubscene.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { sceneId: 'asc' },
        { subsceneId: 'asc' }
      ]
    });

    // Parse JSON fields for each scene
    const parsedScenes = scenes.map(scene => ({
      ...scene,
      gridConfig: scene.gridConfig ? JSON.parse(scene.gridConfig) : {},
      effects: scene.effects ? JSON.parse(scene.effects) : {},
      choices: scene.choices ? JSON.parse(scene.choices) : [],
      nextScene: scene.nextScene ? JSON.parse(scene.nextScene) : null
    }));

    res.json({
      success: true,
      data: parsedScenes,
      count: parsedScenes.length
    });

  } catch (error) {
    console.error('Scenes fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching scenes',
      error: error.message
    });
  }
});

export default router; 