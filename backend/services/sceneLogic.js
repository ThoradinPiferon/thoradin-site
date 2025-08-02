/**
 * Scene Logic Module - Custom behaviors for specific scenes
 * 
 * This module defines custom logic for scenes that need special handling
 * beyond the default background type logic.
 */

const sceneLogicMap = {
  // Scene 1.1 - Matrix Spiral Running
  '1.1': {
    processAction: (gridId, action, sceneData) => {
      // Any click fast-forwards Matrix and transitions to Scene 1.2
      return {
        sceneId: 1,
        subsceneId: 2,
        matrixAction: 'fastForward',
        message: 'Fast-forwarding Matrix animation to Scene 1.2',
        effects: {
          animationTrigger: 'matrix_fast_forward',
          transitionType: 'smooth',
          echo: 'matrix_acceleration'
        }
      };
    }
  },

  // Scene 1.2 - Matrix Spiral Static
  '1.2': {
    processAction: (gridId, action, sceneData) => {
      // First trigger zoom, then determine next action
      const zoomAction = {
        zoomTo: gridId,
        message: `Zooming to ${gridId} before transition`,
        effects: {
          animationTrigger: 'grid_zoom',
          transitionType: 'zoom_then_transition',
          echo: 'grid_focus'
        }
      };

      // After zoom completes, determine the next scene
      if (gridId === 'K7') {
        // K7 (bottom-right corner) navigates to Vault (Scene 2.1) after zoom
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
      } else if (gridId === 'F6') {
        // F6 shows a special message (for testing)
        zoomAction.nextAction = {
          sceneId: 1,
          subsceneId: 2,
          message: 'F6 clicked - special test tile!',
          effects: {
            animationTrigger: 'test_interaction',
            transitionType: 'none',
            echo: 'test_echo'
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
            transitionType: 'spiral_reset',
            echo: 'matrix_rebirth'
          }
        };
      }

      return zoomAction;
    }
  },

  // Scene 2.1 - Vault Interface
  '2.1': {
    processAction: (gridId, action, sceneData) => {
      if (gridId === 'K7') {
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
              transitionType: 'return_to_matrix',
              echo: 'home_return'
            }
          },
          message: `Zooming to ${gridId} before returning to homepage`,
          effects: {
            animationTrigger: 'grid_zoom',
            transitionType: 'zoom_then_transition',
            echo: 'exit_preparation'
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
            transitionType: 'none',
            echo: 'vault_exploration'
          }
        };
      }
    }
  }
};

/**
 * Get scene logic for a specific scene/subscene combination
 * @param {number} sceneId - Scene ID
 * @param {number} subsceneId - Subscene ID
 * @returns {Object|null} Scene logic object or null if not found
 */
function getSceneLogic(sceneId, subsceneId) {
  const key = `${sceneId}.${subsceneId}`;
  return sceneLogicMap[key] || null;
}

/**
 * Register custom scene logic
 * @param {string} sceneKey - Scene key (e.g., "1.1", "2.1")
 * @param {Object} logic - Scene logic object
 */
function registerSceneLogic(sceneKey, logic) {
  sceneLogicMap[sceneKey] = logic;
  console.log(`🎭 Registered custom logic for Scene ${sceneKey}`);
}

/**
 * Get all registered scene logic keys
 * @returns {Array} Array of scene keys
 */
function getRegisteredSceneKeys() {
  return Object.keys(sceneLogicMap);
}

/**
 * Validate scene logic structure
 * @param {Object} logic - Scene logic object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateSceneLogic(logic) {
  if (!logic || typeof logic !== 'object') {
    return false;
  }

  if (logic.processAction && typeof logic.processAction !== 'function') {
    return false;
  }

  return true;
}

export {
  getSceneLogic,
  registerSceneLogic,
  getRegisteredSceneKeys,
  validateSceneLogic,
  sceneLogicMap
}; 