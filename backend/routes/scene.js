import express from 'express';
import { prisma } from '../config/database.js';

const router = express.Router();

// GET /api/scene/:id - Get scene by grid ID (e.g., G1.1, G2.3)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate grid ID format (Gx.y where x and y are numbers)
    const gridIdPattern = /^G\d+\.\d+$/;
    if (!gridIdPattern.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid grid ID format. Expected format: Gx.y (e.g., G1.1, G2.3)'
      });
    }

    const scene = await prisma.scene.findUnique({
      where: {
        gridId: id,
        isActive: true
      },
      select: {
        id: true,
        gridId: true,
        title: true,
        description: true,
        animationUrl: true
      }
    });

    if (!scene) {
      return res.status(404).json({
        success: false,
        message: `Scene not found for grid ID: ${id}`,
        gridId: id
      });
    }

    res.json({
      success: true,
      data: scene
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
    const scenes = await prisma.scene.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        gridId: true,
        title: true,
        description: true,
        animationUrl: true
      },
      orderBy: {
        gridId: 'asc'
      }
    });

    res.json({
      success: true,
      data: scenes,
      count: scenes.length
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