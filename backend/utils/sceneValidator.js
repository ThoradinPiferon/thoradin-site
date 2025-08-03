/**
 * Scene Data Validator
 * Validates scene data structure to prevent silent frontend breaks
 */

// JSON Schema for scene data validation
export const sceneDataSchema = {
  type: 'object',
  required: ['sceneId', 'subsceneId', 'gridConfig', 'tiles', 'nextScenes', 'metadata'],
  properties: {
    sceneId: { type: 'number', minimum: 1 },
    subsceneId: { type: 'number', minimum: 1 },
    gridConfig: {
      type: 'object',
      required: ['rows', 'cols'],
      properties: {
        rows: { type: 'number', minimum: 1, maximum: 100 },
        cols: { type: 'number', minimum: 1, maximum: 100 },
        gap: { type: 'string' },
        padding: { type: 'string' },
        debug: { type: 'boolean' },
        invisibleMode: { type: 'boolean' },
        matrixAnimationMode: { type: 'boolean' },
        triggerTile: { type: 'string' }
      }
    },
    tiles: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'handler'],
        properties: {
          id: { type: 'string', pattern: '^[A-Z][0-9]+$' },
          handler: { 
            type: 'string', 
            enum: ['frontend', 'backend', 'both', 'none'] 
          },
          actions: {
            type: 'object',
            properties: {
              frontend: { 
                type: 'array', 
                items: { 
                  type: 'string',
                  enum: ['cursor_zoom', 'background_communication', 'matrix_animation_trigger']
                }
              },
              backend: { 
                type: 'array', 
                items: { type: 'string' }
              },
              effects: { type: 'object' }
            }
          }
        }
      }
    },
    nextScenes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['sceneId', 'subsceneId', 'triggerTile'],
        properties: {
          sceneId: { type: 'number', minimum: 1 },
          subsceneId: { type: 'number', minimum: 1 },
          triggerTile: { type: 'string', pattern: '^[A-Z][0-9]+$' },
          label: { type: 'string' }
        }
      }
    },
    metadata: {
      type: 'object',
      required: ['title', 'backgroundType'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        backgroundType: { 
          type: 'string',
          enum: ['matrix_spiral', 'matrix_spiral_static', 'vault_background', 'hand_drawn', 'static_grid']
        },
        backgroundImage: { type: 'string' },
        effects: { type: 'object' },
        choices: { type: 'array' },
        echoTriggers: { type: 'array' }
      }
    }
  }
};

/**
 * Validate scene data against schema
 * @param {Object} sceneData - Scene data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateSceneData(sceneData) {
  const errors = [];
  
  try {
    // Basic structure validation
    if (!sceneData || typeof sceneData !== 'object') {
      errors.push('Scene data must be an object');
      return { isValid: false, errors };
    }
    
    // Required fields validation
    const requiredFields = ['sceneId', 'subsceneId', 'gridConfig', 'tiles', 'nextScenes', 'metadata'];
    for (const field of requiredFields) {
      if (!(field in sceneData)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Grid config validation
    if (sceneData.gridConfig) {
      const { rows, cols } = sceneData.gridConfig;
      if (typeof rows !== 'number' || rows < 1 || rows > 100) {
        errors.push('Grid rows must be a number between 1 and 100');
      }
      if (typeof cols !== 'number' || cols < 1 || cols > 100) {
        errors.push('Grid cols must be a number between 1 and 100');
      }
    }
    
    // Tiles validation
    if (Array.isArray(sceneData.tiles)) {
      for (let i = 0; i < sceneData.tiles.length; i++) {
        const tile = sceneData.tiles[i];
        if (!tile.id || !/^[A-Z][0-9]+$/.test(tile.id)) {
          errors.push(`Tile ${i}: Invalid tile ID format (must be like A1, B2, etc.)`);
        }
        if (!tile.handler || !['frontend', 'backend', 'both', 'none'].includes(tile.handler)) {
          errors.push(`Tile ${tile.id}: Invalid handler type`);
        }
        if (tile.actions && tile.actions.frontend) {
          for (const action of tile.actions.frontend) {
            if (!['cursor_zoom', 'background_communication', 'matrix_animation_trigger'].includes(action)) {
              errors.push(`Tile ${tile.id}: Unknown frontend action: ${action}`);
            }
          }
        }
      }
    } else {
      errors.push('Tiles must be an array');
    }
    
    // Next scenes validation
    if (Array.isArray(sceneData.nextScenes)) {
      for (let i = 0; i < sceneData.nextScenes.length; i++) {
        const nextScene = sceneData.nextScenes[i];
        if (!nextScene.sceneId || !nextScene.subsceneId || !nextScene.triggerTile) {
          errors.push(`Next scene ${i}: Missing required fields`);
        }
        if (!/^[A-Z][0-9]+$/.test(nextScene.triggerTile)) {
          errors.push(`Next scene ${i}: Invalid trigger tile format`);
        }
      }
    } else {
      errors.push('Next scenes must be an array');
    }
    
    // Metadata validation
    if (sceneData.metadata) {
      if (!sceneData.metadata.title) {
        errors.push('Metadata must have a title');
      }
      if (!sceneData.metadata.backgroundType) {
        errors.push('Metadata must have a background type');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
    
  } catch (error) {
    errors.push(`Validation error: ${error.message}`);
    return { isValid: false, errors };
  }
}

/**
 * Validate a single tile configuration
 * @param {Object} tile - Tile configuration to validate
 * @returns {Object} Validation result
 */
export function validateTile(tile) {
  const errors = [];
  
  if (!tile.id || !/^[A-Z][0-9]+$/.test(tile.id)) {
    errors.push('Invalid tile ID format');
  }
  
  if (!tile.handler || !['frontend', 'backend', 'both', 'none'].includes(tile.handler)) {
    errors.push('Invalid handler type');
  }
  
  if (tile.actions && tile.actions.frontend) {
    for (const action of tile.actions.frontend) {
      if (!['cursor_zoom', 'background_communication', 'matrix_animation_trigger'].includes(action)) {
        errors.push(`Unknown frontend action: ${action}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Log validation errors with context
 * @param {Object} validationResult - Result from validateSceneData
 * @param {string} sceneId - Scene ID for context
 */
export function logValidationErrors(validationResult, sceneId) {
  if (!validationResult.isValid) {
    console.error(`❌ Scene ${sceneId} validation failed:`);
    validationResult.errors.forEach(error => {
      console.error(`   - ${error}`);
    });
  } else {
    console.log(`✅ Scene ${sceneId} validation passed`);
  }
} 