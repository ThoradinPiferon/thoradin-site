import { prisma } from '../config/database.js';
import { validateSceneData, logValidationErrors } from '../utils/sceneValidator.js';
import { 
  getSceneData, 
  hasAutoAdvance, 
  getAutoAdvanceConfig,
  getSceneConfig 
} from './sceneSeed.js';
import { getSceneLogic } from './sceneLogic.js';

class SceneEngine {
  constructor() {
    this.sceneCache = new Map();
  }

  /**
   * Get scene data from database or fallback to seed data
   */
  async getSceneData(sceneId, subsceneId) {
    try {
      const scene = await prisma.sceneSubscene.findUnique({
        where: {
          sceneId_subsceneId: {
            sceneId: sceneId,
            subsceneId: subsceneId
          }
        }
      });
      
      if (scene) {
        const sceneData = {
          ...scene,
          gridConfig: JSON.parse(scene.gridConfig || '{}'),
          effects: JSON.parse(scene.effects || '{}'),
          choices: JSON.parse(scene.choices || '[]'),
          nextScenes: scene.nextScenes ? JSON.parse(scene.nextScenes) : null
        };
        
        // Validate scene data before returning
        const validation = validateSceneData(sceneData);
        logValidationErrors(validation, `${sceneId}.${subsceneId}`);
        
        return sceneData;
      }
    } catch (error) {
      console.error('Database error getting scene data:', error);
    }
    
    // Fallback to seed data
    return getSceneData(sceneId, subsceneId);
  }

  /**
   * Evaluate scene transition based on current scene and user action
   */
  async evaluateSceneTransition({ currentSceneId, subsceneId, gridId, action }) {
    console.log(`🎭 Scene Engine: Evaluating transition for Scene ${currentSceneId}.${subsceneId} on ${gridId}`);
    
    try {
      const sceneData = await this.getSceneData(currentSceneId, subsceneId);
      
      if (!sceneData) {
        console.log(`⚠️ Scene ${currentSceneId}.${subsceneId} not found in database, using fallback logic`);
        return this.getFallbackLogic(currentSceneId, subsceneId, gridId, action);
      }
      
      console.log(`🎭 Processing logic for Scene ${currentSceneId}.${subsceneId} (${sceneData.title})`);
      
      // Check for auto-advance functionality
      if (hasAutoAdvance(currentSceneId, subsceneId)) {
        const autoAdvanceConfig = getAutoAdvanceConfig(currentSceneId, subsceneId);
        console.log(`⏰ Auto-advance detected: ${autoAdvanceConfig.delay}ms to Scene ${autoAdvanceConfig.nextScene.sceneId}.${autoAdvanceConfig.nextScene.subsceneId}`);
        
        return {
          sceneId: autoAdvanceConfig.nextScene.sceneId,
          subsceneId: autoAdvanceConfig.nextScene.subsceneId,
          message: `Auto-advancing to Scene ${autoAdvanceConfig.nextScene.sceneId}.${autoAdvanceConfig.nextScene.subsceneId}`,
          effects: {
            animationTrigger: 'auto_advance',
            transitionType: 'smooth',
            delay: autoAdvanceConfig.delay
          },
          echo: 'auto_advance_triggered'
        };
      }
      
      // Check for custom scene logic first
      const sceneLogic = getSceneLogic(currentSceneId, subsceneId);
      if (sceneLogic && sceneLogic.processAction) {
        console.log(`🎭 Using custom scene logic for Scene ${currentSceneId}.${subsceneId}`);
        return sceneLogic.processAction(gridId, action, sceneData);
      }
      
      // Check for choices-based logic
      if (sceneData.choices && sceneData.choices.length > 0) {
        console.log(`🎭 Evaluating choices for Scene ${currentSceneId}.${subsceneId}`);
        return this.evaluateChoices(sceneData, gridId, action);
      }
      
      // Fallback to background type logic
      console.log(`🎭 Using background type fallback logic`);
      return this.getBackgroundTypeLogic(sceneData, gridId, action);
      
    } catch (error) {
      console.error('❌ Error in scene transition evaluation:', error);
      return this.getFallbackLogic(currentSceneId, subsceneId, gridId, action);
    }
  }

  /**
   * Evaluate choices for a scene
   */
  evaluateChoices(sceneData, gridId, action) {
    for (const choice of sceneData.choices) {
      if (this.evaluateCondition(choice.condition, gridId)) {
        console.log(`✅ Scene Engine: Choice "${choice.label}" selected`);
        return {
          sceneId: choice.next[0],
          subsceneId: choice.next[1],
          message: choice.label,
          effects: choice.effects || {},
          echo: choice.echo || 'grid_click'
        };
      }
    }
    
    // No choice matched, use default next scene
    if (sceneData.nextScene) {
      return {
        sceneId: sceneData.nextScene.sceneId,
        subsceneId: sceneData.nextScene.subsceneId,
        message: 'Default transition',
        effects: {},
        echo: 'default_transition'
      };
    }
    
    // No transition defined
    return {
      sceneId: sceneData.sceneId,
      subsceneId: sceneData.subsceneId,
      message: 'No transition defined',
      effects: {},
      echo: 'no_transition'
    };
  }

