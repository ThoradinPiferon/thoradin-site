import React from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';

// Homepage with Matrix Animation Background
const LayeredInterface = () => {
  // Grid configuration
  const gridCols = 11;
  const gridRows = 7;
  
  // Grid actions - array of functions for each grid cell
  const gridActions = new Array(gridCols * gridRows).fill(null);
  
  // G11.7 (bottom right) - Navigate to AI page
  // Grid index calculation: (row - 1) * gridCols + (col - 1)
  // For G11.7: (7 - 1) * 11 + (11 - 1) = 6 * 11 + 10 = 66 + 10 = 76
  gridActions[76] = (col, row, gridIndex) => {
    console.log(`Clicked G${col}.${row} - Navigating to AI page`);
    window.location.href = '/ai';
  };
  
  // Create MatrixSpiralCanvas as background component
  const backgroundComponent = <MatrixSpiralCanvas />;

  return (
    <GridPlay
      backgroundComponent={backgroundComponent}
      gridCols={gridCols}
      gridRows={gridRows}
      gridActions={gridActions}
    />
  );
};

export default LayeredInterface; 