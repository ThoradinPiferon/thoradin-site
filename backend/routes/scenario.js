import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 🎭 SCENARIO API ENDPOINTS
 * 
 * GET /api/scenario?sceneId=1&subsceneId=1
 * Returns complete scenario data including grid config, tiles, and metadata
 */

// Get scenario data by scene and subscene
router.get('/', async (req, res) => {
  try {
    const { sceneId, subsceneId } = req.query;
    
    console.log(`🎭 Fetching scenario: ${sceneId}.${subsceneId}`);
    
    if (!sceneId || !subsceneId) {
      return res.status(400).json({
        success: false,
        message: 'sceneId and subsceneId are required'
      });
    }
    
    // Find scenario in database
    const scenario = await prisma.scenario.findUnique({
      where: {
        sceneId_subsceneId: {
          sceneId: parseInt(sceneId),
          subsceneId: parseInt(subsceneId)
        }
      }
    });
    
    if (!scenario) {
      console.log(`⚠️ Scenario ${sceneId}.${subsceneId} not found, using fallback`);
      
      // Return fallback scenario for Scene 1.1
      return res.json({
        success: true,
        sceneId: parseInt(sceneId),
        subsceneId: parseInt(subsceneId),
        title: 'Matrix Awakening',
        description: 'The spiral begins to spin...',
        gridConfig: {
          rows: 1,
          cols: 1,
          gap: '2px',
          padding: '20px',
          debug: false,
          invisibleMode: false,
          matrixAnimationMode: true,
          triggerTile: 'A1',
          excelRange: 'A1:A1' // Excel-style range notation
        },
        animationConfig: {
          type: 'matrix_spiral',
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
            spiral: true
          },
          interactiveParams: {
            zoomSpeed: 1.2,
            cursorSensitivity: 0.8,
            animationPause: false
          }
        },
        backgroundPath: null, // Optional static file path
        tiles: [
          {
            id: 'A1',
            handler: 'frontend',
            actions: {
              frontend: ['cursor_zoom', 'matrix_trigger'],
              backend: null
            },
            effects: {
              animationSpeed: 'fast'
            }
          }
        ],
        nextScenes: [
          {
            sceneId: 1,
            subsceneId: 2,
            triggerTile: 'A1',
            label: 'Fast-forward Matrix Animation'
          }
        ]
      });
    }
    
    // Return database scenario
    const response = {
      success: true,
      sceneId: scenario.sceneId,
      subsceneId: scenario.subsceneId,
      title: scenario.title,
      description: scenario.description,
      gridConfig: scenario.gridConfig,
      animationConfig: scenario.animationConfig, // Include animation configuration
      backgroundPath: scenario.backgroundPath, // Include optional background path
      tiles: scenario.tiles,
      nextScenes: scenario.nextScenes
    };
    
    console.log(`✅ Scenario ${sceneId}.${subsceneId} loaded successfully`);
    res.json(response);
    
  } catch (error) {
    console.error('❌ Error fetching scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create or update scenario
router.post('/', async (req, res) => {
  try {
    const { sceneId, subsceneId, title, description, gridConfig, animationConfig, backgroundPath, tiles, nextScenes } = req.body;
    
    console.log(`🎭 Creating/updating scenario: ${sceneId}.${subsceneId}`);
    
    const scenario = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: parseInt(sceneId),
          subsceneId: parseInt(subsceneId)
        }
      },
      update: {
        title,
        description,
        gridConfig,
        animationConfig,
        backgroundPath,
        tiles,
        nextScenes
      },
      create: {
        sceneId: parseInt(sceneId),
        subsceneId: parseInt(subsceneId),
        title,
        description,
        gridConfig,
        animationConfig,
        backgroundPath,
        tiles,
        nextScenes
      }
    });
    
    console.log(`✅ Scenario ${sceneId}.${subsceneId} saved successfully`);
    res.json({
      success: true,
      scenario
    });
    
  } catch (error) {
    console.error('❌ Error saving scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Log interaction
router.post('/interaction', async (req, res) => {
  try {
    const { sessionId, sceneId, subsceneId, tileId, action, data } = req.body;
    
    console.log(`📝 Logging interaction: ${action} on ${tileId} in ${sceneId}.${subsceneId}`);
    
    const interaction = await prisma.interaction.create({
      data: {
        sessionId,
        sceneId: parseInt(sceneId),
        subsceneId: parseInt(subsceneId),
        tileId,
        action,
        data
      }
    });
    
    res.json({
      success: true,
      interaction
    });
    
  } catch (error) {
    console.error('❌ Error logging interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router; 