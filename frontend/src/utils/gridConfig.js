/**
 * Grid Configuration System
 * 
 * This module provides a flexible grid configuration system that supports
 * variable grid sizes and dynamic tile generation in Excel-style format.
 */

import { getGridId, getAllGridIds, getGridDimensions } from './gridHelpers.js';

/**
 * Default grid configuration
 */
export const DEFAULT_GRID_CONFIG = {
  rows: 7,
  cols: 11,
  gap: '2px',
  padding: '20px',
  debug: false
};

/**
 * Grid configuration for different scenes
 */
export const SCENE_GRID_CONFIGS = {
  // Homepage - Matrix spiral experience
  'homepage': {
    rows: 7,
    cols: 11,
    gap: '2px',
    padding: '20px',
    debug: false
  },
  
  // Vault - AI interaction interface
  'vault': {
    rows: 7,
    cols: 11,
    gap: '2px',
    padding: '20px',
    debug: false
  },
  
  // Compact grid for testing
  'compact': {
    rows: 3,
    cols: 3,
    gap: '4px',
    padding: '10px',
    debug: true
  },
  
  // Wide grid for special scenes
  'wide': {
    rows: 5,
    cols: 15,
    gap: '1px',
    padding: '15px',
    debug: false
  },
  
  // Tall grid for vertical layouts
  'tall': {
    rows: 10,
    cols: 7,
    gap: '3px',
    padding: '25px',
    debug: false
  },
  
  // Single tile for Matrix Awakening (Scene 1.1)
  'matrix_awakening': {
    rows: 1,
    cols: 1,
    gap: '0px',
    padding: '0px',
    debug: false,
    invisibleMode: true
  }
};

/**
 * Generate grid configuration for a specific scene
 * @param {string} sceneName - Scene name (e.g., 'homepage', 'vault')
 * @param {Object} customConfig - Optional custom configuration overrides
 * @returns {Object} Grid configuration object
 */
export function getGridConfig(sceneName = 'homepage', customConfig = {}) {
  const baseConfig = SCENE_GRID_CONFIGS[sceneName] || DEFAULT_GRID_CONFIG;
  return {
    ...baseConfig,
    ...customConfig
  };
}

/**
 * Generate grid configuration based on scene state
 * @param {number} sceneId - Scene ID
 * @param {number} subsceneId - Subscene ID
 * @param {Object} customConfig - Optional custom configuration overrides
 * @returns {Object} Grid configuration object
 */
export function getSceneGridConfig(sceneId, subsceneId, customConfig = {}) {
  // Special case for Scene 1.1 (Matrix Awakening) - 1x1 invisible grid
  if (sceneId === 1 && subsceneId === 1) {
    return getGridConfig('matrix_awakening', customConfig);
  }
  
  // Scene 1.2 (Matrix Static) - full homepage grid
  if (sceneId === 1 && subsceneId === 2) {
    return getGridConfig('homepage', customConfig);
  }
  
  // Scene 2.1 (Vault) - vault grid
  if (sceneId === 2 && subsceneId === 1) {
    return getGridConfig('vault', customConfig);
  }
  
  // Default scene mapping
  let sceneName = 'homepage';
  if (sceneId === 1) sceneName = 'homepage';
  if (sceneId === 2) sceneName = 'vault';
  
  return getGridConfig(sceneName, customConfig);
}

/**
 * Generate all tile IDs for a given grid configuration
 * @param {Object} config - Grid configuration object
 * @returns {Array<string>} Array of tile IDs in Excel format
 */
export function generateTileIds(config) {
  const { rows, cols } = config;
  
  // Validate grid dimensions to prevent RangeError
  const validRows = Math.max(1, Math.min(rows || 7, 100)); // Limit to reasonable range
  const validCols = Math.max(1, Math.min(cols || 11, 100)); // Limit to reasonable range
  
  const tileIds = [];
  
  for (let row = 0; row < validRows; row++) {
    for (let col = 0; col < validCols; col++) {
      tileIds.push(getGridId(col, row));
    }
  }
  
  return tileIds;
}

/**
 * Generate grid actions array for a given configuration
 * @param {Object} config - Grid configuration object
 * @param {Function} clickHandler - Function to handle tile clicks
 * @returns {Array<Function>} Array of click handlers
 */
export function generateGridActions(config, clickHandler) {
  const { rows, cols } = config;
  
  // Validate grid dimensions to prevent RangeError
  const validRows = Math.max(1, Math.min(rows || 7, 100)); // Limit to reasonable range
  const validCols = Math.max(1, Math.min(cols || 11, 100)); // Limit to reasonable range
  
  const actions = new Array(validRows * validCols).fill(null);
  
  for (let i = 0; i < actions.length; i++) {
    const row = Math.floor(i / validCols);
    const col = i % validCols;
    actions[i] = () => clickHandler(row, col, i);
  }
  
  return actions;
}

/**
 * Get CSS Grid template styles for a configuration
 * @param {Object} config - Grid configuration object
 * @returns {Object} CSS styles object
 */
