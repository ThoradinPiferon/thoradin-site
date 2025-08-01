import React, { useState, useRef, useEffect } from 'react';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';
import GridPlay from './GridPlay';
import { generateGridActions } from '../utils/gridConfig';
import { getGridId, parseGridId } from '../utils/gridHelpers';
import { handleGridZoom, isZooming as getZoomState } from '../utils/zoomUtils';
import ZoomTestComponent from './ZoomTestComponent';

const LayeredInterface = () => {
  console.log('🔧 LayeredInterface rendering... - checking for getSceneGridConfig issues');
  
  const [currentScene, setCurrentScene] = useState(1); // Main scene ID
  const [currentSubscene, setCurrentSubscene] = useState(1); // Subscene ID
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);
  const matrixRef = useRef(null);
  
  // Get grid configuration based on current scene state with fallback
  const getSceneGridConfigFallback = (sceneId, subsceneId) => {
    // Special case for Scene 1.1 (Matrix Awakening) - 1x1 invisible grid
    if (sceneId === 1 && subsceneId === 1) {
      return {
        rows: 1,
        cols: 1,
        gap: '0px',
        padding: '0px',
        debug: false,
        invisibleMode: true
      };
    }
    
    // Scene 1.2 (Matrix Static) - full homepage grid
    if (sceneId === 1 && subsceneId === 2) {
      return {
        rows: 7,
        cols: 11,
        gap: '2px',
        padding: '20px',
        debug: false
      };
    }
    
    // Scene 2.1 (Vault) - vault grid
    if (sceneId === 2 && subsceneId === 1) {
      return {
        rows: 7,
        cols: 11,
        gap: '2px',
        padding: '20px',
        debug: false
      };
    }
    
    // Default homepage grid
    return {
      rows: 7,
      cols: 11,
      gap: '2px',
      padding: '20px',
      debug: false
    };
  };

  let gridConfig;
  try {
    gridConfig = getSceneGridConfigFallback(currentScene, currentSubscene);
    console.log('🔧 Fallback grid config created:', gridConfig);
  } catch (error) {
    console.error('❌ Error creating grid config:', error);
    // Emergency fallback
    gridConfig = { rows: 7, cols: 11, gap: '2px', padding: '20px', debug: false };
  }
  
  // Handle animation completion
  const handleAnimationComplete = () => {
    console.log('🎬 Matrix animation completed');
    // Auto-advance to Scene 1.2 when animation completes
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('⏰ Animation completed - triggering auto-advance');
      handleAutoAdvance();
    }
  };

  // Handle full-screen click for Scene 1.1 (Matrix Awakening)
  const handleFullScreenClick = async () => {
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('🎬 Full-screen click detected in Scene 1.1 - triggering skip');
      
      // Clear auto-advance timer
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
        setAutoAdvanceTimer(null);
        console.log('⏰ Auto-advance cancelled by user click');
      }
      
      // Trigger the same transition as auto-advance
      await handleAutoAdvance();
    }
  };

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
      }, 8000); // 8 seconds
      
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
  const handleAutoAdvance = async () => {
    console.log('🎭 Auto-advancing from Scene 1.1 to Scene 1.2');
    
    // Call backend to get proper scene transition
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/grid/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gridId: 'A1',
          currentScene: 1,
          currentSubscene: 1,
          action: 'grid_click'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend auto-advance response:', data);
        
        // Update scene state based on backend response
        if (data.sceneId) setCurrentScene(data.sceneId);
        if (data.subsceneId) setCurrentSubscene(data.subsceneId);
        
        // Handle Matrix animation
        if (data.matrixAction === 'fastForward' && matrixRef.current) {
          matrixRef.current.fastForwardToEnd();
        }
      } else {
        console.log('⚠️ Backend auto-advance failed, using local fallback');
        // Local fallback
        setCurrentScene(1);
        setCurrentSubscene(2);
      }
    } catch (error) {
      console.log('⚠️ Auto-advance error, using local fallback:', error);
      // Local fallback
      setCurrentScene(1);
      setCurrentSubscene(2);
    }
    
    setAutoAdvanceTimer(null);
  };
  
  // Handle grid clicks - all actions go through backend
  const handleGridClick = async (row, col, gridIndex) => {
    // Disable clicks for Scene 1.1 (Matrix Awakening)
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('🚫 Click disabled for Scene 1.1 (Matrix Awakening)');
      return;
    }
    
    // Clear auto-advance timer if user clicks during Scene 1.1
    if (currentScene === 1 && currentSubscene === 1) {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
        setAutoAdvanceTimer(null);
        console.log('⏰ Auto-advance cancelled by user click');
      }
    }

    const gridId = getGridId(col, row);
    console.log(`🎮 Grid click: ${gridId} in Scene ${currentScene}.${currentSubscene}`);

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
        console.log('✅ Backend response:', data);
        
        // Special handling for Scene 1.2: Handle backend zoom response structure
        if (currentScene === 1 && currentSubscene === 2) {
          console.log(`🎬 Scene 1.2: Processing backend response:`, data);
          
          // Check if backend returned a zoom action structure
          if (data.zoomTo && data.nextAction) {
            console.log(`🎬 Scene 1.2: Backend requested zoom to ${data.zoomTo} then transition`);
            console.log('✅ Grid Zoom Started');
            setIsZooming(true);
            
            // Use global zoom utility
            console.log(`🎬 Starting zoom animation to grid ${data.zoomTo}`);
            await handleGridZoom(data.zoomTo);
            console.log(`🎬 Zoom animation completed for grid ${data.zoomTo}`);
            
            // Add a pause to let the zoom effect sink in
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Reset zoom state
            setIsZooming(false);
            console.log('✅ Grid Zoom Completed');
            
            // Handle the next action from backend
            console.log('✅ Processing next action from backend:', data.nextAction);
            handleNextAction(data.nextAction);
          } else {
            // Fallback: direct scene transition
            console.log('⚠️ Backend didn\'t return zoom structure, using direct transition');
            handleNextAction(data);
          }
        } else {
          // Handle zoom functionality for other scenes
          if (data.zoomTo && matrixRef.current) {
            console.log(`🎬 Zooming to ${data.zoomTo}...`);
            setIsZooming(true);
            
            // Use global zoom utility
            await handleGridZoom(data.zoomTo);
            
            // Reset zoom state
            setIsZooming(false);
            
            // Handle next action after zoom
            if (data.nextAction) {
              handleNextAction(data.nextAction);
            } else {
              handleNextAction(data);
            }
          } else {
            // No zoom needed, handle action directly
            handleNextAction(data);
          }
        }
      } else {
        console.error('❌ Backend returned error:', response.status, response.statusText);
        // Fallback to local logic when backend fails
        handleLocalFallback(gridId);
      }
    } catch (error) {
      console.error('❌ Error calling backend grid action:', error);
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
    console.log('🎭 handleNextAction called with data:', data);
    
    // Backend controls the scene transitions
    if (data.sceneId) {
      console.log(`✅ Setting scene to ${data.sceneId}`);
      setCurrentScene(data.sceneId);
    }
    if (data.subsceneId) {
      console.log(`✅ Setting subscene to ${data.subsceneId}`);
      setCurrentSubscene(data.subsceneId);
    }
    
    // Backend controls Matrix animation
    if (data.matrixAction === 'fastForward' && matrixRef.current) {
      console.log('✅ Matrix fastForward triggered');
      matrixRef.current.fastForwardToEnd();
    } else if (data.matrixAction === 'restart' && matrixRef.current) {
      console.log('✅ Matrix restart triggered');
      matrixRef.current.restartAnimation();
    }
    
    // Check if we're transitioning to Scene 1.1 (Matrix animation)
    if (data.sceneId === 1 && data.subsceneId === 1) {
      console.log('✅ Matrix animation playing');
    }
    
    // Backend controls navigation/scenarios
    if (data.navigateTo) {
      console.log('Backend requested navigation to:', data.navigateTo);
      // In a single-page app, this would trigger a state change to render the Vault scenario
    }
  };
  
  // Generate grid actions using the configuration
  const gridActions = generateGridActions(gridConfig, handleGridClick);
  
  // Debug the invisible button logic - only show invisible buttons for Scene 1.1
  const shouldShowInvisibleButtons = currentScene === 1 && currentSubscene === 1;
  console.log(`🎭 LayeredInterface Debug: Scene ${currentScene}.${currentSubscene}, shouldShowInvisibleButtons: ${shouldShowInvisibleButtons}`);
  console.log(`🎭 Grid Config: Scene ${currentScene}.${currentSubscene} - ${gridConfig.rows}x${gridConfig.cols} (${gridConfig.rows * gridConfig.cols} tiles)`);
  console.log(`🎭 Grid Config Details:`, gridConfig);
  console.log(`🎭 Scene State: currentScene=${currentScene}, currentSubscene=${currentSubscene}`);
  console.log(`🎭 Should be invisible: ${shouldShowInvisibleButtons}`);
  
  return (
    <div className="layered-interface" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Background Layer */}
      <div className="background-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <MatrixSpiralCanvas 
          ref={matrixRef}
          isRunning={currentScene === 1 && currentSubscene === 1}
          isStatic={currentScene === 1 && currentSubscene === 2}
          onAnimationComplete={handleAnimationComplete}
        />
      </div>

      {/* Full-screen click handler for Scene 1.1 */}
      {(currentScene === 1 && currentSubscene === 1) && (
        <div 
          className="full-screen-click-handler"
          onClick={handleFullScreenClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            cursor: 'pointer',
            background: 'transparent'
          }}
        />
      )}

      {/* Grid Layer */}
      <div className="grid-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
        <GridPlay
          gridConfig={gridConfig}
          sceneName={`Scene ${currentScene}.${currentSubscene}`}
          onTileClick={handleGridClick}
          showInvisibleButtons={shouldShowInvisibleButtons}
          currentScene={currentScene}
          currentSubscene={currentSubscene}
          isZooming={isZooming}
        />
      </div>

      {/* Zoom Test Component (for development) */}
      <ZoomTestComponent />
    </div>
  );
};

export default LayeredInterface; 