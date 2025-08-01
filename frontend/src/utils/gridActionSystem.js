import { getGridId, parseGridId } from './gridHelpers.js';

/**
 * Grid Action System
 * 
 * This module provides a centralized system for managing grid actions
 * across different pages and scenarios. It uses Excel-style coordinates (A1-K7).
 */

// Action types
export const ACTION_TYPES = {
  NAVIGATE: 'navigate',
  TRIGGER: 'trigger',
  TOGGLE: 'toggle',
  CUSTOM: 'custom',
  SCENE_TRANSITION: 'scene_transition'
};

// Page identifiers
export const PAGES = {
  HOME: 'home',
  VAULT: 'vault',
  EXAMPLE: 'example',
  SETTINGS: 'settings',
  PROFILE: 'profile'
};

// Global action registry
const gridActions = new Map();

/**
 * Add a grid action for a specific page and grid position
 * @param {string} page - Page identifier
 * @param {string} gridKey - Grid key (e.g., "K7")
 * @param {Object} action - Action object
 */
export const addGridAction = (page, gridKey, action) => {
  const key = `${page}:${gridKey}`;
  gridActions.set(key, action);
  console.log(`✅ Added grid action for ${page}:${gridKey}`);
};

/**
 * Remove a grid action
 * @param {string} page - Page identifier
 * @param {string} gridKey - Grid key (e.g., "K7")
 */
export const removeGridAction = (page, gridKey) => {
  const key = `${page}:${gridKey}`;
  const removed = gridActions.delete(key);
  if (removed) {
    console.log(`🗑️ Removed grid action for ${page}:${gridKey}`);
  }
  return removed;
};

/**
 * Get all actions for a specific page
 * @param {string} page - Page identifier
 * @param {Object} context - Context object
 * @returns {Object} Actions object
 */
export const getPageActions = (page, context = {}) => {
  const actions = {};
  
  // Get registered actions
  for (const [key, action] of gridActions.entries()) {
    if (key.startsWith(`${page}:`)) {
      const gridKey = key.split(':')[1];
      actions[gridKey] = action;
    }
  }
  
  // Get default actions based on page
  const defaultActions = getDefaultActions(page, context);
  return { ...defaultActions, ...actions };
};

/**
 * Get default actions for each page
 * @param {string} page - Page identifier
 * @param {Object} context - Context object
 * @returns {Object} Default actions
 */
const getDefaultActions = (page, context) => {
  switch (page) {
    case PAGES.HOME:
      return getHomeActions(context);
    case PAGES.VAULT:
      return getVaultActions(context);
    case PAGES.EXAMPLE:
      return getExampleActions(context);
    case PAGES.SETTINGS:
      return getSettingsActions(context);
    case PAGES.PROFILE:
      return getProfileActions(context);
    default:
      return {};
  }
};

/**
 * Resolve grid action for a specific position
 * @param {number} col - Column index (0-10)
 * @param {number} row - Row index (0-6)
 * @param {string} page - Page identifier
 * @param {Object} context - Context object
 * @returns {Object|null} Action object or null
 */
export const resolveGridAction = (col, row, page, context = {}) => {
  const gridKey = getGridId(col, row);
  const pageActions = getPageActions(page, context);
  
  console.log(`🎯 Resolving action for ${gridKey} on ${page}`);
  console.log(`Available actions:`, Object.keys(pageActions));
  
  return pageActions[gridKey] || null;
};

/**
 * Home page actions
 */
const getHomeActions = (context) => ({
  'K7': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/vault',
    description: 'Navigate to Vault',
    execute: () => window.location.href = '/vault'
  },
  'A1': {
    type: ACTION_TYPES.TRIGGER,
    description: 'Fast forward animation',
    execute: (context) => {
      if (context.animationController) {
        context.animationController.fastForward();
      }
    }
  },
  'B1': {
    type: ACTION_TYPES.TOGGLE,
    description: 'Toggle zoom',
    execute: (context) => {
      if (context.zoomController) {
        context.zoomController.toggle();
      }
    }
  },
  'C3': {
    type: ACTION_TYPES.CUSTOM,
    description: 'Special home action',
    execute: () => console.log('Special home action triggered')
  }
});

