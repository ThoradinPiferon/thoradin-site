/**
 * Scene Seed Structure - Enhanced JSON schema for scene definitions
 * 
 * This module defines the structure for scene seeds that can be used to
 * easily manage scene design outside the database.
 */

/**
 * Scene Seed Schema
 * @typedef {Object} SceneSeed
 * @property {number} sceneId - Main scene identifier
 * @property {number} subsceneId - Subscene within main scene
 * @property {string} title - Scene title
 * @property {string} description - Scene description
 * @property {string} backgroundType - Background type (matrix_spiral, static_spiral, vault, etc.)
 * @property {string|null} animationUrl - Optional animation URL
 * @property {Array<Choice>} [choices] - Optional choices array
 * @property {Object} [logic] - Optional logic flags and triggers
 * @property {Array<Effect>} [effects] - Optional effects array
 * @property {Object} [nextScene] - Default next scene if no choices match
 * @property {Array<string>} [echoTriggers] - Actions that trigger echo effects
 */

/**
 * Choice Schema
 * @typedef {Object} Choice
 * @property {string} label - Choice label
 * @property {Array<number>} next - [sceneId, subsceneId] for next scene
 * @property {string} [condition] - Optional condition for choice availability
 * @property {Object} [effects] - Optional effects when choice is selected
 * @property {string} [echo] - Optional echo effect for this choice
 */

/**
 * Effect Schema
 * @typedef {Object} Effect
 * @property {string} type - Effect type (animation, sound, visual, etc.)
 * @property {string} trigger - When effect triggers
 * @property {Object} data - Effect-specific data
 */

/**
 * Logic Flags Schema
 * @typedef {Object} LogicFlags
 * @property {boolean} [requiresEcho] - Whether scene requires echo effect
 * @property {Array<string>} [locks] - Array of locked features
 * @property {Array<string>} [echoTriggers] - Array of echo trigger conditions
 * @property {boolean} [requiresZoom] - Whether scene requires zoom animation
 * @property {boolean} [requiresTransition] - Whether scene requires transition effect
 * @property {boolean} [requiresUnlock] - Whether scene requires unlock condition
 */

// Enhanced scene seeds for the current system
const defaultSceneSeeds = [
  {
    sceneId: 1,
    subsceneId: 1,
    title: "Matrix Spiral Running",
    description: "The Matrix spiral animation is actively running, creating the initial immersive experience. Any grid click will fast-forward to the end.",
    backgroundType: "matrix_spiral",
    animationUrl: null,
    logic: {
      requiresEcho: true,
      echoTriggers: ["grid_click"],
      requiresTransition: true
    },
    effects: [
      {
        type: "animation",
        trigger: "grid_click",
        data: {
          action: "fastForward",
          targetScene: [1, 2]
        }
      }
    ],
    nextScene: [1, 2],
    echoTriggers: ["grid_click"]
  },
  {
    sceneId: 1,
    subsceneId: 2,
    title: "Matrix Spiral Static",
    description: "The Matrix spiral has completed its animation and is now in a static state. Grid buttons are visible and G11.7 leads to Vault.",
    backgroundType: "static_spiral",
    animationUrl: null,
    logic: {
      requiresZoom: true,
      requiresTransition: true,
      echoTriggers: ["grid_click", "zoom_complete"]
    },
    choices: [
      {
        label: "Navigate to Vault",
        next: [2, 1],
        condition: "gridId === 'G11.7'",
        effects: {
          animationTrigger: "scene_transition",
          transitionType: "vault_entrance"
        },
        echo: "vault_destination"
      },
      {
        label: "Restart Matrix",
        next: [1, 1],
        condition: "gridId !== 'G11.7'",
        effects: {
          animationTrigger: "matrix_restart",
          transitionType: "spiral_reset"
        },
        echo: "matrix_rebirth"
      }
    ],
    effects: [
      {
        type: "animation",
        trigger: "grid_click",
        data: {
          action: "zoom",
          targetGrid: "clicked"
        }
      }
    ],
    nextScene: [1, 1],
    echoTriggers: ["grid_click", "zoom_complete"]
  },
  {
    sceneId: 2,
    subsceneId: 1,
    title: "Vault Interface",
    description: "The mystical Vault interface with AI chat capabilities and Dune aesthetic.",
    backgroundType: "vault",
    animationUrl: null,
    logic: {
      requiresZoom: true,
      requiresTransition: true,
      echoTriggers: ["grid_click", "vault_interaction"]
    },
    choices: [
      {
        label: "Return to Homepage",
        next: [1, 1],
        condition: "gridId === 'G11.7'",
        effects: {
          animationTrigger: "vault_exit",
          transitionType: "return_to_matrix"
        },
        echo: "home_return"
      },
      {
        label: "Vault Interaction",
        next: [2, 1],
        condition: "gridId !== 'G11.7'",
        effects: {
          animationTrigger: "vault_interaction",
          transitionType: "none"
        },
        echo: "vault_exploration"
      }
    ],
    effects: [
      {
        type: "animation",
        trigger: "grid_click",
        data: {
          action: "vault_interaction",
          targetGrid: "clicked"
        }
      }
    ],
    nextScene: [2, 1],
    echoTriggers: ["grid_click", "vault_interaction"]
  }
];

