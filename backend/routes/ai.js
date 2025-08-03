import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { generateGridResponse, generateChatResponse } from '../config/openai.js';
import languageService from '../services/languageService.js';
const router = express.Router();

// Validation middleware
const validateAIPrompt = [
  body('prompt').isString().trim().isLength({ min: 1, max: 1000 }).withMessage('Prompt must be between 1 and 1000 characters'),
  body('context').optional().isString().trim(),
  body('model').optional().isIn(['gpt-4', 'gpt-3.5-turbo']).withMessage('Invalid model specified')
];

// Generate AI response for custom prompt
router.post('/generate', authenticateToken, validateAIPrompt, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { prompt, context, model = 'gpt-4' } = req.body;

    const aiResult = await generateGridResponse({
      gridRow: 0, // Placeholder for custom prompts
      gridCol: 0,
      emotionalState: context || 'contemplative',
      symbolicContext: prompt,
      interactionType: 'custom'
    });

    res.json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        prompt,
        response: aiResult.response,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        responseTime: aiResult.responseTime
      }
    });

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response'
    });
  }
});

// Test AI connection
router.get('/test', async (req, res) => {
  try {
    const language = languageService.detectLanguage(req);
    const testPrompt = "Test the AI connection with a brief response.";
    
    const aiResult = await generateGridResponse({
      gridRow: 1,
      gridCol: 1,
      emotionalState: 'curious',
      symbolicContext: testPrompt,
      interactionType: 'test'
    }, language);

    res.json({
      success: true,
      message: 'AI connection successful',
      data: {
        response: aiResult.response,
        model: aiResult.model,
        responseTime: aiResult.responseTime,
        language: language
      }
    });

  } catch (error) {
    console.error('AI test error:', error);
    res.status(500).json({
      success: false,
      message: 'AI connection failed',
      error: error.message
    });
  }
});

// Chat endpoint for AI interaction
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a non-empty string'
      });
    }

    const aiResult = await generateChatResponse(message, language);

    res.json({
      success: true,
      message: 'AI response generated successfully',
      response: aiResult.response,
      model: aiResult.model,
      responseTime: aiResult.responseTime,
      language: language
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response',
      error: error.message
    });
  }
});

// Get AI models info
router.get('/models', async (req, res) => {
  res.json({
    success: true,
    data: {
      availableModels: [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: 'Most capable model for complex tasks',
          maxTokens: 8192
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and efficient for most tasks',
          maxTokens: 4096
        }
      ]
    }
  });
});

export default router; 