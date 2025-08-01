const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Scene Engine - Modular system for managing scene transitions and logic
 * 
 * This engine provides a generic interface for scene evaluation and transition
 * based on database-driven scene definitions and fallback logic.
 */

class SceneEngine {
  constructor() {
    this.sceneSeed = require('./sceneSeed');
  }

  /**
   * Generic scene transition evaluator
   * @param {Object} params - Scene transition parameters
   * @param {number} params.currentSceneId - Current scene ID
   * @param {number} params.subsceneId - Current subscene ID
   * @param {string} params.gridId - Grid coordinate clicked (e.g., "G11.7")
   * @param {string} params.action - Action type (e.g., "grid_click")
   * @returns {Object} Scene transition result
   */
  async evaluateSceneTransition({ currentSceneId, subsceneId, gridId, action }) {
    console.log(`🎭 Scene Engine: Evaluating transition for Scene ${currentSceneId}.${subsceneId} on ${gridId}`);

    try {
      // Get current scene data from database
      const currentSceneData = await this.getSceneData(currentSceneId, subsceneId);
      
      if (!currentSceneData) {
        console.log(`⚠️ Scene ${currentSceneId}.${subsceneId} not found in database, using fallback logic`);
        return this.evaluateFallbackTransition(currentSceneId, subsceneId, gridId, action);
      }

      // Evaluate scene using database-driven logic
      const transition = await this.evaluateSceneLogic(currentSceneData, gridId, action);
      
      console.log(`✅ Scene Engine: Transition result:`, transition);
      return transition;

    } catch (error) {
      console.error('❌ Scene Engine Error:', error);
      return this.evaluateFallbackTransition(currentSceneId, subsceneId, gridId, action);
    }
  }

  /**
   * Evaluate scene logic based on scene data and user input
   * @param {Object} sceneData - Scene data from database
   * @param {string} gridId - Grid coordinate clicked
   * @param {string} action - Action type
   * @returns {Object} Scene transition result
   */
  async evaluateSceneLogic(sceneData, gridId, action) {
    const { sceneId, subsceneId, backgroundType, title } = sceneData;
    
    console.log(`🎭 Evaluating logic for Scene ${sceneId}.${subsceneId} (${title})`);

    // Get scene seed definition
    const sceneSeed = this.sceneSeed.findSceneSeed(sceneId, subsceneId);
    
    if (sceneSeed && sceneSeed.choices) {
      // Use scene seed choices for evaluation
      return this.evaluateSceneChoices(sceneSeed, gridId, action);
    }

    // Use background type-based fallback logic
    return this.evaluateBackgroundTypeLogic(backgroundType, sceneId, subsceneId, gridId, action);
  }

  /**
   * Evaluate scene choices from scene seed
   * @param {Object} sceneSeed - Scene seed definition
   * @param {string} gridId - Grid coordinate clicked
   * @param {string} action - Action type
   * @returns {Object} Scene transition result
   */
  evaluateSceneChoices(sceneSeed, gridId, action) {
    console.log(`🎭 Evaluating choices for Scene ${sceneSeed.sceneId}.${sceneSeed.subsceneId}`);

    // Find matching choice based on gridId and conditions
    const matchingChoice = sceneSeed.choices.find(choice => {
      if (choice.condition) {
        // Evaluate condition (simple string matching for now)
        return this.evaluateCondition(choice.condition, gridId);
      }
      return true; // Default choice
    });

    if (matchingChoice) {
      const [nextSceneId, nextSubsceneId] = matchingChoice.next;
      
      return {
        sceneId: nextSceneId,
        subsceneId: nextSubsceneId,
        message: matchingChoice.label,
        effects: matchingChoice.effects || {},
        echo: sceneSeed.logic?.echoTriggers?.includes(action) ? action : null
      };
    }

    // No matching choice, use default logic
    return this.evaluateBackgroundTypeLogic(
      sceneSeed.backgroundType, 
      sceneSeed.sceneId, 
      sceneSeed.subsceneId, 
      gridId, 
      action
    );
  }