/**
 * Validate a scene seed against the schema
 * @param {SceneSeed} seed - Scene seed to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateSceneSeed(seed) {
  const errors = [];
  
  // Required fields
  if (!seed.sceneId || typeof seed.sceneId !== 'number') {
    errors.push('sceneId is required and must be a number');
  }
  
  if (!seed.subsceneId || typeof seed.subsceneId !== 'number') {
    errors.push('subsceneId is required and must be a number');
  }
  
  if (!seed.title || typeof seed.title !== 'string') {
    errors.push('title is required and must be a string');
  }
  
  if (!seed.description || typeof seed.description !== 'string') {
    errors.push('description is required and must be a string');
  }
  
  if (!seed.backgroundType || typeof seed.backgroundType !== 'string') {
    errors.push('backgroundType is required and must be a string');
  }
  
  // Validate choices if present
  if (seed.choices && Array.isArray(seed.choices)) {
    seed.choices.forEach((choice, index) => {
      if (!choice.label || typeof choice.label !== 'string') {
        errors.push(`choice ${index}: label is required and must be a string`);
      }
      
      if (!choice.next || !Array.isArray(choice.next) || choice.next.length !== 2) {
        errors.push(`choice ${index}: next must be an array with [sceneId, subsceneId]`);
      }
    });
  }
  
  // Validate logic if present
  if (seed.logic && typeof seed.logic === 'object') {
    if (seed.logic.requiresEcho !== undefined && typeof seed.logic.requiresEcho !== 'boolean') {
      errors.push('logic.requiresEcho must be a boolean');
    }
    
    if (seed.logic.locks && !Array.isArray(seed.logic.locks)) {
      errors.push('logic.locks must be an array');
    }
    
    if (seed.logic.echoTriggers && !Array.isArray(seed.logic.echoTriggers)) {
      errors.push('logic.echoTriggers must be an array');
    }
  }
  
  // Validate effects if present
  if (seed.effects && Array.isArray(seed.effects)) {
    seed.effects.forEach((effect, index) => {
      if (!effect.type || typeof effect.type !== 'string') {
        errors.push(`effect ${index}: type is required and must be a string`);
      }
      
      if (!effect.trigger || typeof effect.trigger !== 'string') {
        errors.push(`effect ${index}: trigger is required and must be a string`);
      }
    });
  }
  
  // Validate nextScene if present
  if (seed.nextScene && (!Array.isArray(seed.nextScene) || seed.nextScene.length !== 2)) {
    errors.push('nextScene must be an array with [sceneId, subsceneId]');
  }
  
  // Validate echoTriggers if present
  if (seed.echoTriggers && !Array.isArray(seed.echoTriggers)) {
    errors.push('echoTriggers must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Convert scene seed to database format
 * @param {SceneSeed} seed - Scene seed to convert
 * @returns {Object} Database-ready scene object
 */
function seedToDatabase(seed) {
  return {
    sceneId: seed.sceneId,
    subsceneId: seed.subsceneId,
    title: seed.title,
    description: seed.description,
    backgroundType: seed.backgroundType,
    animationUrl: seed.animationUrl,
    isActive: true
  };
}

/**
 * Convert database scene to seed format
 * @param {Object} dbScene - Database scene object
 * @returns {SceneSeed} Scene seed object
 */
function databaseToSeed(dbScene) {
  return {
    sceneId: dbScene.sceneId,
    subsceneId: dbScene.subsceneId,
    title: dbScene.title,
    description: dbScene.description,
    backgroundType: dbScene.backgroundType,
    animationUrl: dbScene.animationUrl,
    // Note: choices, logic, effects, nextScene, and echoTriggers would need to be stored separately
    // or in a JSON field in the database
  };
}

/**
 * Get default scene seeds
 * @returns {Array<SceneSeed>} Array of default scene seeds
 */
function getDefaultSceneSeeds() {
  return defaultSceneSeeds;
}

/**
 * Find scene seed by scene and subscene IDs
 * @param {number} sceneId - Scene ID
 * @param {number} subsceneId - Subscene ID
 * @returns {SceneSeed|null} Scene seed or null if not found
 */
function findSceneSeed(sceneId, subsceneId) {
  return defaultSceneSeeds.find(
    seed => seed.sceneId === sceneId && seed.subsceneId === subsceneId
  ) || null;
}

/**
 * Get all scene seeds for a specific scene
 * @param {number} sceneId - Scene ID
 * @returns {Array<SceneSeed>} Array of scene seeds for the scene
 */
function getSceneSeeds(sceneId) {
  return defaultSceneSeeds.filter(seed => seed.sceneId === sceneId);
}

/**
 * Get all available background types
 * @returns {Array<string>} Array of background types
 */
function getBackgroundTypes() {
  const types = new Set();
  defaultSceneSeeds.forEach(seed => types.add(seed.backgroundType));
  return Array.from(types);
}

/**
 * Get scene seeds by background type
 * @param {string} backgroundType - Background type
 * @returns {Array<SceneSeed>} Array of scene seeds with the background type
 */
function getSceneSeedsByBackgroundType(backgroundType) {
  return defaultSceneSeeds.filter(seed => seed.backgroundType === backgroundType);
}

module.exports = {
  validateSceneSeed,
  seedToDatabase,
  databaseToSeed,
  getDefaultSceneSeeds,
  findSceneSeed,
  getSceneSeeds,
  getBackgroundTypes,
  getSceneSeedsByBackgroundType,
  defaultSceneSeeds
}; 