import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import configService from '../services/configService.js';
import { prisma } from '../config/database.js';
import languageService from '../services/languageService.js';

const router = express.Router();

// Validation middleware
const validateConfig = [
  body('key').isString().trim().notEmpty().withMessage('Key is required'),
  body('value').notEmpty().withMessage('Value is required'),
  body('type').isIn(['STRING', 'JSON', 'NUMBER', 'BOOLEAN', 'ARRAY']).withMessage('Invalid type'),
  body('category').optional().isString().trim()
];

const validateContent = [
  body('key').isString().trim().notEmpty().withMessage('Key is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('type').isIn(['ANIMATION_TEXT', 'UI_TEXT', 'STORY_CONTENT', 'AI_PROMPT', 'MOCK_RESPONSE', 'METADATA']).withMessage('Invalid type'),
  body('language').optional().isString().trim(),
  body('isProtected').optional().isBoolean()
];

// Get all configurations
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (category) {
      const configs = await configService.getConfigsByCategory(category);
      res.json({ success: true, data: configs });
    } else {
      // Get all active configurations
      const configs = await prisma.configuration.findMany({
        where: { isActive: true },
        orderBy: [{ category: 'asc' }, { key: 'asc' }]
      });
      
      res.json({ success: true, data: configs });
    }
  } catch (error) {
    console.error('Error getting configurations:', error);
    res.status(500).json({ success: false, error: 'Failed to get configurations' });
  }
});

// Get configuration by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await configService.getConfig(key);
    
    if (value === null) {
      return res.status(404).json({ success: false, error: 'Configuration not found' });
    }
    
    res.json({ success: true, data: { key, value } });
  } catch (error) {
    console.error('Error getting configuration:', error);
    res.status(500).json({ success: false, error: 'Failed to get configuration' });
  }
});

// Set configuration (requires authentication)
router.post('/', authenticateToken, validateConfig, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { key, value, type, category } = req.body;
    const userId = req.user.id;
    
    const config = await configService.setConfig(key, value, type, category, userId);
    
    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Error setting configuration:', error);
    res.status(500).json({ success: false, error: 'Failed to set configuration' });
  }
});

// Get all content
router.get('/content/all', async (req, res) => {
  try {
    const { type } = req.query;
    
    if (type) {
      const content = await configService.getContentByType(type);
      res.json({ success: true, data: content });
    } else {
      // Get all active content
      const content = await prisma.content.findMany({
        where: { isActive: true },
        orderBy: [{ type: 'asc' }, { key: 'asc' }]
      });
      
      res.json({ success: true, data: content });
    }
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ success: false, error: 'Failed to get content' });
  }
});

// Get content by type
router.get('/content/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const content = await configService.getContentByType(type);
    
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ success: false, error: 'Failed to get content' });
  }
});

// Set content (requires authentication)
router.post('/content', authenticateToken, validateContent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { key, content, type, language, isProtected } = req.body;
    const userId = req.user.id;
    
    const contentRecord = await configService.setContent(key, content, type, language, isProtected, userId);
    
    res.json({ success: true, data: contentRecord });
  } catch (error) {
    console.error('Error setting content:', error);
    res.status(500).json({ success: false, error: 'Failed to set content' });
  }
});

// Get theme
router.get('/theme/:name?', async (req, res) => {
  try {
    const { name } = req.params;
    const theme = await configService.getTheme(name);
    
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    
    res.json({ success: true, data: theme });
  } catch (error) {
    console.error('Error getting theme:', error);
    res.status(500).json({ success: false, error: 'Failed to get theme' });
  }
});

// Initialize defaults (admin only)
router.post('/init', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    await configService.initializeDefaults();
    
    res.json({ success: true, message: 'Default configurations initialized' });
  } catch (error) {
    console.error('Error initializing defaults:', error);
    res.status(500).json({ success: false, error: 'Failed to initialize defaults' });
  }
});

// Language statistics
router.get('/language/stats', async (req, res) => {
  try {
    const stats = await languageService.getLanguageStats();
    const supportedLanguages = languageService.getSupportedLanguages();
    
    res.json({ 
      success: true, 
      data: {
        stats,
        supportedLanguages,
        totalContentItems: Object.values(stats).reduce((sum, count) => sum + count, 0)
      }
    });
  } catch (error) {
    console.error('Error getting language stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get language stats' });
  }
});

// Cache management
router.get('/cache/stats', authenticateToken, async (req, res) => {
  try {
    const stats = configService.getCacheStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get cache stats' });
  }
});

router.delete('/cache', authenticateToken, async (req, res) => {
  try {
    configService.clearCache();
    res.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cache' });
  }
});

export default router; 