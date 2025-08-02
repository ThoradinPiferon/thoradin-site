import React, { useState, useRef, useEffect } from 'react';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';
import GridPlay from './GridPlay';
import { generateGridActions } from '../utils/gridConfig';
import { getGridId, parseGridId } from '../utils/gridHelpers';
import { handleGridZoom, isZooming as getZoomState } from '../utils/zoomUtils';
import { zoomToTile, isZooming as getGenericZoomState } from '../utils/sceneZoomManager';
import ZoomTestComponent from './ZoomTestComponent';
import SoulKeyInsights from './SoulKeyInsights.jsx';

const LayeredInterface = () => {
  console.log('🔧 LayeredInterface rendering... - checking for getSceneGridConfig issues');
  
  const [currentScene, setCurrentScene] = useState(1); // Main scene ID
  const [currentSubscene, setCurrentSubscene] = useState(1); // Subscene ID
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isProcessingClick, setIsProcessingClick] = useState(false); // Prevent multiple clicks
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);
  const [matrixState, setMatrixState] = useState('running'); // 'running', 'static', 'zooming'
  const [backendGridConfig, setBackendGridConfig] = useState(null); // Backend-fetched grid configuration
  const [isLoadingGrid, setIsLoadingGrid] = useState(false); // Loading state for grid fetch
  const matrixRef = useRef(null);
  const currentSceneRef = useRef({ scene: 1, subscene: 1 });
  const sessionIdRef = useRef(null);
  
  // Generate session ID and fetch initial grid config on component mount
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`🎭 SoulKey: Session started with ID: ${sessionIdRef.current}`);
    }
    
    // Fetch initial grid configuration
    fetchGridConfig(currentScene, currentSubscene);
  }, []);

  // Manage matrix state based on scene transitions
  useEffect(() => {
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('🎭 Scene 1.1 detected - setting matrix to running');
      setMatrixState('running');
    } else if (currentScene === 1 && currentSubscene === 2) {
      console.log('🎭 Scene 1.2 detected - setting matrix to static');
      setMatrixState('static');
      setIsZooming(false);
    } else {
      console.log('🎭 Other scene detected - keeping matrix state');
    }
  }, [currentScene, currentSubscene]);

  // Force zoom state to false for Scene 1.2 debugging
  const effectiveIsZooming = (currentScene === 1 && currentSubscene === 2) ? false : isZooming;

  // Get grid configuration based on current scene state with fallback
  const getSceneGridConfigFallback = (sceneId, subsceneId) => {
    // Special case for Scene 1.1 (Matrix Awakening) - full grid with A1 trigger
    if (sceneId === 1 && subsceneId === 1) {
      return {
        rows: 7,
        cols: 11,
        gap: '2px',
        padding: '20px',
        debug: false,
        invisibleMode: false, // Make grid visible so A1 can be clicked
        triggerTile: 'A1' // Mark A1 as the trigger tile
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

  // Use backend-fetched grid config if available, otherwise fallback
  let gridConfig;
  try {
    if (backendGridConfig) {
      console.log('🔧 Using backend-fetched grid config:', backendGridConfig);
      gridConfig = backendGridConfig;
    } else {
      gridConfig = getSceneGridConfigFallback(currentScene, currentSubscene);
      console.log('🔧 Using fallback grid config:', gridConfig);
    }
  } catch (error) {
    console.error('❌ Error creating grid config:', error);
    // Emergency fallback
    gridConfig = { rows: 7, cols: 11, gap: '2px', padding: '20px', debug: false };
  }
  
  // Fetch grid configuration from backend
  const fetchGridConfig = async (sceneId, subsceneId) => {
    try {
      setIsLoadingGrid(true);
      console.log(`🔄 Fetching grid config for Scene ${sceneId}.${subsceneId}`);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/grid?sceneId=${sceneId}&subsceneId=${subsceneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend grid config received:', data);
        setBackendGridConfig(data);
        return data;
      } else {
        console.warn('⚠️ Backend grid config fetch failed, using fallback');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching grid config:', error);
      return null;
    } finally {
      setIsLoadingGrid(false);
    }
  };

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
          action: 'grid_click',
          sessionId: sessionIdRef.current
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend auto-advance response:', data);
        
        // Update scene state based on backend response
        if (data.sceneId) {
          setCurrentScene(data.sceneId);
          currentSceneRef.current.scene = data.sceneId;
        }
        if (data.subsceneId) {
          setCurrentSubscene(data.subsceneId);
          currentSceneRef.current.subscene = data.subsceneId;
        }
        
        // Trigger grid rehydration after scene transition
        const newSceneId = data.sceneId || currentSceneRef.current.scene;
        const newSubsceneId = data.subsceneId || currentSceneRef.current.subscene;
        console.log(`🔄 Auto-advance: Triggering grid rehydration for Scene ${newSceneId}.${newSubsceneId}`);
        await fetchGridConfig(newSceneId, newSubsceneId);
        
        // Handle Matrix animation
        if (data.matrixAction === 'fastForward' && matrixRef.current) {
          matrixRef.current.fastForwardToEnd();
        }
      } else {
        console.log('⚠️ Backend auto-advance failed, using local fallback');
        // Local fallback
        setCurrentScene(1);
        setCurrentSubscene(2);
        currentSceneRef.current.scene = 1;
        currentSceneRef.current.subscene = 2;
        
        // Trigger grid rehydration for local fallback
        console.log(`🔄 Auto-advance fallback: Triggering grid rehydration for Scene 1.2`);
        await fetchGridConfig(1, 2);
      }
    } catch (error) {
      console.log('⚠️ Auto-advance error, using local fallback:', error);
      // Local fallback
      setCurrentScene(1);
      setCurrentSubscene(2);
      currentSceneRef.current.scene = 1;
      currentSceneRef.current.subscene = 2;
      
      // Trigger grid rehydration for error fallback
      console.log(`🔄 Auto-advance error fallback: Triggering grid rehydration for Scene 1.2`);
      await fetchGridConfig(1, 2);
    }
    
    setAutoAdvanceTimer(null);
  };
  
  // Handle grid clicks - all actions go through backend
  const handleGridClick = async (row, col, gridIndex) => {
    // Prevent multiple simultaneous clicks
    if (isProcessingClick) {
      console.log('🚫 Click blocked - already processing previous click');
      return;
    }
    
    // Use ref to get current scene state (avoids stale closure issues)
    const currentSceneState = currentSceneRef.current;
    
    // Special handling for Scene 1.1 (Matrix Awakening) - allow A1 clicks to stop spiral
    if (currentSceneState.scene === 1 && currentSceneState.subscene === 1) {
      const gridId = getGridId(col, row);
      console.log(`🎮 Grid click during Scene 1.1: ${gridId}`);
      
      // Check if this is A1 (the trigger tile)
      if (gridId === 'A1') {
        console.log('🎬 A1 clicked during spiral animation - triggering frontend-only spiral stop');
        
        // Frontend-only spiral stop - no backend call needed
        if (matrixRef.current && matrixRef.current.stopSpiral) {
          matrixRef.current.stopSpiral();
          console.log('✅ Spiral animation stopped via frontend trigger');
        } else {
          console.log('⚠️ Matrix ref or stopSpiral method not available');
        }
        
        // Clear auto-advance timer since user manually stopped
        if (autoAdvanceTimer) {
          clearTimeout(autoAdvanceTimer);
          setAutoAdvanceTimer(null);
          console.log('⏰ Auto-advance cancelled by A1 click');
        }
        
        return; // Exit early - no backend call needed
      } else {
        console.log('🚫 Click disabled for Scene 1.1 (Matrix Awakening) - only A1 allowed');
        return;
      }
    }
    
    // Set processing flag to prevent multiple clicks
    setIsProcessingClick(true);
    console.log('🔒 Click processing started - blocking further clicks');
    
    // Clear auto-advance timer if user clicks during Scene 1.1
    if (currentSceneState.scene === 1 && currentSceneState.subscene === 1) {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
        setAutoAdvanceTimer(null);
        console.log('⏰ Auto-advance cancelled by user click');
      }
    }

    const gridId = getGridId(col, row);
    console.log(`🎮 Grid click: ${gridId} in Scene ${currentSceneState.scene}.${currentSceneState.subscene}`);
    console.log(`🔍 Current state at click time: currentScene=${currentSceneState.scene}, currentSubscene=${currentSceneState.subscene}`);
    console.log(`🔍 Zoom state at click: isZooming=${isZooming}, globalZoomState=${getZoomState()}, genericZoomState=${getGenericZoomState()}`);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/grid/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gridId: gridId,
          currentScene: currentSceneState.scene,
          currentSubscene: currentSceneState.subscene,
          action: 'grid_click',
          sessionId: sessionIdRef.current
        })
      });
      
      console.log(`🔍 Backend response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend response:', data);
        
        // Special handling for Scene 1.2: Handle backend zoom response structure
        if (currentSceneState.scene === 1 && currentSceneState.subscene === 2) {
          console.log(`🎬 Scene 1.2: Processing backend response:`, data);
          console.log(`🎬 Scene 1.2: zoomTo=${data.zoomTo}, nextAction=${JSON.stringify(data.nextAction)}`);
          
          // Check if backend returned a zoom action structure
          if (data.zoomTo && data.nextAction) {
            console.log(`🎬 Scene 1.2: Backend requested zoom to ${data.zoomTo} then transition`);
            console.log('✅ Grid Zoom Started');
            setIsZooming(true);
            setMatrixState('zooming'); // Set matrix to zooming state
            
            // Use clean auto-detection zoom
            console.log(`🎬 Starting zoom animation to grid ${data.zoomTo}`);
            await zoomToTile(data.zoomTo, {}, currentSceneState.scene, currentSceneState.subscene);
            console.log(`🎬 Zoom animation completed for grid ${data.zoomTo}`);
            
            // Let the zoom effect sink in naturally (no artificial delay)
            console.log('🎬 Zoom completed - processing next action immediately');
            
            // Reset zoom state
            setIsZooming(false);
            console.log('✅ Grid Zoom Completed');
            // Matrix state will be updated by handleNextAction based on scene transition
            
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
            
            // Use clean auto-detection zoom
            await zoomToTile(data.zoomTo, {}, currentSceneState.scene, currentSceneState.subscene);
            console.log(`🎬 Zoom animation completed for ${data.zoomTo}`);
            
            // Let the zoom effect sink in naturally (no artificial delay)
            console.log('🎬 Zoom completed - processing next action immediately');
            
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
        await handleLocalFallback(gridId);
      }
    } catch (error) {
      console.error('❌ Error calling backend grid action:', error);
      // Fallback to local logic when backend fails
      await handleLocalFallback(gridId);
    } finally {
      // Always reset processing flag
      setIsProcessingClick(false);
      console.log('🔓 Click processing completed - allowing new clicks');
    }
  };

  // Local fallback logic when backend is unavailable
  const handleLocalFallback = async (gridId) => {
    console.log('🔄 Using local fallback logic for grid click:', gridId);
    
    if (currentScene === 1 && currentSubscene === 1) {
      // Scene 1.1: Fast-forward to Scene 1.2
      setCurrentScene(1);
      setCurrentSubscene(2);
      console.log(`🔄 Local fallback: Triggering grid rehydration for Scene 1.2`);
      await fetchGridConfig(1, 2);
      if (matrixRef.current) {
        matrixRef.current.fastForwardToEnd();
      }
    } else if (currentScene === 1 && currentSubscene === 2) {
      // Scene 1.2: Check if it's K7 (vault entrance)
      if (gridId === 'K7') {
        setCurrentScene(2);
        setCurrentSubscene(1);
        console.log(`🔄 Local fallback: Triggering grid rehydration for Scene 2.1`);
        await fetchGridConfig(2, 1);
      } else {
        // Restart matrix
        setCurrentScene(1);
        setCurrentSubscene(1);
        console.log(`🔄 Local fallback: Triggering grid rehydration for Scene 1.1`);
        await fetchGridConfig(1, 1);
        if (matrixRef.current) {
          matrixRef.current.restartAnimation();
        }
      }
    } else if (currentScene === 2 && currentSubscene === 1) {
      // Scene 2.1: Check if it's K7 (return to homepage)
      if (gridId === 'K7') {
        setCurrentScene(1);
        setCurrentSubscene(1);
        console.log(`🔄 Local fallback: Triggering grid rehydration for Scene 1.1`);
        await fetchGridConfig(1, 1);
        if (matrixRef.current) {
          matrixRef.current.restartAnimation();
        }
      }
    }
  };
  
  // Handle the next action after zoom (or immediately if no zoom)
  const handleNextAction = async (data) => {
    console.log('🎭 handleNextAction called with data:', data);
    
    // Backend controls the scene transitions
    if (data.sceneId) {
      console.log(`✅ Setting scene to ${data.sceneId}`);
      setCurrentScene(data.sceneId);
      currentSceneRef.current.scene = data.sceneId;
    }
    if (data.subsceneId) {
      console.log(`✅ Setting subscene to ${data.subsceneId}`);
      setCurrentSubscene(data.subsceneId);
      currentSceneRef.current.subscene = data.subsceneId;
    }
    
    // Trigger grid rehydration after scene transition
    const newSceneId = data.sceneId || currentSceneRef.current.scene;
    const newSubsceneId = data.subsceneId || currentSceneRef.current.subscene;
    
    console.log(`🔄 Triggering grid rehydration for Scene ${newSceneId}.${newSubsceneId}`);
    await fetchGridConfig(newSceneId, newSubsceneId);
    
    // Backend controls Matrix animation - now using state-based transitions
    if (data.matrixAction === 'fastForward' && matrixRef.current) {
      console.log('✅ Matrix fastForward triggered');
      matrixRef.current.fastForwardToEnd();
      setMatrixState('static'); // Transition to static state
    } else if (data.matrixAction === 'restart' && matrixRef.current) {
      console.log('✅ Matrix restart triggered');
      // Only restart animation if we're not coming from Scene 1.2 (to avoid spiral replay)
      if (!(currentSceneRef.current.scene === 1 && currentSceneRef.current.subscene === 2)) {
        matrixRef.current.restartAnimation();
        setMatrixState('running'); // Transition to running state
      } else {
        console.log('🎭 Skipping matrix restart - coming from Scene 1.2');
      }
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
    
    // Show backend messages
    if (data.message) {
      console.log('🎭 Backend message:', data.message);
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
  console.log(`🎭 Zoom State: isZooming=${isZooming}, effectiveIsZooming=${effectiveIsZooming}, globalZoomState=${getZoomState()}, genericZoomState=${getGenericZoomState()}`);
  
  return (
    <div className="layered-interface" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Background Layer */}
      <div className="background-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <MatrixSpiralCanvas 
          ref={matrixRef}
          matrixState={matrixState}
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
          isZooming={effectiveIsZooming}
          isProcessingClick={isProcessingClick}
        />
      </div>

      {/* Zoom Test Component (for development) */}
      <ZoomTestComponent />
      
      {/* SoulKey Insights Component */}
      <SoulKeyInsights sessionId={sessionIdRef.current} />
    </div>
  );
};

export default LayeredInterface; 