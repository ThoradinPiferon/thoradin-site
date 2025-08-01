import React, { useState, useRef } from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';

const LayeredInterface = () => {
  console.log('LayeredInterface rendering...');
  
  const [currentScene, setCurrentScene] = useState(1); // Main scene ID
  const [currentSubscene, setCurrentSubscene] = useState(1); // Subscene ID
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const matrixRef = useRef(null);
  
  // Grid configuration
  const gridCols = 11;
  const gridRows = 7;
  
  // Grid actions - array of functions for each grid cell
  const gridActions = new Array(gridCols * gridRows).fill(null);
  
  // Handle grid clicks - all actions go through backend
  const handleGridClick = async (col, row, gridIndex) => {
    console.log(`Grid click: G${col}.${row} in Scene ${currentScene}.${currentSubscene}`);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/grid/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gridId: `G${col}.${row}`,
          currentScene: currentScene,
          currentSubscene: currentSubscene,
          action: 'grid_click'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data);
        
        // Handle zoom functionality first
        if (data.zoomTo && matrixRef.current) {
          console.log(`Zooming to ${data.zoomTo}...`);
          setIsZooming(true);
          
          // Extract grid coordinates from zoomTo (e.g., "G3.4" -> col=3, row=4)
          const match = data.zoomTo.match(/G(\d+)\.(\d+)/);
          if (match) {
            const zoomCol = parseInt(match[1]);
            const zoomRow = parseInt(match[2]);
            
            // Trigger zoom animation
            await matrixRef.current.handleGridZoom(zoomCol, zoomRow);
            
            // Wait for zoom to complete, then handle next action
            setTimeout(() => {
              setIsZooming(false);
              handleNextAction(data.nextAction);
            }, 1000); // Adjust timing as needed
          }
        } else {
          // No zoom needed, handle action directly
          handleNextAction(data);
        }
      }
    } catch (error) {
      console.error('Error calling backend grid action:', error);
    }
  };
  
  // Handle the next action after zoom (or immediately if no zoom)
  const handleNextAction = (data) => {
    // Backend controls the scene transitions
    if (data.newScene) {
      setCurrentScene(data.newScene);
    }
    if (data.newSubscene) {
      setCurrentSubscene(data.newSubscene);
    }
    
    // Backend controls Matrix animation
    if (data.matrixAction === 'fastForward' && matrixRef.current) {
      matrixRef.current.fastForwardToEnd();
    } else if (data.matrixAction === 'restart' && matrixRef.current) {
      matrixRef.current.restartAnimation();
    }
    
    // Backend controls navigation/scenarios
    if (data.navigateTo) {
      console.log('Backend requested navigation to:', data.navigateTo);
      // In a single-page app, this would trigger a state change to render the Vault scenario
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
      showInvisibleButtons={currentScene === 1 && currentSubscene === 1} // Invisible during Matrix animation
      currentScene={currentScene}
      currentSubscene={currentSubscene}
      isZooming={isZooming}
    />
  );
};

export default LayeredInterface; 