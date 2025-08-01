const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Scene Engine - Modular system for managing scene transitions and logic
 * 
 * This engine determines what happens when a tile is clicked based on:
 * - Current scene/subscene state
 * - Grid coordinates clicked
 * - Scene logic defined in database or fallback logic
 */

class SceneEngine {
  constructor() {
    this.sceneLogic = require('./sceneLogic');
  }

  /**
   * Get the next scene state based on current scene and user input
   * @param {Object} params - Scene transition parameters
   * @param {number} params.currentScene - Current scene ID
   * @param {number} params.currentSubscene - Current subscene ID
   * @param {string} params.gridId - Grid coordinate clicked (e.g., "G11.7")
   * @param {string} params.action - Action type (e.g., "grid_click")
   * @returns {Object} Next scene state with effects
   */
  async getNextScene({ currentScene, currentSubscene, gridId, action }) {
    console.log(`🎭 Scene Engine: Processing ${action} on ${gridId} in Scene ${currentScene}.${currentSubscene}`);

    try {
      // Get current scene data from database
      const currentSceneData = await this.getSceneData(currentScene, currentSubscene);
      
      if (!currentSceneData) {
        console.log(`⚠️ Scene ${currentScene}.${currentSubscene} not found in database, using fallback logic`);
        return this.getFallbackSceneLogic(currentScene, currentSubscene, gridId);
      }

      // Process scene logic
      const nextScene = await this.processSceneLogic(currentSceneData, gridId, action);
      
      console.log(`✅ Scene Engine: Transitioning to Scene ${nextScene.sceneId}.${nextScene.subsceneId}`);
      return nextScene;

    } catch (error) {
      console.error('❌ Scene Engine Error:', error);
      return this.getFallbackSceneLogic(currentScene, currentSubscene, gridId);
    }
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
   * Process scene logic based on scene data and user input
   * @param {Object} sceneData - Scene data from database
   * @param {string} gridId - Grid coordinate clicked
   * @param {string} action - Action type
   * @returns {Object} Next scene state
   */
  async processSceneLogic(sceneData, gridId, action) {
    const { sceneId, subsceneId, backgroundType, title } = sceneData;
    
    console.log(`🎭 Processing logic for Scene ${sceneId}.${subsceneId} (${title})`);

    // Get scene-specific logic from sceneLogic module
    const sceneLogic = this.sceneLogic.getSceneLogic(sceneId, subsceneId);
    
    if (sceneLogic && sceneLogic.processAction) {
      // Use custom scene logic if available
      return sceneLogic.processAction(gridId, action, sceneData);
    }

    // Use default scene logic based on background type
    return this.getDefaultSceneLogic(sceneId, subsceneId, gridId, backgroundType);
  }

  /**
   * Get default scene logic based on background type
   * @param {number} sceneId - Current scene ID
   * @param {number} subsceneId - Current subscene ID
   * @param {string} gridId - Grid coordinate clicked
   * @param {string} backgroundType - Background type
   * @returns {Object} Next scene state
   */
  getDefaultSceneLogic(sceneId, subsceneId, gridId, backgroundType) {
    console.log(`🎭 Using default logic for background type: ${backgroundType}`);

    switch (backgroundType) {
      case 'matrix_spiral':
        return this.getMatrixSpiralLogic(sceneId, subsceneId, gridId);
      
      case 'static_spiral':
        return this.getStaticSpiralLogic(sceneId, subsceneId, gridId);
      
      case 'vault':
        return this.getVaultLogic(sceneId, subsceneId, gridId);
      
      default:
        return this.getFallbackSceneLogic(sceneId, subsceneId, gridId);
    }
  }

  /**
   * Matrix spiral running logic (Scene 1.1)
   */
  getMatrixSpiralLogic(sceneId, subsceneId, gridId) {
    // Any click fast-forwards Matrix and transitions to Scene 1.2
    return {
      sceneId: 1,
      subsceneId: 2,
      matrixAction: 'fastForward',
      message: 'Fast-forwarding Matrix animation to Scene 1.2',
      effects: {
        animationTrigger: 'matrix_fast_forward',
        transitionType: 'smooth'
      }
    };
  }

  /**
   * Static spiral logic (Scene 1.2)
   */
  getStaticSpiralLogic(sceneId, subsceneId, gridId) {
    // First trigger zoom, then determine next action
    const zoomAction = {
      zoomTo: gridId,
      message: `Zooming to ${gridId} before transition`,
      effects: {
        animationTrigger: 'grid_zoom',
        transitionType: 'zoom_then_transition'
      }
    };

    // After zoom completes, determine the next scene
    if (gridId === 'G11.7') {
      // G11.7 navigates to Vault (Scene 2.1) after zoom
      zoomAction.nextAction = {
        sceneId: 2,
        subsceneId: 1,
        navigateTo: 'vault',
        message: 'Navigating to Vault scenario (Scene 2.1)',
        effects: {
          animationTrigger: 'scene_transition',
          transitionType: 'vault_entrance'
        }
      };
    } else {
      // Any other grid click restarts Matrix animation (back to Scene 1.1) after zoom
      zoomAction.nextAction = {
        sceneId: 1,
        subsceneId: 1,
        matrixAction: 'restart',
        message: 'Restarting Matrix animation (Scene 1.1)',
        effects: {
          animationTrigger: 'matrix_restart',
          transitionType: 'spiral_reset'
        }
      };
    }

    return zoomAction;
  }

  /**
   * Vault logic (Scene 2.1)
   */
  getVaultLogic(sceneId, subsceneId, gridId) {
    if (gridId === 'G11.7') {
      // Return to homepage (Scene 1.1) with zoom
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
          }
        },
        message: `Zooming to ${gridId} before returning to homepage`,
        effects: {
          animationTrigger: 'grid_zoom',
          transitionType: 'zoom_then_transition'
        }
      };
    } else {
      // Other grid clicks in Vault can have specific actions
      return {
        sceneId: 2,
        subsceneId: 1,
        message: 'Vault grid interaction processed',
        effects: {
          animationTrigger: 'vault_interaction',
          transitionType: 'none'
        }
      };
    }
  }

  /**
   * Fallback scene logic when database scene not found
   */
  getFallbackSceneLogic(sceneId, subsceneId, gridId) {
    console.log(`🔄 Using fallback logic for Scene ${sceneId}.${subsceneId}`);
    
    // Basic fallback logic
    if (sceneId === 1 && subsceneId === 1) {
      return this.getMatrixSpiralLogic(sceneId, subsceneId, gridId);
    } else if (sceneId === 1 && subsceneId === 2) {
      return this.getStaticSpiralLogic(sceneId, subsceneId, gridId);
    } else if (sceneId === 2 && subsceneId === 1) {
      return this.getVaultLogic(sceneId, subsceneId, gridId);
    }

    // Default response for unknown scenes
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
}

module.exports = new SceneEngine(); 