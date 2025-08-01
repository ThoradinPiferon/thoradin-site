import React, { useState, useRef } from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';
import { getGridId, parseGridId } from '../utils/gridHelpers';
import { getGridConfig, generateGridActions } from '../utils/gridConfig';

const LayeredInterface = () => {
  console.log('LayeredInterface rendering...');
  
  const [currentScene, setCurrentScene] = useState(1); // Main scene ID
  const [currentSubscene, setCurrentSubscene] = useState(1); // Subscene ID
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const matrixRef = useRef(null);
  
  // Get grid configuration based on current scene
  const getSceneName = () => {
    if (currentScene === 1) return 'homepage';
    if (currentScene === 2) return 'vault';
    return 'homepage'; // Default fallback
  };
  
  const gridConfig = getGridConfig(getSceneName());
  
  // Handle grid clicks - all actions go through backend
  const handleGridClick = async (row, col, gridIndex) => {
    const gridId = getGridId(col, row); // Convert to Excel format
    console.log(`Grid click: ${gridId} in Scene ${currentScene}.${currentSubscene}`);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/grid/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gridId: gridId,
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
          
          // Extract grid coordinates from zoomTo (e.g., "K7" -> col=10, row=6)
          const zoomCoords = parseGridId(data.zoomTo);
          const zoomCol = zoomCoords.colIndex;
          const zoomRow = zoomCoords.rowIndex;
          
          // Trigger zoom animation
          await matrixRef.current.handleGridZoom(zoomCol, zoomRow);
          
          // Wait for zoom to complete, then handle next action
          setTimeout(() => {
            setIsZooming(false);
            handleNextAction(data.nextAction);
          }, 1000); // Adjust timing as needed
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
    if (data.sceneId) {
      setCurrentScene(data.sceneId);
    }
    if (data.subsceneId) {
      setCurrentSubscene(data.subsceneId);
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
  
  // Generate grid actions using the configuration
  const gridActions = generateGridActions(gridConfig, handleGridClick);
  
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
  
  // Debug the invisible button logic
  const shouldShowInvisibleButtons = currentScene === 1 && currentSubscene === 1;
  console.log(`🎭 LayeredInterface Debug: Scene ${currentScene}.${currentSubscene}, shouldShowInvisibleButtons: ${shouldShowInvisibleButtons}`);
  console.log(`🎭 Grid Config: ${getSceneName()} - ${gridConfig.rows}x${gridConfig.cols} (${gridConfig.rows * gridConfig.cols} tiles)`);
  
  return (
    <GridPlay
      backgroundComponent={backgroundComponent}
      gridConfig={gridConfig}
      gridActions={gridActions}
      showInvisibleButtons={shouldShowInvisibleButtons} // Invisible during Matrix animation
      currentScene={currentScene}
      currentSubscene={currentSubscene}
      isZooming={isZooming}
      sceneName={getSceneName()}
    />
  );
};

export default LayeredInterface; 