/**
 * Vault page actions (mostly non-interactive)
 */
const getVaultActions = (context) => ({
  // Vault page is mostly non-interactive
  // Only specific areas might have actions
  'A1': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/',
    description: 'Back to home',
    execute: () => window.location.href = '/'
  }
});

/**
 * Example page actions
 */
const getExampleActions = (context) => ({
  'E5': {
    type: ACTION_TYPES.TRIGGER,
    description: 'Example grid action',
    execute: (context) => {
      alert(`You clicked grid E5! Context: ${JSON.stringify(context)}`);
    }
  },
  'C3': {
    type: ACTION_TYPES.CUSTOM,
    description: 'Custom example action',
    execute: () => {
      console.log('Custom example action executed');
    }
  },
  'A1': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/',
    description: 'Back to home',
    execute: () => window.location.href = '/'
  }
});

/**
 * Settings page actions
 */
const getSettingsActions = (context) => ({
  'A1': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/',
    description: 'Back to home',
    execute: () => window.location.href = '/'
  },
  'E3': {
    type: ACTION_TYPES.TOGGLE,
    description: 'Toggle sound',
    execute: (context) => {
      if (context.settings) {
        context.settings.toggleSound();
      }
    }
  },
  'G3': {
    type: ACTION_TYPES.TOGGLE,
    description: 'Toggle theme',
    execute: (context) => {
      if (context.settings) {
        context.settings.toggleTheme();
      }
    }
  }
});

/**
 * Profile page actions
 */
const getProfileActions = (context) => ({
  'A1': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/',
    description: 'Back to home',
    execute: () => window.location.href = '/'
  },
  'E5': {
    type: ACTION_TYPES.CUSTOM,
    description: 'Edit profile',
    execute: (context) => {
      if (context.profile) {
        context.profile.edit();
      }
    }
  }
});

/**
 * Execute a grid action
 * @param {Object} action - Action object
 * @param {Object} context - Context object
 * @returns {any} Action result
 */
export const executeGridAction = (action, context = {}) => {
  if (!action) {
    console.log('❌ No action to execute');
    return null;
  }
  
  console.log(`🎬 Executing action: ${action.type} - ${action.description}`);
  
  try {
    const result = action.execute(context);
    console.log(`✅ Action executed successfully`);
    return result;
  } catch (error) {
    console.error(`💥 Action execution failed:`, error);
    return null;
  }
};

/**
 * Create a grid action handler for a specific page
 * @param {string} page - Page identifier
 * @param {Object} context - Context object
 * @returns {Function} Handler function
 */
export const createGridActionHandler = (page, context = {}) => {
  return (col, row) => {
    const action = resolveGridAction(col, row, page, context);
    return executeGridAction(action, context);
  };
};

/**
 * Get all grid actions as an array
 * @param {string} page - Page identifier
 * @param {Object} context - Context object
 * @returns {Array} Array of action objects
 */
export const getGridActionsArray = (page, context = {}) => {
  const actions = getPageActions(page, context);
  return Object.entries(actions).map(([gridKey, action]) => ({
    gridKey,
    ...action
  }));
};

/**
 * Validate grid coordinates
 * @param {number} col - Column index (0-10)
 * @param {number} row - Row index (0-6)
 * @returns {boolean} True if valid
 */
export const isValidGridCoordinates = (col, row) => {
  return col >= 0 && col <= 10 && row >= 0 && row <= 6;
};

/**
 * Get grid key from coordinates
 * @param {number} col - Column index (0-10)
 * @param {number} row - Row index (0-6)
 * @returns {string} - Grid key (e.g., "K7")
 */
export const getGridKey = (col, row) => {
  return getGridId(col, row);
};

/**
 * Get coordinates from grid key
 * @param {string} gridKey - Grid key (e.g., "K7")
 * @returns {Object} - { col: number, row: number }
 */
export const getCoordinatesFromKey = (gridKey) => {
  return parseGridId(gridKey);
}; 