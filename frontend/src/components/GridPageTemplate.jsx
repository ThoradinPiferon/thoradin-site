import React from 'react';
import GridPlay from './GridPlay';
import { getGridActionsArray, PAGES } from '../utils/gridActionSystem';

/**
 * Reusable Grid Page Template
 * 
 * @param {Object} config - Configuration object for the page
 * @param {number} config.gridCols - Number of grid columns (default: 11)
 * @param {number} config.gridRows - Number of grid rows (default: 7)
 * @param {Array} config.uiElements - Array of UI elements to render on Layer 3
 * @param {Array} config.interactiveElements - Array of interactive elements for Layer 4
 * @param {Array} config.gridActions - Array of grid click handlers for Layer 5
 * @param {string} config.pageId - Page identifier (from PAGES enum)
 * @param {Object} config.context - Additional context for grid actions
 * @param {React.Component} config.backgroundComponent - Background component
 * @param {string} config.pageName - Name of the page for logging
 */
const GridPageTemplate = ({ 
  gridCols = 11, 
  gridRows = 7, 
  uiElements = [], 
  interactiveElements = [],
  gridActions = [],
  pageId = PAGES.HOME,
  context = {},
  backgroundComponent = null,
  pageName = "Grid Page"
}) => {
  
  // Log page creation
  console.log(`Rendering ${pageName} (${pageId}) with ${gridCols}x${gridRows} grid`);

  return (
    <GridPlay
      backgroundComponent={backgroundComponent}
      gridCols={gridCols}
      gridRows={gridRows}
      uiElements={uiElements}
      interactiveElements={interactiveElements}
      gridActions={gridActions}
    />
  );
};

export default GridPageTemplate; 