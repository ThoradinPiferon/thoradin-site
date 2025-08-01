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
  
  // Handle grid clicks based on current scene
  const handleGridClick = (col, row, gridIndex) => {
    console.log(`Grid click: G${col}.${row} in Scene ${currentScene}`);
    
    if (currentScene === 1) {
      // Scene 1: Any click fast-forwards Matrix animation
      if (matrixRef.current && matrixRef.current.fastForwardToEnd) {
        console.log('Fast-forwarding Matrix animation...');
        matrixRef.current.fastForwardToEnd();
        setCurrentScene(2);
      }
      return;
    }
    
    if (currentScene === 2) {
      // Scene 2: Any click restarts Matrix animation
      if (matrixRef.current && matrixRef.current.restartAnimation) {
        console.log('Restarting Matrix animation...');
        matrixRef.current.restartAnimation();
        setCurrentScene(1);
        setAnimationComplete(false);
      }
      return;
    }
    
    if (currentScene === 3) {
      // Scene 3: Only G11.7 navigates to Vault
      if (col === 11 && row === 7) {
        console.log(`Clicked G${col}.${row} - Navigating to Vault page`);
        window.location.href = '/vault';
      }
      return;
    }
  };
  
  // Set up all grid actions
  for (let i = 0; i < gridActions.length; i++) {
    gridActions[i] = handleGridClick;
  }
  
  // Handle animation completion
  const handleAnimationComplete = () => {
    console.log('Matrix animation completed - entering Scene 3');
    setAnimationComplete(true);
    setCurrentScene(3);
  };
  
  // Create MatrixSpiralCanvas as background component
  const backgroundComponent = (
    <MatrixSpiralCanvas 
      ref={matrixRef}
      onIntroComplete={handleAnimationComplete}
    />
  );

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <GridPlay
        backgroundComponent={backgroundComponent}
        gridCols={gridCols}
        gridRows={gridRows}
        gridActions={gridActions}
        showInvisibleButtons={true}
        currentScene={currentScene}
      />
    </div>
  );
};

export default LayeredInterface; 