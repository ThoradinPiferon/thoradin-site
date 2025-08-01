import React, { useState, useRef, useEffect } from 'react';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';
import GridPlay from './GridPlay';
import { generateGridActions } from '../utils/gridConfig';
import { getGridId, parseGridId } from '../utils/gridHelpers';
import { 
  performCursorZoom, 
  getCursorPosition, 
  isCursorZooming, 
  setMatrixCanvasRef 
} from '../utils/cursorZoomSystem';
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
  const [scenarioData, setScenarioData] = useState(null); // Complete scenario data from backend
  const [nextScenes, setNextScenes] = useState([]); // Available next scenes with trigger tiles
  const [isLoadingScenario, setIsLoadingScenario] = useState(false); // Loading state for scenario fetch
  const matrixRef = useRef(null);
  const currentSceneRef = useRef({ scene: 1, subscene: 1 });
  const sessionIdRef = useRef(null);
  
  // Generate session ID and fetch initial scenario on component mount
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`🎭 SoulKey: Session started with ID: ${sessionIdRef.current}`);
    }
    
    // Fetch initial scenario data
    fetchScenarioData(currentScene, currentSubscene);
  }, []);

  // LAYERED ARCHITECTURE: Step 4 - Background Layer (Matrix Animation)
  // Only starts after Scenario → Grid → Front Layers are ready
  useEffect(() => {
    // Step 1: Wait for scenario layer to be complete
    if (isLoadingScenario) {
      console.log('🎭 [LAYER 4] Waiting for scenario data to load before starting Matrix animation');
      return;
    }
    
    // Step 2: Wait for grid layer to be ready
    if (!isGridReady) {
      console.log('🎭 [LAYER 4] Waiting for grid configuration to be ready before starting Matrix animation');
      return;
    }
    
    // Step 3: All layers ready, start background animation
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('🎭 [LAYER 4] All layers ready - Scene 1.1 detected, starting Matrix animation');
      setMatrixState('running');
    } else if (currentScene === 1 && currentSubscene === 2) {
      console.log('🎭 [LAYER 4] All layers ready - Scene 1.2 detected, setting Matrix to static');
      setMatrixState('static');
      setIsZooming(false);
    } else {
      console.log('🎭 [LAYER 4] All layers ready - Other scene detected, keeping Matrix state');
    }
  }, [currentScene, currentSubscene, isLoadingScenario, isGridReady]);

  // Force zoom state to false for Scene 1.2 debugging
  const effectiveIsZooming = (currentScene === 1 && currentSubscene === 2) ? false : isZooming;

  // Fetch scenario data from backend
  const fetchScenarioData = async (sceneId, subsceneId) => {
    setIsLoadingScenario(true);
    try {
      console.log(`🎭 Fetching scenario data for Scene ${sceneId}.${subsceneId}`);
      
      const response = await fetch(`/api/grid/scenario?sceneId=${sceneId}&subsceneId=${subsceneId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Scenario data loaded for Scene ${sceneId}.${subsceneId}:`, {
          gridConfig: data.gridConfig,
          nextScenesCount: data.nextScenes.length,
          backgroundType: data.metadata.backgroundType
        });
        
        setScenarioData(data);
        setNextScenes(data.nextScenes);
        setBackendGridConfig(data.gridConfig);
        
        // Update current scene state
        setCurrentScene(data.sceneId);
        setCurrentSubscene(data.subsceneId);
        currentSceneRef.current = { scene: data.sceneId, subscene: data.subsceneId };
        
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch scenario data');
      }
    } catch (error) {
      console.error('❌ Error fetching scenario data:', error);
      
      // Fallback to local grid config
      const fallbackConfig = getSceneGridConfigFallback(sceneId, subsceneId);
      setBackendGridConfig(fallbackConfig);
      setNextScenes([]);
      
      return null;
    } finally {
      setIsLoadingScenario(false);
    }
  };

  // Get grid configuration based on current scene state with fallback
  const getSceneGridConfigFallback = (sceneId, subsceneId) => {
    // Use scenario data if available, otherwise fallback to hardcoded configs
    if (scenarioData && scenarioData.gridConfig) {
      return scenarioData.gridConfig;
    }
    
    // Scene 1.1 (Matrix Awakening) - full grid A1-K7, A1 communicates with background layer
    if (sceneId === 1 && subsceneId === 1) {
      return {
        rows: 7,
        cols: 11,
        gap: '2px',
        padding: '20px',
        debug: false,
        invisibleMode: false, // Full grid visible
        matrixAnimationMode: true, // Matrix animation handles everything
        triggerTile: 'A1' // A1 communicates with background layer
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

  // LAYERED ARCHITECTURE: Scenario → Grid → Front Layers → Background Layer
  
  // Step 1: Scenario Layer - Wait for scenario data to be fully loaded
  let gridConfig;
  let isGridReady = false;
  
  try {
    // ONLY proceed if scenario data is fully loaded
    if (scenarioData && scenarioData.gridConfig && !isLoadingScenario) {
      console.log('🎭 [LAYER 1] Scenario data ready, proceeding to Grid layer');
      
      // Validate grid dimensions to prevent RangeError
      const { rows, cols } = scenarioData.gridConfig;
      const validRows = Math.max(1, Math.min(rows || 7, 100));
      const validCols = Math.max(1, Math.min(cols || 11, 100));
      
      gridConfig = {
        ...scenarioData.gridConfig,
        rows: validRows,
        cols: validCols
      };
      isGridReady = true;
    }
    // Still loading scenario - don't proceed to grid layer yet
    else if (isLoadingScenario) {
      console.log('⏳ [LAYER 1] Scenario data still loading, waiting...');
      gridConfig = { rows: 7, cols: 11, gap: '2px', padding: '20px', debug: false };
      isGridReady = false;
    }
    // Scenario failed to load - use emergency fallback
    else {
      console.log('⚠️ [LAYER 1] Scenario data failed, using emergency fallback');
      const fallbackConfig = getSceneGridConfigFallback(currentScene, currentSubscene);
      
      // Validate fallback dimensions
      const { rows, cols } = fallbackConfig;
      const validRows = Math.max(1, Math.min(rows || 7, 100));
      const validCols = Math.max(1, Math.min(cols || 11, 100));
      
      gridConfig = {
        ...fallbackConfig,
        rows: validRows,
        cols: validCols
      };
      isGridReady = true; // Allow grid to render with fallback
    }
  } catch (error) {
    console.error('❌ [LAYER 1] Critical error in scenario layer:', error);
    gridConfig = { rows: 7, cols: 11, gap: '2px', padding: '20px', debug: false };
    isGridReady = false;
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
        console.warn(`⚠️ Backend grid config fetch failed (${response.status}), using fallback`);
        // Clear any stale backend config to force fallback
        setBackendGridConfig(null);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching grid config:', error);
      // Clear any stale backend config to force fallback
      setBackendGridConfig(null);
      return null;
    } finally {
      setIsLoadingGrid(false);
    }
  };

  // Handle animation completion - Matrix animation is grid-agnostic
  const handleAnimationComplete = () => {
    console.log('🎬 Matrix animation completed - auto-advancing to next scene');
    // Auto-advance is part of the Matrix animation, not grid interaction
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('⏰ Matrix animation auto-advancing to Scene 1.2');
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
        
        // Use modular sequence for backend response
        await performSceneTransitionSequence([
          () => changeScene(data.sceneId || 1, data.subsceneId || 2),
          () => rehydrateGridFromScene(data.sceneId || 1, data.subsceneId || 2),
          () => data.matrixAction === 'fastForward' ? fastForwardMatrix() : Promise.resolve()
        ], 'Auto-advance (Backend)');
      } else {
        console.log('⚠️ Backend auto-advance failed, using local fallback');
        await performAutoAdvance();
      }
    } catch (error) {
      console.log('⚠️ Auto-advance error, using local fallback:', error);
      await performAutoAdvance();
    }
    
    setAutoAdvanceTimer(null);
  };
  
  // Handle grid clicks - scenario-driven approach
  const handleGridClick = async (row, col, gridIndex, event) => {
    // Prevent multiple simultaneous clicks
    if (isProcessingClick) {
      console.log('🚫 Click blocked - already processing previous click');
      return;
    }
    
    // Use ref to get current scene state (avoids stale closure issues)
    const currentSceneState = currentSceneRef.current;
    
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
    
    // Get cursor position for zoom
    const cursorPos = event ? getCursorPosition(event) : null;
    console.log(`🎯 Cursor position:`, cursorPos);

    try {
      // TILE HANDLER SYSTEM: Dynamic dispatch based on backend tile definitions
      const tile = scenarioData?.tiles?.find(t => t.id === gridId);
      
      if (tile) {
        console.log(`🎯 Tile handler found for ${gridId}:`, tile);
        await handleTileByType(tile, gridId, cursorPos);
        return;
      }
      
      // Fallback: Scenario-driven approach: Check if this tile triggers a next scene
      const nextScene = nextScenes.find(scene => scene.triggerTile === gridId);
      
      if (nextScene) {
        console.log(`🎭 Scenario transition: ${gridId} → Scene ${nextScene.sceneId}.${nextScene.subsceneId} (${nextScene.label})`);
        
        // Perform zoom transition to the next scene
        await performZoomTransition(gridId, nextScene.sceneId, nextScene.subsceneId);
        return;
      }
      
      // Legacy fallback: Special handling for Scene 1.1 A1 (communicates with background layer)
      if (currentSceneState.scene === 1 && currentSceneState.subscene === 1 && gridId === 'A1') {
        console.log('🎬 A1 clicked - communicating with background layer (Matrix animation)');
        await performA1BackgroundCommunication();
        return;
      }
      
      // If no next scene is defined for this tile, check if it's disabled
      if (currentSceneState.scene === 1 && currentSceneState.subscene === 1) {
        console.log('🚫 Click disabled for Scene 1.1 (Matrix Awakening) - only A1 allowed');
        return;
      }
      
      // Default handling - send to backend for any additional logic
      console.log('🎮 Sending grid action to backend...');
      
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
        
        // Handle backend response (for any additional logic not covered by scenario)
        handleNextAction(data);
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
      await performSceneTransitionSequence([
        () => changeScene(1, 2),
        () => rehydrateGridFromScene(1, 2),
        () => fastForwardMatrix()
      ], 'Local Fallback: Scene 1.1 → 1.2');
    } else if (currentScene === 1 && currentSubscene === 2) {
      // Scene 1.2: Check if it's K7 (vault entrance)
      if (gridId === 'K7') {
        await performSceneTransitionSequence([
          () => changeScene(2, 1),
          () => rehydrateGridFromScene(2, 1)
        ], 'Local Fallback: Scene 1.2 → 2.1 (Vault)');
      } else {
        // Restart matrix
        await performSceneTransitionSequence([
          () => changeScene(1, 1),
          () => rehydrateGridFromScene(1, 1),
          () => restartMatrixIfActive(1, 1)
        ], 'Local Fallback: Scene 1.2 → 1.1 (Restart)');
      }
    } else if (currentScene === 2 && currentSubscene === 1) {
      // Scene 2.1: Check if it's K7 (return to homepage)
      if (gridId === 'K7') {
        await performSceneTransitionSequence([
          () => changeScene(1, 1),
          () => rehydrateGridFromScene(1, 1),
          () => restartMatrixIfActive(1, 1)
        ], 'Local Fallback: Scene 2.1 → 1.1 (Home)');
      }
    }
  };
  
  // Handle the next action after zoom (or immediately if no zoom)
  const handleNextAction = async (data) => {
    console.log('🎭 handleNextAction called with data:', data);
    
    // Build action sequence based on backend response
    const actions = [];
    
    // Scene transition
    if (data.sceneId || data.subsceneId) {
      const sceneId = data.sceneId || currentSceneRef.current.scene;
      const subsceneId = data.subsceneId || currentSceneRef.current.subscene;
      actions.push(() => changeScene(sceneId, subsceneId));
      actions.push(() => rehydrateGridFromScene(sceneId, subsceneId));
    }
    
    // Matrix actions
    if (data.matrixAction === 'fastForward') {
      actions.push(() => fastForwardMatrix());
    } else if (data.matrixAction === 'restart') {
      actions.push(() => restartMatrixIfActive(data.sceneId, data.subsceneId));
    }
    
    // Special handling for Scene 1.1 transitions
    if (data.sceneId === 1 && data.subsceneId === 1) {
      actions.push(() => restartMatrixIfActive(1, 1));
    }
    
    // Execute the sequence
    if (actions.length > 0) {
      await performSceneTransitionSequence(actions, 'Backend Next Action');
    }
    
    // Handle additional backend data
    if (data.navigateTo) {
      console.log('Backend requested navigation to:', data.navigateTo);
    }
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
  
  // ============================================================================
  // MODULAR SCENE TRANSITION SYSTEM
  // ============================================================================
  // 
  // ARCHITECTURAL PRINCIPLES:
  // 1. Matrix animation is grid-agnostic - works on any grid layout (A1-K7, 1x1, etc.)
  // 2. Auto-advance is part of Matrix animation, not grid interaction
  // 3. Grid system supports layer fallback - if no handlers in top layer, use layer below
  // 4. Top layer (grid) can communicate with background layer (Matrix animation)
  // 5. A1 click has specific handler that communicates with background layer
  // 6. communicateWithBackgroundLayer() function enables layer-to-layer communication
  
  /**
   * Execute a sequence of scene transition actions in order
   * @param {Array<Function>} actions - Array of async functions to execute
   * @param {string} sequenceName - Name for debugging/logging
   */
  const performSceneTransitionSequence = async (actions, sequenceName = 'Scene Transition') => {
    console.log(`🎬 Starting ${sequenceName} sequence with ${actions.length} actions`);
    
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const actionName = action.name || `Action ${i + 1}`;
      
      try {
        console.log(`🎬 [${sequenceName}] Executing ${actionName} (${i + 1}/${actions.length})`);
        await action();
        console.log(`✅ [${sequenceName}] ${actionName} completed successfully`);
      } catch (error) {
        console.error(`❌ [${sequenceName}] ${actionName} failed:`, error);
        // Continue with next action (or could implement retry logic here)
      }
    }
    
    console.log(`🎬 ${sequenceName} sequence completed`);
  };

  // ============================================================================
  // STANDALONE SCENE ACTIONS
  // ============================================================================
  
  /**
   * Change scene state (frontend only)
   */
  const changeScene = async (sceneId, subsceneId) => {
    console.log(`🎭 Changing scene to ${sceneId}.${subsceneId}`);
    setCurrentScene(sceneId);
    setCurrentSubscene(subsceneId);
    currentSceneRef.current.scene = sceneId;
    currentSceneRef.current.subscene = subsceneId;
    
    // Fetch new scenario data for the new scene
    await fetchScenarioData(sceneId, subsceneId);
  };

  /**
   * Rehydrate grid configuration for a specific scene
   */
  const rehydrateGridFromScene = async (sceneId, subsceneId) => {
    console.log(`🔄 Rehydrating grid for Scene ${sceneId}.${subsceneId}`);
    // Use scenario data instead of separate grid config fetch
    await fetchScenarioData(sceneId, subsceneId);
  };

  /**
   * Restart Matrix animation if transitioning to Scene 1.1
   */
  const restartMatrixIfActive = async (sceneId, subsceneId) => {
    if (sceneId === 1 && subsceneId === 1) {
      console.log('🎬 Restarting Matrix animation for Scene 1.1');
      if (matrixRef.current) {
        matrixRef.current.restartAnimation();
        setMatrixState('running');
      }
    } else {
      console.log(`🎬 No Matrix restart needed for Scene ${sceneId}.${subsceneId}`);
    }
  };

  /**
   * Fast-forward Matrix animation to end
   */
  const fastForwardMatrix = async () => {
    console.log('🎬 Fast-forwarding Matrix animation');
    if (matrixRef.current) {
      matrixRef.current.fastForwardToEnd();
      setMatrixState('static');
    }
  };

  /**
   * Stop Matrix spiral animation (frontend-only)
   */
  const stopMatrixSpiral = async () => {
    console.log('🎬 Stopping Matrix spiral animation');
    if (matrixRef.current && matrixRef.current.stopSpiral) {
      matrixRef.current.stopSpiral();
    }
  };

  /**
   * Clear auto-advance timer
   */
  const clearAutoAdvanceTimer = async () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
      console.log('⏰ Auto-advance timer cleared');
    }
  };

  /**
   * Set up auto-advance timer for Scene 1.1
   */
  const setupAutoAdvanceTimer = async () => {
    if (currentScene === 1 && currentSubscene === 1) {
      console.log('⏰ Setting up auto-advance timer for Scene 1.1');
      const timer = setTimeout(() => {
        console.log('⏰ Auto-advance triggered for Scene 1.1');
        handleAutoAdvance();
      }, 8000); // 8 seconds
      setAutoAdvanceTimer(timer);
    }
  };

  // ============================================================================
  // SCENE TRANSITION SEQUENCES
  // ============================================================================
  
  /**
   * Standard zoom transition sequence
   */
  const performZoomTransition = async (gridId, targetScene, targetSubscene, zoomOptions = {}) => {
    await performSceneTransitionSequence([
      () => zoomToTile(gridId, zoomOptions),
      () => changeScene(targetScene, targetSubscene),
      () => rehydrateGridFromScene(targetScene, targetSubscene),
      () => restartMatrixIfActive(targetScene, targetSubscene)
    ], `Zoom to ${gridId} → Scene ${targetScene}.${targetSubscene}`);
  };

  /**
   * A1 click - communicate with background layer (Matrix animation)
   * This function allows the top layer (grid) to talk to the background layer (Matrix)
   */
  const performA1BackgroundCommunication = async () => {
    await performSceneTransitionSequence([
      () => clearAutoAdvanceTimer(),
      () => communicateWithBackgroundLayer('fastForward')
    ], 'A1 Background Layer Communication');
  };

  /**
   * Communicate with background layer (Matrix animation)
   * @param {string} command - Command to send to background layer
   */
  const communicateWithBackgroundLayer = async (command) => {
    console.log(`🎬 Communicating with background layer: ${command}`);
    
    switch (command) {
      case 'fastForward':
        if (matrixRef.current) {
          matrixRef.current.fastForwardToEnd();
          setMatrixState('static');
        }
        break;
      case 'restart':
        if (matrixRef.current) {
          matrixRef.current.restartAnimation();
          setMatrixState('running');
        }
        break;
      case 'stop':
        if (matrixRef.current && matrixRef.current.stopSpiral) {
          matrixRef.current.stopSpiral();
        }
        break;
      default:
        console.warn(`🎬 Unknown background layer command: ${command}`);
    }
  };

  /**
   * Auto-advance from Scene 1.1 to Scene 1.2
   */
  const performAutoAdvance = async () => {
    await performSceneTransitionSequence([
      () => changeScene(1, 2),
      () => rehydrateGridFromScene(1, 2),
      () => fastForwardMatrix()
    ], 'Auto-advance to Scene 1.2');
  };

  // TILE HANDLER SYSTEM: Dynamic dispatch based on handler types
  const handleTileByType = async (tile, gridId, cursorPos = null) => {
    console.log(`🎯 Executing tile handler for ${gridId}:`, tile.handler);
    
    switch (tile.handler) {
      case "frontend":
        return await executeFrontendActions(tile.actions.frontend, tile.effects, gridId, cursorPos);
        
      case "backend":
        return await executeBackendActions(tile.actions.backend, tile.effects, gridId);
        
      case "both":
        return await executeCombinedActions(tile.actions, tile.effects, gridId, cursorPos);
        
      case "none":
        console.log(`🚫 Tile ${gridId} has no handler - ignoring click`);
        return;
        
      default:
        console.warn(`⚠️ Unknown tile handler type: ${tile.handler} for ${gridId}`);
        return;
    }
  };

  // Execute frontend-only actions (animations, UI changes, background communication)
  const executeFrontendActions = async (actions, effects, gridId, cursorPos = null) => {
    console.log(`🎬 Executing frontend actions for ${gridId}:`, actions);
    
    if (!actions || actions.length === 0) {
      console.log(`🚫 No frontend actions defined for ${gridId}`);
      return;
    }
    
    for (const action of actions) {
      switch (action) {
        case "background_communication":
          await communicateWithBackgroundLayer("fast_forward");
          break;
          
        case "matrix_animation_trigger":
          await communicateWithBackgroundLayer("restart");
          break;
          
        case "zoom_animation":
          // Cursor-based zoom animation
          if (cursorPos) {
            console.log(`🎯 Performing cursor-based zoom for ${gridId} at (${cursorPos.x.toFixed(3)}, ${cursorPos.y.toFixed(3)})`);
            await performCursorZoom(cursorPos, {
              duration: 1200,
              precisionThreshold: 0.2,
              minZoom: 1.5,
              maxZoom: 3.5
            });
          } else {
            console.log(`🎬 Zoom animation triggered for ${gridId} (no cursor position)`);
          }
          break;
          
        case "cursor_zoom":
          // Direct cursor zoom
          if (cursorPos) {
            console.log(`🎯 Direct cursor zoom for ${gridId}`);
            await performCursorZoom(cursorPos);
          }
          break;
          
        default:
          console.warn(`⚠️ Unknown frontend action: ${action}`);
      }
    }
    
    // Apply effects if any
    if (effects && Object.keys(effects).length > 0) {
      console.log(`🎬 Applying frontend effects for ${gridId}:`, effects);
    }
  };

  // Execute backend-only actions (API calls, data updates)
  const executeBackendActions = async (actions, effects, gridId) => {
    console.log(`🔧 Executing backend actions for ${gridId}:`, actions);
    
    if (!actions || actions.length === 0) {
      console.log(`🚫 No backend actions defined for ${gridId}`);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/grid/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gridId: gridId,
          currentScene: currentSceneRef.current.scene,
          currentSubscene: currentSceneRef.current.subscene,
          action: 'tile_handler',
          actions: actions,
          effects: effects,
          sessionId: sessionIdRef.current
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend tile handler response:', data);
        handleNextAction(data);
      } else {
        console.error('❌ Backend tile handler failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Error executing backend tile actions:', error);
    }
  };

  // Execute combined actions (frontend + backend)
  const executeCombinedActions = async (actions, effects, gridId, cursorPos = null) => {
    console.log(`🔄 Executing combined actions for ${gridId}:`, actions);
    
    // Execute frontend actions first
    if (actions.frontend && actions.frontend.length > 0) {
      await executeFrontendActions(actions.frontend, effects, gridId, cursorPos);
    }
    
    // Then execute backend actions
    if (actions.backend && actions.backend.length > 0) {
      await executeBackendActions(actions.backend, effects, gridId);
    }
  };
  
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

      {/* LAYERED ARCHITECTURE: Step 3 - Front Layers (Grid Interaction) */}
      {/* Only renders after Scenario → Grid layers are ready */}
      {isGridReady && (
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
      )}
      
      {/* Loading indicator when layers are not ready */}
      {!isGridReady && (
        <div className="layers-loading" style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 2,
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {isLoadingScenario ? 'Loading scenario data...' : 'Preparing grid configuration...'}
        </div>
      )}

      {/* Zoom Test Component (for development) */}
      <ZoomTestComponent />
      
      {/* SoulKey Insights Component */}
      <SoulKeyInsights sessionId={sessionIdRef.current} />
    </div>
  );
};

export default LayeredInterface; 