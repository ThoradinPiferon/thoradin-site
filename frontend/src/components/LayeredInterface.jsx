import React, { useState, useRef, useEffect } from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';
import { getGridId, parseGridId } from '../utils/gridHelpers';
import { getSceneGridConfig, generateGridActions } from '../utils/gridConfig';

const LayeredInterface = () => {
  console.log('LayeredInterface rendering...');
  
  const [currentScene, setCurrentScene] = useState(1); // Main scene ID
  const [currentSubscene, setCurrentSubscene] = useState(1); // Subscene ID
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);
  const matrixRef = useRef(null);
  
  // Get grid configuration based on current scene state
  const gridConfig = getSceneGridConfig(currentScene, currentSubscene);
  
  // Handle auto-advance functionality
  useEffect(() => {
    // Clear any existing timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
    }
    
    // Check if current scene has auto-advance
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('⏰ Setting up auto-advance timer for Scene 1.1');
      const timer = setTimeout(() => {
        console.log('⏰ Auto-advance triggered for Scene 1.1');
        handleAutoAdvance();
      }, 6000); // 6 seconds
      
      setAutoAdvanceTimer(timer);
    }
    
    // Cleanup function
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [currentScene, currentSubscene]);
  
  // Handle auto-advance transition
  const handleAutoAdvance = () => {
    console.log('🎭 Auto-advancing from Scene 1.1 to Scene 1.2');
    setCurrentScene(1);
    setCurrentSubscene(2);
    setAutoAdvanceTimer(null);
  };
  
  // Handle grid clicks - all actions go through backend
  const handleGridClick = async (row, col, gridIndex) => {
    // Clear auto-advance timer if user clicks during Scene 1.1
    if (currentScene === 1 && currentSubscene === 1) {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
        setAutoAdvanceTimer(null);
        console.log('⏰ Auto-advance cancelled by user click');
      }
    }

    const gridId = getGridId(col, row);
    console.log(`Grid click: ${gridId} in Scene ${currentScene}.${currentSubscene}`);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/grid/action`, {
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
      } else {
        console.error('Backend returned error:', response.status, response.statusText);
        // Fallback to local logic when backend fails
        handleLocalFallback(gridId);
      }
    } catch (error) {
      console.error('Error calling backend grid action:', error);
      // Fallback to local logic when backend fails
      handleLocalFallback(gridId);
    }
  };

  // Local fallback logic when backend is unavailable
  const handleLocalFallback = (gridId) => {
    console.log('🔄 Using local fallback logic for grid click:', gridId);
    
    if (currentScene === 1 && currentSubscene === 1) {
      // Scene 1.1: Fast-forward to Scene 1.2
      setCurrentScene(1);
      setCurrentSubscene(2);
      if (matrixRef.current) {
        matrixRef.current.fastForwardToEnd();
      }
    } else if (currentScene === 1 && currentSubscene === 2) {
      // Scene 1.2: Check if it's K7 (vault entrance)
      if (gridId === 'K7') {
        setCurrentScene(2);
        setCurrentSubscene(1);
      } else {
        // Restart matrix
        setCurrentScene(1);
        setCurrentSubscene(1);
        if (matrixRef.current) {
          matrixRef.current.restartAnimation();
        }
      }
    } else if (currentScene === 2 && currentSubscene === 1) {
      // Scene 2.1: Check if it's K7 (return to homepage)
      if (gridId === 'K7') {
        setCurrentScene(1);
        setCurrentSubscene(1);
        if (matrixRef.current) {
          matrixRef.current.restartAnimation();
        }
      }
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
  console.log(`🎭 Grid Config: Scene ${currentScene}.${currentSubscene} - ${gridConfig.rows}x${gridConfig.cols} (${gridConfig.rows * gridConfig.cols} tiles)`);
  console.log(`🎭 Grid Config Details:`, gridConfig);
  console.log(`🎭 Scene State: currentScene=${currentScene}, currentSubscene=${currentSubscene}`);
  console.log(`🎭 Should be invisible: ${currentScene === 1 && currentSubscene === 1}`);
  
  return (
    <GridPlay
      backgroundComponent={backgroundComponent}
      gridConfig={gridConfig}
      gridActions={gridActions}
      showInvisibleButtons={shouldShowInvisibleButtons} // Invisible during Matrix animation
      currentScene={currentScene}
      currentSubscene={currentSubscene}
      isZooming={isZooming}
      sceneName={`scene_${currentScene}_${currentSubscene}`}
    />
  );
};

export default LayeredInterface; 