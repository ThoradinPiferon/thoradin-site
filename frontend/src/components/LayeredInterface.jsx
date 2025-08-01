import React, { useState, useRef } from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';

const LayeredInterface = () => {
  console.log('LayeredInterface rendering...');
  
  const [currentScene, setCurrentScene] = useState(1); // 1, 2, or 3
  const [animationComplete, setAnimationComplete] = useState(false);
  const matrixRef = useRef(null);
  
  // Grid configuration
  const gridCols = 11;
  const gridRows = 7;
  
  // Grid actions - array of functions for each grid cell
  const gridActions = new Array(gridCols * gridRows).fill(null);
  
  // Handle grid clicks - all actions go through backend
  const handleGridClick = async (col, row, gridIndex) => {
    console.log(`Grid click: G${col}.${row} in Scene ${currentScene}`);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/grid/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gridId: `G${col}.${row}`,
          currentScene: currentScene,
          action: 'grid_click'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data);
        
        // Backend controls the scene transitions
        if (data.newScene) {
          setCurrentScene(data.newScene);
        }
        
        // Backend controls Matrix animation
        if (data.matrixAction === 'fastForward' && matrixRef.current) {
          matrixRef.current.fastForwardToEnd();
        } else if (data.matrixAction === 'restart' && matrixRef.current) {
          matrixRef.current.restartAnimation();
        }
        
        // Backend controls navigation/scenarios
        if (data.navigateTo) {
          // This will be handled by the backend response
          console.log('Backend requested navigation to:', data.navigateTo);
        }
      }
    } catch (error) {
      console.error('Error calling backend grid action:', error);
    }
  };
  
  // Set up grid actions to call backend
  for (let i = 0; i < gridActions.length; i++) {
    const row = Math.floor(i / gridCols) + 1;
    const col = (i % gridCols) + 1;
    gridActions[i] = () => handleGridClick(col, row, i);
  }
  
  // Create MatrixSpiralCanvas as background component
  const backgroundComponent = (
    <MatrixSpiralCanvas 
      ref={matrixRef}
      onAnimationComplete={() => {
        console.log('Matrix animation completed - but staying in current scene');
        setAnimationComplete(true);
        // Don't automatically change scene - let backend control it
      }}
    />
  );
  
  return (
    <GridPlay
      backgroundComponent={backgroundComponent}
      gridCols={gridCols}
      gridRows={gridRows}
      gridActions={gridActions}
      showInvisibleButtons={currentScene === 1} // Invisible during Matrix animation
      currentScene={currentScene}
    />
  );
};

export default LayeredInterface; 