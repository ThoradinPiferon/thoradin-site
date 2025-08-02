/**
 * Scene Zoom Manager - Generic zoom system for any background layer
 * 
 * This module provides a background-agnostic zoom system that can work with
 * any visual background (Matrix, static grid, hand-drawn canvas, etc.)
 */

import { parseGridId, getGridId } from './gridHelpers.js';

// Global state for zoom management
let currentZoomState = {
  isZooming: false,
  currentTarget: null,
  activeBackgroundRef: null
};

// Background layer registry - different backgrounds can register their zoom handlers
const backgroundZoomHandlers = new Map();

/**
 * Register a background layer with its zoom handler
 * @param {string} backgroundType - Type of background ('matrix', 'static', 'vault', etc.)
 * @param {Object} ref - Reference to the background component
 * @param {Function} zoomHandler - Function that handles zoom for this background
 */
export const registerBackgroundZoomHandler = (backgroundType, ref, zoomHandler) => {
  backgroundZoomHandlers.set(backgroundType, { ref, zoomHandler });
  console.log(`🎬 Registered zoom handler for background: ${backgroundType}`);
};

/**
 * Set the currently active background reference
 * @param {Object} ref - Reference to the active background component
 */
export const setActiveBackgroundRef = (ref) => {
  currentZoomState.activeBackgroundRef = ref;
};

/**
 * Get the currently active background reference
 * @returns {Object|null} Active background reference
 */
export const getActiveBackgroundRef = () => {
  return currentZoomState.activeBackgroundRef;
};

/**
 * Generic zoom function that works with any background layer
 * @param {string|Object} target - Grid ID string or coordinate object
 * @param {Object} options - Zoom options
 * @param {string} backgroundType - Type of background to zoom on (optional, auto-detected)
 * @returns {Promise} Promise that resolves when zoom completes
 */
