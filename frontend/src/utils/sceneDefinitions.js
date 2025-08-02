/**
 * Scene Definitions - Central mapping of scenes to their background types and zoom handlers
 * 
 * This system provides a clean abstraction where scenes define their own visual characteristics,
 * allowing the zoom system to work automatically without manual background type specification.
 */

// Scene-to-background mapping
const sceneToBackgroundMap = {
  // Scene 1.1: Matrix Spiral Running
  '1.1': {
    id: '1.1',
    name: 'Matrix Awakening',
    backgroundType: 'matrix',
    description: 'Animated Matrix spiral with character reveal',
    zoomHandler: null, // Will be set dynamically when MatrixSpiralCanvas registers
  },
  
  // Scene 1.2: Matrix Spiral Static
  '1.2': {
    id: '1.2',
    name: 'Matrix Grid',
    backgroundType: 'matrix',
    description: 'Static Matrix background with interactive grid',
    zoomHandler: null, // Will be set dynamically when MatrixSpiralCanvas registers
  },
  
  // Scene 2.1: Vault Interface
  '2.1': {
    id: '2.1',
    name: 'Vault Entrance',
    backgroundType: 'vault',
    description: 'Vault-style interface with AI interaction',
    zoomHandler: null, // Will be set when VaultCanvas registers
  },
  
  // Future scenes can be added here
  '2.2': {
    id: '2.2',
    name: 'Vault Chamber',
    backgroundType: 'vault',
    description: 'Inner vault chamber with advanced interactions',
    zoomHandler: null,
  },
  
  '3.1': {
    id: '3.1',
    name: 'Sketch World',
    backgroundType: 'handDrawn',
    description: 'Hand-drawn sketch-style interface',
    zoomHandler: null,
  },
  
  '3.2': {
    id: '3.2',
    name: 'Static Grid',
    backgroundType: 'staticGrid',
    description: 'Simple static grid interface',
    zoomHandler: null,
  }
};

// Default fallback scene definition
const defaultSceneDefinition = {
  id: 'unknown',
  name: 'Unknown Scene',
  backgroundType: 'matrix', // Fallback to matrix
  description: 'Unknown scene - using default background',
  zoomHandler: null,
};

/**
 * Get scene definition by scene ID
 * @param {string} sceneId - Scene ID (e.g., '1.1', '2.1')
 * @returns {Object} Scene definition object
 */
export const getSceneDefinition = (sceneId) => {
  const sceneDef = sceneToBackgroundMap[sceneId];
  if (!sceneDef) {
    console.warn(`⚠️ Unknown scene ID: ${sceneId}, using default`);
    return { ...defaultSceneDefinition, id: sceneId };
  }
  return sceneDef;
};

/**
 * Get scene definition by scene and subscene
 * @param {number} scene - Scene number
 * @param {number} subscene - Subscene number
 * @returns {Object} Scene definition object
 */
export const getSceneDefinitionByNumbers = (scene, subscene) => {
  const sceneId = `${scene}.${subscene}`;
  return getSceneDefinition(sceneId);
};

/**
 * Register a zoom handler for a specific scene
 * @param {string} sceneId - Scene ID
 * @param {Function} zoomHandler - Zoom handler function
 */
export const registerSceneZoomHandler = (sceneId, zoomHandler) => {
  const sceneDef = getSceneDefinition(sceneId);
  sceneDef.zoomHandler = zoomHandler;
  console.log(`🎬 Registered zoom handler for scene ${sceneId} (${sceneDef.name})`);
};

/**
 * Register a zoom handler for a background type (affects all scenes using that background)
 * @param {string} backgroundType - Background type
 * @param {Function} zoomHandler - Zoom handler function
 */
export const registerBackgroundTypeZoomHandler = (backgroundType, zoomHandler) => {
  // Update all scenes that use this background type
  Object.values(sceneToBackgroundMap).forEach(sceneDef => {
    if (sceneDef.backgroundType === backgroundType) {
      sceneDef.zoomHandler = zoomHandler;
      console.log(`🎬 Registered zoom handler for scene ${sceneDef.id} (${sceneDef.name}) via background type ${backgroundType}`);
    }
  });
};

/**
 * Get all scene definitions
 * @returns {Object} All scene definitions
 */
export const getAllSceneDefinitions = () => {
  return { ...sceneToBackgroundMap };
};

/**
 * Get scenes by background type
 * @param {string} backgroundType - Background type to filter by
 * @returns {Array} Array of scene definitions
 */
export const getScenesByBackgroundType = (backgroundType) => {
  return Object.values(sceneToBackgroundMap).filter(sceneDef => 
    sceneDef.backgroundType === backgroundType
  );
};

/**
 * Check if a scene exists
 * @param {string} sceneId - Scene ID to check
 * @returns {boolean} True if scene exists
 */
export const sceneExists = (sceneId) => {
  return sceneToBackgroundMap.hasOwnProperty(sceneId);
};

/**
 * Get background type for a scene
 * @param {string} sceneId - Scene ID
 * @returns {string} Background type
 */
export const getSceneBackgroundType = (sceneId) => {
  const sceneDef = getSceneDefinition(sceneId);
  return sceneDef.backgroundType;
};

/**
 * Get zoom handler for a scene
 * @param {string} sceneId - Scene ID
 * @returns {Function|null} Zoom handler function or null
 */
export const getSceneZoomHandler = (sceneId) => {
  const sceneDef = getSceneDefinition(sceneId);
  return sceneDef.zoomHandler;
}; 