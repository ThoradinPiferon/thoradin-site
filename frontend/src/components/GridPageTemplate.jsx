import React from 'react';
import GridPlay from './GridPlay';

/**
 * Reusable Grid Page Template
 * 
 * @param {Object} config - Configuration object for the page
 * @param {number} config.gridCols - Number of grid columns (default: 11)
 * @param {number} config.gridRows - Number of grid rows (default: 7)
 * @param {Array} config.uiElements - Array of UI elements to render
 * @param {Array} config.interactiveElements - Array of interactive elements
 * @param {Array} config.gridActions - Array of grid click handlers
 * @param {React.Component} config.backgroundComponent - Background component
 * @param {string} config.pageName - Name of the page for logging
 */
const GridPageTemplate = ({ 
  gridCols = 11, 
  gridRows = 7, 
  uiElements = [], 
  interactiveElements = [], 
  gridActions = [], 
  backgroundComponent = null,
  pageName = "Grid Page"
}) => {
  
  // Helper function for grid cell styling
  const getGridCellStyle = (col, row, spanCols = 1, spanRows = 1) => ({
    gridColumn: `${col} / span ${spanCols}`,
    gridRow: `${row} / span ${spanRows}`,
    position: 'relative',
    zIndex: 10
  });

  // Log page creation
  console.log(`Rendering ${pageName} with ${gridCols}x${gridRows} grid`);

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