export const zoomToTile = async (target, options = {}, backgroundType = null) => {
  const { delay = 0, duration = 1000, scale = 2 } = options;
  
  // Auto-detect background type if not provided
  if (!backgroundType) {
    backgroundType = detectActiveBackgroundType();
  }
  
  if (!backgroundType) {
    console.error('❌ No active background type detected');
    return Promise.resolve();
  }
  
  const handler = backgroundZoomHandlers.get(backgroundType);
  if (!handler) {
    console.error(`❌ No zoom handler registered for background type: ${backgroundType}`);
    return Promise.resolve();
  }
  
  // Parse target if it's a string (grid ID)
  let colIndex, rowIndex;
  if (typeof target === 'string') {
    const coords = parseGridId(target);
    colIndex = coords.colIndex;
    rowIndex = coords.rowIndex;
  } else if (typeof target === 'object' && target.colIndex !== undefined && target.rowIndex !== undefined) {
    colIndex = target.colIndex;
    rowIndex = target.rowIndex;
  } else {
    console.error('❌ Invalid target format:', target);
    return Promise.resolve();
  }
  
  const gridId = getGridId(colIndex, rowIndex);
  console.log(`🎬 Generic zoom called: ${gridId} (${colIndex}, ${rowIndex}) on ${backgroundType} background`);
  
  // Set zoom state
  currentZoomState.isZooming = true;
  currentZoomState.currentTarget = gridId;
  
  // Add delay if specified
  if (delay > 0) {
    console.log(`⏳ Waiting ${delay}ms before zoom...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  try {
    // Call the background-specific zoom handler
    await handler.zoomHandler(colIndex, rowIndex, options);
    console.log(`✅ Generic zoom completed: ${gridId} on ${backgroundType}`);
  } catch (error) {
    console.error(`❌ Zoom error on ${backgroundType}:`, error);
  } finally {
    // Reset zoom state
    currentZoomState.isZooming = false;
    currentZoomState.currentTarget = null;
  }
};

/**
 * Auto-detect the currently active background type
 * @returns {string|null} Active background type
 */
const detectActiveBackgroundType = () => {
  // This could be enhanced to detect based on current scene state
  // For now, we'll use a simple heuristic based on the active ref
  if (currentZoomState.activeBackgroundRef) {
    // Check if it has matrix-specific properties
    if (currentZoomState.activeBackgroundRef.handleGridZoom) {
      return 'matrix';
    }
    // Add more background type detection as needed
  }
  return null;
};

/**
 * Batch zoom function - zoom to multiple targets in sequence
 * @param {Array} targets - Array of targets to zoom to
 * @param {Object} options - Zoom options
 * @param {string} backgroundType - Background type (optional)
 * @returns {Promise} Promise that resolves when all zooms complete
 */
export const batchZoomToTiles = async (targets, options = {}, backgroundType = null) => {
  const { delayBetween = 500, delayBefore = 0 } = options;
  
  console.log(`🎬 Batch zoom called with ${targets.length} targets on ${backgroundType || 'auto-detected'} background`);
  
  // Add initial delay if specified
  if (delayBefore > 0) {
    console.log(`⏳ Waiting ${delayBefore}ms before batch zoom...`);
    await new Promise(resolve => setTimeout(resolve, delayBefore));
  }
  
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    console.log(`🎬 Batch zoom ${i + 1}/${targets.length}: ${target}`);
    
    await zoomToTile(target, options, backgroundType);
    
    // Add delay between zooms (except for the last one)
    if (i < targets.length - 1 && delayBetween > 0) {
      console.log(`⏳ Waiting ${delayBetween}ms before next zoom...`);
      await new Promise(resolve => setTimeout(resolve, delayBetween));
    }
  }
  
  console.log('✅ Batch zoom completed');
};

/**
 * Region zoom function - zoom to all tiles in a region
 * @param {string} startGridId - Starting grid ID
 * @param {string} endGridId - Ending grid ID
 * @param {Object} options - Zoom options
 * @param {string} backgroundType - Background type (optional)
 * @returns {Promise} Promise that resolves when region zoom completes
 */
export const regionZoomToTiles = async (startGridId, endGridId, options = {}, backgroundType = null) => {
  const { delayBetween = 300, pattern = 'horizontal' } = options;
  
  console.log(`🎬 Region zoom called: ${startGridId} to ${endGridId} (${pattern}) on ${backgroundType || 'auto-detected'} background`);
  
  const start = parseGridId(startGridId);
  const end = parseGridId(endGridId);
  
  // Generate all grid IDs in the region
  const targets = [];
  const minCol = Math.min(start.colIndex, end.colIndex);
  const maxCol = Math.max(start.colIndex, end.colIndex);
  const minRow = Math.min(start.rowIndex, end.rowIndex);
  const maxRow = Math.max(start.rowIndex, end.rowIndex);
  
  if (pattern === 'horizontal') {
    // Horizontal pattern: A1, B1, C1, A2, B2, C2, etc.
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        targets.push(getGridId(col, row));
      }
    }
  } else if (pattern === 'vertical') {
    // Vertical pattern: A1, A2, A3, B1, B2, B3, etc.
    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow; row <= maxRow; row++) {
        targets.push(getGridId(col, row));
      }
    }
  } else if (pattern === 'spiral') {
    // Spiral pattern: start from center and spiral outward
    const centerCol = Math.floor((minCol + maxCol) / 2);
    const centerRow = Math.floor((minRow + maxRow) / 2);
    
    // Simple spiral implementation
    let currentCol = centerCol;
    let currentRow = centerRow;
    let direction = 0; // 0: right, 1: down, 2: left, 3: up
    let steps = 1;
    let stepCount = 0;
    
    while (targets.length < (maxCol - minCol + 1) * (maxRow - minRow + 1)) {
      if (currentCol >= minCol && currentCol <= maxCol && currentRow >= minRow && currentRow <= maxRow) {
        targets.push(getGridId(currentCol, currentRow));
      }
      
      // Move in current direction
      switch (direction) {
        case 0: currentCol++; break; // right
        case 1: currentRow++; break; // down
        case 2: currentCol--; break; // left
        case 3: currentRow--; break; // up
      }
      
      stepCount++;
      if (stepCount >= steps) {
        direction = (direction + 1) % 4;
        stepCount = 0;
        if (direction % 2 === 0) steps++;
      }
    }
  }
  
  return batchZoomToTiles(targets, { ...options, delayBetween }, backgroundType);
};

/**
 * Get current zoom state
 * @returns {Object} Current zoom state
 */
export const getZoomState = () => {
  return { ...currentZoomState };
};

/**
 * Check if currently zooming
 * @returns {boolean} True if currently zooming
 */
export const isZooming = () => {
  return currentZoomState.isZooming;
};

/**
 * Clear zoom queue and reset state
 */
export const clearZoomQueue = () => {
  currentZoomState.isZooming = false;
  currentZoomState.currentTarget = null;
  console.log('🎬 Zoom queue cleared');
};

/**
 * Convenience functions for different zoom patterns
 */
export const zoomUtils = {
  toTile: (gridId, options = {}) => zoomToTile(gridId, options),
  toTiles: (targets, options = {}) => batchZoomToTiles(targets, options),
  toRegion: (startGridId, endGridId, options = {}) => regionZoomToTiles(startGridId, endGridId, options),
  withDelay: (gridId, delay) => zoomToTile(gridId, { delay }),
  withScale: (gridId, scale) => zoomToTile(gridId, { scale }),
  withDuration: (gridId, duration) => zoomToTile(gridId, { duration })
}; 