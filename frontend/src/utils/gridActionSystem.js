import React from 'react';

/**
 * Centralized Grid Action System
 * Takes coordinates and page context to determine grid actions
 */

// Grid action types
export const ACTION_TYPES = {
  NAVIGATE: 'navigate',
  TRIGGER: 'trigger',
  TOGGLE: 'toggle',
  ANIMATE: 'animate',
  CUSTOM: 'custom'
};

// Page identifiers
export const PAGES = {
  HOME: 'home',
  VAULT: 'vault',
  EXAMPLE: 'example',
  SETTINGS: 'settings',
  PROFILE: 'profile'
};

// Global action registry for easy modification
const actionRegistry = {
  [PAGES.HOME]: {},
  [PAGES.VAULT]: {},
  [PAGES.EXAMPLE]: {},
  [PAGES.SETTINGS]: {},
  [PAGES.PROFILE]: {}
};

/**
 * Add a new grid action to a page
 * @param {string} page - Page identifier
 * @param {string} gridKey - Grid key (e.g., "G5.7")
 * @param {Object} action - Action object
 */
export const addGridAction = (page, gridKey, action) => {
  if (!actionRegistry[page]) {
    actionRegistry[page] = {};
  }
  
  actionRegistry[page][gridKey] = {
    ...action,
    addedAt: new Date().toISOString()
  };
  
  console.log(`Added grid action for ${page}: ${gridKey}`, action);
};

/**
 * Remove a grid action from a page
 * @param {string} page - Page identifier
 * @param {string} gridKey - Grid key (e.g., "G5.7")
 */
export const removeGridAction = (page, gridKey) => {
  if (actionRegistry[page] && actionRegistry[page][gridKey]) {
    delete actionRegistry[page][gridKey];
    console.log(`Removed grid action for ${page}: ${gridKey}`);
  }
};

/**
 * Get all actions for a page (including dynamically added ones)
 * @param {string} page - Page identifier
 * @param {Object} context - Additional context
 * @returns {Object} - Map of grid keys to actions
 */
export const getPageActions = (page, context = {}) => {
  // Get base actions
  let baseActions = {};
  switch (page) {
    case PAGES.HOME:
      baseActions = getHomeActions(context);
      break;
    case PAGES.VAULT:
      baseActions = getVaultActions(context);
      break;
    case PAGES.EXAMPLE:
      baseActions = getExampleActions(context);
      break;
    case PAGES.SETTINGS:
      baseActions = getSettingsActions(context);
      break;
    case PAGES.PROFILE:
      baseActions = getProfileActions(context);
      break;
    default:
      baseActions = {};
  }
  
  // Merge with dynamically added actions
  const dynamicActions = actionRegistry[page] || {};
  
  return {
    ...baseActions,
    ...dynamicActions
  };
};

/**
 * Central grid action resolver
 * @param {number} col - Grid column (1-11)
 * @param {number} row - Grid row (1-7)
 * @param {string} page - Current page identifier
 * @param {Object} context - Additional context (user, state, etc.)
 * @returns {Object|null} - Action object or null if no action
 */
export const resolveGridAction = (col, row, page, context = {}) => {
  const gridKey = `G${col}.${row}`;
  
  // Get page-specific action map
  const pageActions = getPageActions(page, context);
  
  // Check if this grid cell has an action
  const action = pageActions[gridKey];
  
  if (!action) {
    return null; // No action for this grid cell
  }
  
  return {
    ...action,
    gridKey,
    coordinates: { col, row },
    page
  };
};

/**
 * Home page actions
 */
const getHomeActions = (context) => ({
  'G11.7': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/vault',
    description: 'Navigate to Vault',
    execute: () => window.location.href = '/vault'
  },
  'G1.1': {
    type: ACTION_TYPES.TRIGGER,
    description: 'Fast forward animation',
    execute: (context) => {
      if (context.animationController) {
        context.animationController.fastForward();
      }
    }
  },
  'G2.1': {
    type: ACTION_TYPES.TOGGLE,
    description: 'Toggle zoom',
    execute: (context) => {
      if (context.zoomController) {
        context.zoomController.toggle();
      }
    }
  },
  'G3.3': {
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
  'G1.1': {
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
  'G5.5': {
    type: ACTION_TYPES.TRIGGER,
    description: 'Example grid action',
    execute: (context) => {
      alert(`You clicked grid G5.5! Context: ${JSON.stringify(context)}`);
    }
  },
  'G3.3': {
    type: ACTION_TYPES.CUSTOM,
    description: 'Custom example action',
    execute: () => {
      console.log('Custom example action executed');
    }
  },
  'G1.1': {
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
  'G1.1': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/',
    description: 'Back to home',
    execute: () => window.location.href = '/'
  },
  'G5.3': {
    type: ACTION_TYPES.TOGGLE,
    description: 'Toggle sound',
    execute: (context) => {
      if (context.settings) {
        context.settings.toggleSound();
      }
    }
  },
  'G7.3': {
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
  'G1.1': {
    type: ACTION_TYPES.NAVIGATE,
    target: '/',
    description: 'Back to home',
    execute: () => window.location.href = '/'
  },
  'G5.5': {
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
 * @param {Object} action - Action object from resolveGridAction
 * @param {Object} context - Additional context
 */
export const executeGridAction = (action, context = {}) => {
  if (!action) {
    console.log('No action for this grid cell');
    return;
  }

  console.log(`Executing ${action.type} action: ${action.description}`);
  
  try {
    if (action.execute) {
      action.execute(context);
    } else {
      console.warn('Action has no execute function:', action);
    }
  } catch (error) {
    console.error('Error executing grid action:', error);
  }
};

/**
 * Create a grid action handler for use with GridPlay
 * @param {string} page - Current page
 * @param {Object} context - Additional context
 * @returns {Function} - Grid action handler function
 */
export const createGridActionHandler = (page, context = {}) => {
  return (col, row, index) => {
    const action = resolveGridAction(col, row, page, context);
    executeGridAction(action, context);
  };
};

/**
 * Get all grid actions for a page (for GridPlay compatibility)
 * @param {string} page - Current page
 * @param {Object} context - Additional context
 * @returns {Array} - Array of grid actions for GridPlay
 */
export const getGridActionsArray = (page, context = {}) => {
  const pageActions = getPageActions(page, context);
  const gridActions = new Array(11 * 7).fill(null);
  
  // Convert page actions to grid actions array
  Object.entries(pageActions).forEach(([gridKey, action]) => {
    const [col, row] = gridKey.replace('G', '').split('.').map(Number);
    const index = (row - 1) * 11 + (col - 1);
    
    gridActions[index] = (col, row, gridIndex) => {
      executeGridAction(action, context);
    };
  });
  
  return gridActions;
};

/**
 * Validate grid coordinates
 * @param {number} col - Grid column
 * @param {number} row - Grid row
 * @returns {boolean} - Whether coordinates are valid
 */
export const isValidGridCoordinates = (col, row) => {
  return col >= 1 && col <= 11 && row >= 1 && row <= 7;
};

/**
 * Get grid key from coordinates
 * @param {number} col - Grid column
 * @param {number} row - Grid row
 * @returns {string} - Grid key (e.g., "G5.7")
 */
export const getGridKey = (col, row) => {
  return `G${col}.${row}`;
};

/**
 * Get coordinates from grid key
 * @param {string} gridKey - Grid key (e.g., "G5.7")
 * @returns {Object} - Coordinates {col, row}
 */
export const getCoordinatesFromKey = (gridKey) => {
  const [col, row] = gridKey.replace('G', '').split('.').map(Number);
  return { col, row };
}; 