  /**
   * Evaluate condition string
   */
  evaluateCondition(condition, gridId) {
    if (!condition) return true;
    
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
   * Get background type logic
   */
  getBackgroundTypeLogic(sceneData, gridId, action) {
    const backgroundType = sceneData.backgroundType;
    
    switch (backgroundType) {
      case 'matrix_spiral':
        return this.getMatrixSpiralLogic(sceneData, gridId, action);
      case 'matrix_spiral_static':
        return this.getStaticSpiralLogic(sceneData, gridId, action);
      case 'vault_background':
        return this.getVaultLogic(sceneData, gridId, action);
      default:
        return this.getFallbackLogic(sceneData.sceneId, sceneData.subsceneId, gridId, action);
    }
  }

  /**
   * Matrix spiral running logic
   */
  getMatrixSpiralLogic(sceneData, gridId, action) {
    console.log(`🎭 Using background type logic: matrix_spiral`);
    
    // Use DB-driven scene evaluation instead of hardcoded logic
    return this.evaluateChoices(sceneData, gridId, action);
  }

  /**
   * Static spiral logic
   */
  getStaticSpiralLogic(sceneData, gridId, action) {
    console.log(`🎭 Using background type logic: matrix_spiral_static`);
    
    // Use DB-driven scene evaluation instead of hardcoded logic
    return this.evaluateChoices(sceneData, gridId, action);
  }

  /**
   * Vault logic
   */
  getVaultLogic(sceneData, gridId, action) {
    console.log(`🎭 Using background type logic: vault_background`);
    
    // Use DB-driven scene evaluation instead of hardcoded logic
    return this.evaluateChoices(sceneData, gridId, action);
  }

  /**
   * Get static spiral transition with zoom
   */
  getStaticSpiralTransition(sceneId, subsceneId, gridId, action) {
    const zoomAction = {
      zoomTo: gridId,
      message: 'Zooming to grid before transition',
      effects: {
        animationTrigger: 'grid_zoom',
        transitionType: 'zoom_then_transition',
        echo: 'grid_focus'
      }
    };
    
    if (gridId === 'K7') {
      zoomAction.nextAction = {
        sceneId: 2,
        subsceneId: 1,
        navigateTo: 'vault',
        message: 'Navigating to Vault scenario (Scene 2.1)',
        effects: {
          animationTrigger: 'scene_transition',
          transitionType: 'vault_entrance',
          echo: 'vault_destination'
        }
      };
    } else {
      zoomAction.nextAction = {
        sceneId: 1,
        subsceneId: 1,
        matrixAction: 'restart',
        message: 'Restarting Matrix animation (Scene 1.1)',
        effects: {
          animationTrigger: 'matrix_restart',
          transitionType: 'spiral_reset',
          echo: 'matrix_rebirth'
        }
      };
    }
    
    return zoomAction;
  }

  /**
   * Get vault transition with zoom
   */
  getVaultTransition(sceneId, subsceneId, gridId, action) {
    const zoomAction = {
      zoomTo: gridId,
      message: 'Zooming to grid before transition',
      effects: {
        animationTrigger: 'grid_zoom',
        transitionType: 'zoom_then_transition',
        echo: 'grid_focus'
      }
    };
    
    if (gridId === 'K7') {
      zoomAction.nextAction = {
        sceneId: 1,
        subsceneId: 1,
        matrixAction: 'restart',
        message: 'Returning to homepage (Scene 1.1)',
        effects: {
          animationTrigger: 'vault_exit',
          transitionType: 'return_to_matrix',
          echo: 'home_return'
        }
      };
    } else {
      zoomAction.nextAction = {
        sceneId: 2,
        subsceneId: 1,
        message: 'Vault interaction',
        effects: {
          animationTrigger: 'vault_interaction',
          transitionType: 'none',
          echo: 'vault_exploration'
        }
      };
    }
    
    return zoomAction;
  }

  /**
   * Get fallback logic when scene data is not available
   */
  getFallbackLogic(sceneId, subsceneId, gridId, action) {
    console.log(`🔄 Using fallback logic for Scene ${sceneId}.${subsceneId}`);
    
    if (sceneId === 1 && subsceneId === 1) {
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
    
    if (sceneId === 1 && subsceneId === 2) {
      return this.getStaticSpiralTransition(sceneId, subsceneId, gridId, action);
    }
    
    if (sceneId === 2 && subsceneId === 1) {
      return this.getVaultTransition(sceneId, subsceneId, gridId, action);
    }
    
    return {
      sceneId: sceneId,
      subsceneId: subsceneId,
      message: 'No transition defined',
      effects: {},
      echo: 'no_transition'
    };
  }

  /**
   * Get all scenes from database
   */
  async getAllScenes() {
    try {
      return await prisma.sceneSubscene.findMany({
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
   * Check if scene has auto-advance functionality
   */
  async hasAutoAdvance(sceneId, subsceneId) {
    const sceneData = await this.getSceneData(sceneId, subsceneId);
    return hasAutoAdvance(sceneId, subsceneId) || (sceneData?.effects?.autoAdvanceAfter ? true : false);
  }

  /**
   * Get auto-advance configuration
   */
  async getAutoAdvanceConfig(sceneId, subsceneId) {
    const sceneData = await this.getSceneData(sceneId, subsceneId);
    const config = getAutoAdvanceConfig(sceneId, subsceneId);
    
    if (config) return config;
    
    if (sceneData?.effects?.autoAdvanceAfter) {
      return {
        delay: sceneData.effects.autoAdvanceAfter,
        nextScene: sceneData.effects.nextScene
      };
    }
    
    return null;
  }
}

export default SceneEngine; 