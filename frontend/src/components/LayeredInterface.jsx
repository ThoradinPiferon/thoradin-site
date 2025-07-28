import React from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';

// Homepage with Matrix Animation Background
const LayeredInterface = () => {
  // Grid configuration
  const gridCols = 11;
  const gridRows = 7;
  
  // Default grid actions - redirect to homepage after zoom
  const gridActions = [];
  
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