  /**
   * Evaluate condition string (simple implementation)
   * @param {string} condition - Condition string (e.g., "gridId === 'G11.7'")
   * @param {string} gridId - Grid coordinate
   * @returns {boolean} Condition result
   */
  evaluateCondition(condition, gridId) {
    // Simple condition evaluation - can be expanded
    if (condition.includes('gridId ===')) {
      const expectedGridId = condition.match(/'([^']+)'/)?.[1];
      return gridId === expectedGridId;
    }
    if (condition.includes('gridId !==')) {
      const expectedGridId = condition.match(/'([^']+)'/)?.[1];
      return gridId !== expectedGridId;
    }
    return false;
  }

  /**
   * Evaluate scene logic based on background type
   * @param {string} backgroundType - Background type
   * @param {number} sceneId - Current scene ID
   * @param {number} subsceneId - Current subscene ID
   * @param {string} gridId - Grid coordinate clicked
   * @param {string} action - Action type
   * @returns {Object} Scene transition result
   */
  evaluateBackgroundTypeLogic(backgroundType, sceneId, subsceneId, gridId, action) {
    console.log(`🎭 Using background type logic: ${backgroundType}`);

    switch (backgroundType) {
      case 'matrix_spiral':
        return this.getMatrixSpiralTransition(sceneId, subsceneId, gridId, action);
      
      case 'static_spiral':
        return this.getStaticSpiralTransition(sceneId, subsceneId, gridId, action);
      
      case 'vault':
        return this.getVaultTransition(sceneId, subsceneId, gridId, action);
      
      default:
        return this.getDefaultTransition(sceneId, subsceneId, gridId, action);
    }
  }

  /**
   * Matrix spiral running transition logic
   */
  getMatrixSpiralTransition(sceneId, subsceneId, gridId, action) {
    return {
      sceneId: 1,
      subsceneId: 2,
      matrixAction: 'fastForward',
      message: 'Fast-forwarding Matrix animation to Scene 1.2',
      effects: {
        animationTrigger: 'matrix_fast_forward',
        transitionType: 'smooth'
      },
      echo: 'matrix_acceleration'
    };
  }

  /**
   * Static spiral transition logic
   */
  getStaticSpiralTransition(sceneId, subsceneId, gridId, action) {
    const zoomAction = {
      zoomTo: gridId,
      message: `Zooming to ${gridId} before transition`,
      effects: {
        animationTrigger: 'grid_zoom',
        transitionType: 'zoom_then_transition'
      },
      echo: 'grid_focus'
    };

    if (gridId === 'G11.7') {
      zoomAction.nextAction = {
        sceneId: 2,
        subsceneId: 1,
        navigateTo: 'vault',
        message: 'Navigating to Vault scenario (Scene 2.1)',
        effects: {
          animationTrigger: 'scene_transition',
          transitionType: 'vault_entrance'
        },
        echo: 'vault_destination'
      };
    } else {
      zoomAction.nextAction = {
        sceneId: 1,
        subsceneId: 1,
        matrixAction: 'restart',
        message: 'Restarting Matrix animation (Scene 1.1)',
        effects: {
          animationTrigger: 'matrix_restart',
          transitionType: 'spiral_reset'
        },
        echo: 'matrix_rebirth'
      };
    }

    return zoomAction;
  }

  /**
   * Vault transition logic
   */
  getVaultTransition(sceneId, subsceneId, gridId, action) {
    if (gridId === 'G11.7') {
      return {
        zoomTo: gridId,
        nextAction: {
          sceneId: 1,
          subsceneId: 1,
          matrixAction: 'restart',
          message: 'Returning to homepage (Scene 1.1)',
          effects: {
            animationTrigger: 'vault_exit',
            transitionType: 'return_to_matrix'
          },
          echo: 'home_return'
        },
        message: `Zooming to ${gridId} before returning to homepage`,
        effects: {
          animationTrigger: 'grid_zoom',
          transitionType: 'zoom_then_transition'
        },
        echo: 'exit_preparation'
      };
    } else {
      return {
        sceneId: 2,
        subsceneId: 1,
        message: 'Vault grid interaction processed',
        effects: {
          animationTrigger: 'vault_interaction',
          transitionType: 'none'
        },
        echo: 'vault_exploration'
      };
    }
  }

  /**
   * Default transition logic
   */
  getDefaultTransition(sceneId, subsceneId, gridId, action) {
    return {
      sceneId: sceneId,
      subsceneId: subsceneId,
      message: 'Scene action processed',
      effects: {
        animationTrigger: 'default',
        transitionType: 'none'
      }
    };
  }

  /**
   * Fallback transition evaluation when database scene not found
   */
  evaluateFallbackTransition(sceneId, subsceneId, gridId, action) {
    console.log(`🔄 Using fallback logic for Scene ${sceneId}.${subsceneId}`);
    
    // Basic fallback logic based on scene coordinates
    if (sceneId === 1 && subsceneId === 1) {
      return this.getMatrixSpiralTransition(sceneId, subsceneId, gridId, action);
    } else if (sceneId === 1 && subsceneId === 2) {
      return this.getStaticSpiralTransition(sceneId, subsceneId, gridId, action);
    } else if (sceneId === 2 && subsceneId === 1) {
      return this.getVaultTransition(sceneId, subsceneId, gridId, action);
    }

    return this.getDefaultTransition(sceneId, subsceneId, gridId, action);
  }

  /**
   * Get scene data from database
   * @param {number} sceneId - Scene ID
   * @param {number} subsceneId - Subscene ID
   * @returns {Object|null} Scene data or null if not found
   */
  async getSceneData(sceneId, subsceneId) {
    try {
      const sceneData = await prisma.sceneSubscene.findUnique({
        where: {
          sceneId_subsceneId: {
            sceneId: sceneId,
            subsceneId: subsceneId
          }
        }
      });

      return sceneData;
    } catch (error) {
      console.error('Database error getting scene data:', error);
      return null;
    }
  }

  /**
   * Get all available scenes for debugging/management
   */
  async getAllScenes() {
    try {
      return await prisma.sceneSubscene.findMany({
        where: { isActive: true },
        orderBy: [
          { sceneId: 'asc' },
          { subsceneId: 'asc' }
        ]
      });
    } catch (error) {
      console.error('Error getting all scenes:', error);
      return [];
    }
  }

  /**
   * Create or update a scene
   */
  async upsertScene(sceneData) {
    try {
      return await prisma.sceneSubscene.upsert({
        where: {
          sceneId_subsceneId: {
            sceneId: sceneData.sceneId,
            subsceneId: sceneData.subsceneId
          }
        },
        update: sceneData,
        create: sceneData
      });
    } catch (error) {
      console.error('Error upserting scene:', error);
      throw error;
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  async getNextScene(params) {
    return this.evaluateSceneTransition(params);
  }
}

module.exports = new SceneEngine(); 