export function getGridStyles(config) {
  const { rows, cols, gap, padding } = config;
  
  // Validate grid dimensions to prevent CSS issues
  const validRows = Math.max(1, Math.min(rows || 7, 100)); // Limit to reasonable range
  const validCols = Math.max(1, Math.min(cols || 11, 100)); // Limit to reasonable range
  
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${validCols}, 1fr)`,
    gridTemplateRows: `repeat(${validRows}, 1fr)`,
    gap: gap,
    padding: padding,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    pointerEvents: 'auto'
  };
}

/**
 * Get tile styles based on configuration and state
 * @param {Object} config - Grid configuration object
 * @param {boolean} showInvisibleButtons - Whether to show invisible buttons
 * @param {boolean} isZooming - Whether zoom animation is active
 * @param {string} gridId - Tile grid ID
 * @param {boolean} hasAction - Whether tile has a click action
 * @returns {Object} CSS styles object
 */
export function getTileStyles(config, showInvisibleButtons, isZooming, gridId, hasAction) {
  const { debug } = config;
  
  if (showInvisibleButtons) {
    // Completely invisible buttons for Matrix animation - but still clickable!
    return {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'transparent',
      opacity: 0,
      pointerEvents: 'auto',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 5,
      // Keep visible for clicks but transparent
      visibility: 'visible',
      // Ensure no background or borders show through
      background: 'transparent',
      outline: 'none',
      boxShadow: 'none',
      // Debug overlay for invisible buttons
      ...(debug && {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        border: '1px solid rgba(255, 0, 0, 0.3)',
        color: 'rgba(255, 0, 0, 0.8)',
        opacity: 0.8,
        fontSize: '8px',
        visibility: 'visible'
      })
    };
  } else {
    // Normal visible buttons for other scenes
    return {
      backgroundColor: 'rgba(31, 41, 55, 0.2)',
      border: '1px solid rgba(75, 85, 99, 0.3)',
      color: 'rgb(209, 213, 219)',
      transition: 'all 0.2s',
      cursor: hasAction ? 'pointer' : 'default',
      opacity: hasAction ? 1 : 0.5,
      visibility: 'visible',
      // Debug overlay for visible buttons
      ...(debug && {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        border: '1px solid rgba(0, 255, 0, 0.3)',
        color: 'rgba(0, 255, 0, 0.8)',
        fontSize: '10px'
      }),
      // Zoom state - completely hide grid during zoom
      ...(isZooming && {
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
        transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out'
      })
    };
  }
}

/**
 * Get tile CSS classes based on configuration and state
 * @param {Object} config - Grid configuration object
 * @param {boolean} showInvisibleButtons - Whether to show invisible buttons
 * @param {boolean} isZooming - Whether zoom animation is active
 * @param {boolean} hasAction - Whether tile has a click action
 * @returns {string} CSS classes string
 */
export function getTileClasses(config, showInvisibleButtons, isZooming, hasAction) {
  const baseClasses = `
    w-full h-full 
    flex items-center justify-center
    text-xs font-mono
    focus:outline-none focus:ring-0
    transition-all duration-200
  `;
  
  if (showInvisibleButtons) {
    return baseClasses + ' cursor-pointer';
  } else {
    const hoverClasses = hasAction 
      ? 'hover:bg-gray-700/30 hover:border-gray-500/50 hover:text-white' 
      : '';
    const focusClasses = hasAction 
      ? 'focus:ring-2 focus:ring-blue-500/50' 
      : '';
    const zoomClasses = isZooming ? 'pointer-events-none opacity-30' : '';
    
    return `${baseClasses} ${hoverClasses} ${focusClasses} ${zoomClasses}`.trim();
  }
}

/**
 * Validate grid configuration
 * @param {Object} config - Grid configuration object
 * @returns {Object} Validation result with isValid and errors
 */
export function validateGridConfig(config) {
  const errors = [];
  
  if (!config.rows || typeof config.rows !== 'number' || config.rows < 1) {
    errors.push('rows must be a positive number');
  }
  
  if (!config.cols || typeof config.cols !== 'number' || config.cols < 1) {
    errors.push('cols must be a positive number');
  }
  
  if (config.rows > 26) {
    errors.push('rows cannot exceed 26 (Excel column limit)');
  }
  
  if (config.cols > 1000) {
    errors.push('cols cannot exceed 1000 (reasonable limit)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}



/**
 * Create a grid configuration with custom dimensions
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {Object} options - Additional options
 * @returns {Object} Grid configuration object
 */
export function createGridConfig(rows, cols, options = {}) {
  const config = {
    rows,
    cols,
    gap: options.gap || '2px',
    padding: options.padding || '20px',
    debug: options.debug || false
  };
  
  const validation = validateGridConfig(config);
  if (!validation.isValid) {
    throw new Error(`Invalid grid configuration: ${validation.errors.join(', ')}`);
  }
  
  return config;
}

/**
 * Get all available scene configurations
 * @returns {Object} Object with scene names and their configurations
 */
export function getAllSceneConfigs() {
  return SCENE_GRID_CONFIGS;
}

/**
 * Get scene configuration by name
 * @param {string} sceneName - Scene name
 * @returns {Object|null} Grid configuration or null if not found
 */
export function getSceneConfig(sceneName) {
  return SCENE_GRID_CONFIGS[sceneName] || null;
} 