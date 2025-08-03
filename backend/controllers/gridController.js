const prisma = require('../config/database');
const { generateGridResponse } = require('../config/openai');
const { v4: uuidv4 } = require('uuid');

// Handle grid interaction and generate AI response
const handleGridInteraction = async (req, res) => {
  try {
    const { gridRow, gridCol, interactionType, emotionalState, symbolicContext } = req.body;
    const userId = req.user.id;

    // Validate input
    if (gridRow === undefined || gridCol === undefined || !interactionType) {
      return res.status(400).json({
        success: false,
        message: 'Grid position and interaction type are required'
      });
    }

    // Create grid interaction
    const interaction = await prisma.gridInteraction.create({
      data: {
        userId,
        gridRow: parseInt(gridRow),
        gridCol: parseInt(gridCol),
        interactionType,
        emotionalState: emotionalState || null,
        symbolicContext: symbolicContext || null
      }
    });

    // Generate AI response
    const aiResult = await generateGridResponse({
      gridRow: interaction.gridRow,
      gridCol: interaction.gridCol,
      emotionalState: interaction.emotionalState,
      symbolicContext: interaction.symbolicContext,
      interactionType: interaction.interactionType
    });

    // Save AI response
    const aiResponse = await prisma.aIResponse.create({
      data: {
        gridInteractionId: interaction.id,
        userId,
        prompt: aiResult.prompt,
        response: aiResult.response,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        responseTime: aiResult.responseTime
      }
    });

    // Update interaction with AI response
    await prisma.gridInteraction.update({
      where: { id: interaction.id },
      data: { aiResponse: { connect: { id: aiResponse.id } } }
    });

    res.json({
      success: true,
      message: 'Grid interaction processed successfully',
      data: {
        interaction: {
          id: interaction.id,
          gridRow: interaction.gridRow,
          gridCol: interaction.gridCol,
          interactionType: interaction.interactionType,
          emotionalState: interaction.emotionalState,
          symbolicContext: interaction.symbolicContext,
          timestamp: interaction.timestamp
        },
        aiResponse: {
          response: aiResponse.response,
          model: aiResponse.model,
          responseTime: aiResponse.responseTime
        }
      }
    });

  } catch (error) {
    console.error('Grid interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process grid interaction'
    });
  }
};

// Get user's grid interaction history
const getGridHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const interactions = await prisma.gridInteraction.findMany({
      where: { userId },
      include: {
        aiResponse: {
          select: {
            response: true,
            model: true,
            responseTime: true,
            createdAt: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        interactions,
        total: interactions.length
      }
    });

  } catch (error) {
    console.error('Get grid history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grid history'
    });
  }
};

// Get grid statistics
const getGridStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await prisma.gridInteraction.groupBy({
      by: ['gridRow', 'gridCol'],
      where: { userId },
      _count: {
        id: true
      }
    });

    const totalInteractions = await prisma.gridInteraction.count({
      where: { userId }
    });

    const emotionalStates = await prisma.gridInteraction.groupBy({
      by: ['emotionalState'],
      where: { 
        userId,
        emotionalState: { not: null }
      },
      _count: {
        id: true
      }
    });

    res.json({
      success: true,
      data: {
        totalInteractions,
        gridStats: stats,
        emotionalStates
      }
    });

  } catch (error) {
    console.error('Get grid stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grid statistics'
    });
  }
};

// Start a new grid session
const startGridSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionName } = req.body;

    const session = await prisma.gridSession.create({
      data: {
        userId,
        sessionName: sessionName || `Session ${new Date().toLocaleString()}`
      }
    });

    res.json({
      success: true,
      message: 'Grid session started',
      data: { session }
    });

  } catch (error) {
    console.error('Start grid session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start grid session'
    });
  }
};

module.exports = {
  handleGridInteraction,
  getGridHistory,
  getGridStats,
  startGridSession
}; 