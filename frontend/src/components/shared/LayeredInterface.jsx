import React, { useState, useEffect, useRef } from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from '../scene1/MatrixSpiralCanvas';
import TreeOfWisdomCanvas from '../scene2/TreeOfWisdomCanvas';
import ThoradinChat from './ThoradinChat';
import ThresholdRitual from './ThresholdRitual';
import { getGridId } from '../../utils/gridHelpers';

/**
 * 🏛️ CLEAN LAYERED ARCHITECTURE
 * 
 * LAYER 0: Scenario Engine (DB Loading)
 * LAYER 1: Background Animation (Matrix)
 * LAYER 2: Grid System (Interactive Tiles)
 * LAYER 3: UI Components (Zoom, Overlays)
 */

const LayeredInterface = () => {
  console.log('🚀 LayeredInterface: Starting clean architecture');
  
  // ============================================================================
  // LAYER 0: SCENARIO ENGINE - Database-driven state management
  // ============================================================================
  
  const [currentScene, setCurrentScene] = useState(1);
  const [currentSubscene, setCurrentSubscene] = useState(1);
  const [scenarioData, setScenarioData] = useState(null);
  const [showThresholdRitual, setShowThresholdRitual] = useState(false);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [isRitualComplete, setIsRitualComplete] = useState(false);
  const [isLoadingScenario, setIsLoadingScenario] = useState(true); // Start loading immediately
  const [sessionId, setSessionId] = useState(null);
  const [animationConfig, setAnimationConfig] = useState(null);
  const [backgroundPath, setBackgroundPath] = useState(null); // Database-driven background path
  
  // ============================================================================
  // LAYER 1: BACKGROUND ANIMATION - Matrix state
  // ============================================================================
  
  const [matrixState, setMatrixState] = useState('running'); // Start running so animation triggers when config loads
  const matrixRef = useRef(null);
  const treeRef = useRef(null);
  
  // ============================================================================
  // LAYER 2: GRID SYSTEM - Interactive tiles
  // ============================================================================
  
  const [isGridReady, setIsGridReady] = useState(false);
  const [gridConfig, setGridConfig] = useState(null);
  const [tileHandlers, setTileHandlers] = useState([]);
  
  // ============================================================================
  // LAYER 3: UI COMPONENTS - Zoom and overlays
  // ============================================================================
  

  const [showChat, setShowChat] = useState(false);
  
  // ============================================================================
  // SCENARIO LOADING SYSTEM
  // ============================================================================
  
  // Auto-load initial scenario on mount
  useEffect(() => {
    const initializeScenario = async () => {
      console.log('🚀 Initializing scenario engine...');
      await loadScenario(currentScene, currentSubscene);
    };
    
    initializeScenario();
  }, []); // Only run once on mount
  
  const loadScenario = async (sceneId, subsceneId) => {
    console.log(`🎭 Loading scenario: ${sceneId}.${subsceneId}`);
    console.log(`🔍 Parameters - sceneId: "${sceneId}", subsceneId: "${subsceneId}"`);
    setIsLoadingScenario(true);
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const apiUrl = `${baseUrl}/api/scenario?sceneId=${sceneId}&subsceneId=${subsceneId}`;
      console.log(`🔗 Base URL: ${baseUrl}`);
      console.log(`🔗 Full API URL: ${apiUrl}`);
      console.log(`🔗 URL encoded: ${encodeURIComponent(apiUrl)}`);
      
      console.log(`📡 Making fetch request to: ${apiUrl}`);
      const response = await fetch(apiUrl);
      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response URL: ${response.url}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`📦 Scenario data:`, data);
      
      if (data.success) {
        // Update scenario data
        setScenarioData(data);
        setGridConfig(data.gridConfig);
        setTileHandlers(data.tiles || []);
        
        // Set animation configuration from database
        const dbAnimationConfig = data.animationConfig || {
          type: 'matrix_spiral',
          speed: 'normal',
          colors: { primary: '#00ff00', secondary: '#00ffcc', background: '#000000' },
          text: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS",
          duration: 8000,
          effects: { glow: true, fade: true, spiral: true },
          interactiveParams: { zoomSpeed: 1.2, cursorSensitivity: 0.8, animationPause: false }
        };
        console.log(`🎬 Setting animation config from database:`, dbAnimationConfig);
        setAnimationConfig(dbAnimationConfig);
        
        // Set matrix state based on animation type
        const shouldRunMatrix = dbAnimationConfig?.type === 'matrix_spiral';
        console.log(`🎬 Setting matrix state to: ${shouldRunMatrix ? 'running' : 'static'} based on animation type: ${dbAnimationConfig?.type}`);
        setMatrixState(shouldRunMatrix ? 'running' : 'static');
        
        // Force a small delay to ensure state updates properly
        setTimeout(() => {
          console.log(`🎬 Matrix state after delay: ${shouldRunMatrix ? 'running' : 'static'}`);
        }, 100);
        
        // Set optional background path for static files
        const dbBackgroundPath = data.backgroundPath;
        if (dbBackgroundPath) {
          console.log(`🎬 Setting background path from database: ${dbBackgroundPath}`);
          setBackgroundPath(dbBackgroundPath);
        } else {
          console.log(`🎨 Using frontend-generated animation (no static background path)`);
          setBackgroundPath(null);
        }
        
        // Mark grid as ready
        setIsGridReady(true);
        
        console.log(`✅ Scenario loaded successfully - Matrix animation started`);
        return data;
      } else {
        throw new Error(data.message || 'Failed to load scenario');
      }
    } catch (error) {
      console.error('❌ Error loading scenario:', error);
      
      // Use fallback config
      const fallbackConfig = {
        rows: 7,
        cols: 11,
        gap: '2px',
        padding: '20px',
        debug: false
      };
      
      setGridConfig(fallbackConfig);
      setTileHandlers([]);
      setIsGridReady(true);
      
      // Set static matrix state for fallback
      console.log(`⚠️ Using fallback config - Matrix state set to static`);
      setMatrixState('static');
      
      return null;
    } finally {
      setIsLoadingScenario(false);
    }
  };
  

  
  // ============================================================================
  // TILE HANDLER SYSTEM - Dynamic dispatch
  // ============================================================================
  
  // Handle animation completion and scenario transition
  const handleAnimationComplete = async () => {
    console.log('🎬 Animation completed - transitioning to next scenario');
    
    try {
      // Determine next scenario based on current scene
      let nextSceneId, nextSubsceneId;
      
      if (currentScene === 1 && currentSubscene === 1) {
        // From Scene 1.1, go to Scene 1.2
        nextSceneId = 1;
        nextSubsceneId = 2;
      } else if (currentScene === 1 && currentSubscene === 2) {
        // From Scene 1.2, go to Scene 2.1 (Tree of Wisdom)
        nextSceneId = 2;
        nextSubsceneId = 1;
      } else {
        // Default fallback - stay on current scenario
        console.log('🎬 No transition defined for current scenario, staying put');
        return;
      }
      
      console.log(`🎭 Transitioning to scenario ${nextSceneId}.${nextSubsceneId}`);
      
      // Load the next scenario
      const nextScenarioData = await loadScenario(nextSceneId, nextSubsceneId);
      
      if (nextScenarioData) {
        console.log(`✅ Successfully loaded scenario ${nextSceneId}.${nextSubsceneId}`);
        
        // Update current scene/subscene
        setCurrentScene(nextSceneId);
        setCurrentSubscene(nextSubsceneId);
        
        // The scenario data will automatically update the UI
        console.log('🎬 Scenario transition complete');
      } else {
        console.log(`⚠️ Failed to load scenario ${nextSceneId}.${nextSubsceneId}, staying on current scenario`);
      }
      
    } catch (error) {
      console.error('❌ Error during scenario transition:', error);
    }
  };
  
  // Generic scenario transition function
  const transitionToScenario = async (sceneId, subsceneId) => {
    console.log(`🎭 Transitioning to scenario ${sceneId}.${subsceneId}`);
    
    try {
      // Load the target scenario
      const scenarioData = await loadScenario(sceneId, subsceneId);
      
      if (scenarioData) {
        console.log(`✅ Successfully loaded scenario ${sceneId}.${subsceneId}`);
        
        // Update current scene/subscene
        setCurrentScene(sceneId);
        setCurrentSubscene(subsceneId);
        
        // The scenario data will automatically update the UI
        console.log('🎬 Scenario transition complete');
      } else {
        console.log(`⚠️ Failed to load scenario ${sceneId}.${subsceneId}, staying on current scenario`);
      }
      
    } catch (error) {
      console.error('❌ Error during scenario transition:', error);
    }
  };

  const handleTileClick = async (row, col, gridIndex, event) => {
    const tileId = `${String.fromCharCode(65 + col)}${row + 1}`; // A1, B2, etc.
    console.log(`🎮 Tile clicked: ${tileId} (row=${row + 1}, col=${col + 1})`);
    console.log(`🎮 Current scene: ${currentScene}.${currentSubscene}`);
    
    // Get cursor position for zoom
    const cursorPos = event ? {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight
    } : null;
    
    // Special handler for A1 in scene 1.1 (1x1 grid)
    if (currentScene === 1 && currentSubscene === 1 && tileId === 'A1') {
      console.log(`🎯 Special A1 handler in scene 1.1 - triggering fast-forward to scene 1.2`);
      
      // Fast-forward matrix animation with proper null checks
      if (matrixRef.current && typeof matrixRef.current.fastForwardToEnd === 'function') {
        try {
          matrixRef.current.fastForwardToEnd();
        } catch (error) {
          console.error('❌ Error calling fastForwardToEnd:', error);
        }
      } else {
        console.log('⚠️ Matrix ref not ready, proceeding with transition');
      }
      
      // Transition to scene 1.2
      await handleAnimationComplete();
      return;
    }
    
    // Special handler for F1 in scene 1.2 (11x7 grid)
    if (currentScene === 1 && currentSubscene === 2 && tileId === 'F1') {
      console.log(`🎯 Special F1 handler in scene 1.2 - triggering zoom and transition to scenario 2.1`);
      console.log(`🎯 F1 click details:`, { currentScene, currentSubscene, tileId, event: !!event });
      
      // Trigger the built-in zoom effect in MatrixSpiralCanvas
      if (matrixRef.current) {
        // Simulate a click on the canvas to trigger the zoom
        const canvasElement = matrixRef.current.canvasRef?.current;
        if (canvasElement) {
          console.log('🎯 Triggering canvas click to start zoom effect');
          // Use the actual cursor position from the tile click event
          const rect = canvasElement.getBoundingClientRect();
          const cursorX = event.clientX;
          const cursorY = event.clientY;
          
          console.log('🎯 Creating synthetic click event at:', { cursorX, cursorY });
          
          const clickEvent = new MouseEvent('click', {
            clientX: cursorX,
            clientY: cursorY,
            bubbles: true,
            cancelable: true
          });
          
          canvasElement.dispatchEvent(clickEvent);
          console.log('🎯 Synthetic click event dispatched');
        } else {
          console.log('⚠️ Canvas element not available, proceeding with direct transition');
          // Fallback: direct transition to scenario 2.1
          await transitionToScenario(2, 1);
        }
      } else {
        console.log('⚠️ Matrix ref not available, proceeding with direct transition');
        // Fallback: direct transition to scenario 2.1
        await transitionToScenario(2, 1);
      }
      return;
    }
    

    

    
    // Find tile handler
    const tileHandler = tileHandlers.find(t => t.id === tileId);
    
    if (tileHandler) {
      console.log(`🎯 Executing tile handler for ${tileId}:`, tileHandler);
      
      switch (tileHandler.handler) {
        case 'frontend':
          await executeFrontendActions(tileHandler.actions.frontend, tileId, cursorPos);
          break;
          
        case 'backend':
          await executeBackendActions(tileHandler.actions.backend, tileId);
          break;
          
        case 'both':
          await executeFrontendActions(tileHandler.actions.frontend, tileId, cursorPos);
          await executeBackendActions(tileHandler.actions.backend, tileId);
          break;
          
        case 'none':
          console.log(`🚫 Tile ${tileId} has no handler`);
          break;
          
        default:
          console.warn(`⚠️ Unknown handler type: ${tileHandler.handler}`);
      }
    } else {
      console.log(`🎮 No handler found for ${tileId}`);
    }
  };
  
  const executeFrontendActions = async (actions, tileId, cursorPos) => {
    console.log(`🎬 Executing frontend actions for ${tileId}:`, actions);
    
    for (const action of actions || []) {
      switch (action) {
        case 'matrix_trigger':
          if (matrixRef.current && typeof matrixRef.current.fastForwardToEnd === 'function') {
            try {
              matrixRef.current.fastForwardToEnd();
              setMatrixState('static');
            } catch (error) {
              console.error('❌ Error calling fastForwardToEnd:', error);
            }
          } else {
            console.log('⚠️ Matrix ref not ready for matrix_trigger');
            setMatrixState('static');
          }
          break;
          
        default:
          console.warn(`⚠️ Unknown frontend action: ${action}`);
      }
    }
  };
  
  const executeBackendActions = async (actions, tileId) => {
    console.log(`🔧 Executing backend actions for ${tileId}:`, actions);
    
    // TODO: Implement backend action calls
    console.log(`🔧 Backend actions:`, actions);
  };
  
  // ============================================================================
  // THORADIN CHAT FUNCTIONALITY
  // ============================================================================
  
  const handleThoradinMessage = async (message) => {
    console.log(`💬 Sending message to Thoradin: ${message}`);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId,
          sceneId: currentScene,
          subsceneId: currentSubscene
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`🤖 AI Response:`, data);
      
      if (data.success && data.response) {
        return data.response;
      } else {
        throw new Error(data.message || 'Failed to get response from Thoradin');
      }
    } catch (error) {
      console.error('❌ Error communicating with Thoradin:', error);
      throw error;
    }
  };
  
  // ============================================================================
  // COMPONENT LIFECYCLE
  // ============================================================================
  
  useEffect(() => {
    // Generate session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    console.log(`🎭 Session started: ${newSessionId}`);
    
    // Note: Scenario loading is handled by the first useEffect above
  }, []);
  
  // ============================================================================
  // RENDER LAYERS
  // ============================================================================
  
  return (
    <div className="layered-interface" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      
      {/* LAYER 1: BACKGROUND ANIMATION */}
      <div className="background-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        {(() => {
          console.log(`🎬 Canvas selection: scenarioData?.backgroundType = "${scenarioData?.backgroundType}", animationConfig?.type = "${animationConfig?.type}"`);
          console.log(`🎬 Background layer debug:`, {
            currentScene,
            currentSubscene,
            backgroundPath,
            animationConfigType: animationConfig?.type,
            hasBackgroundPath: !!backgroundPath
          });
          
          // For scenario 2.1, show background image instead of canvas
          if (currentScene === 2 && currentSubscene === 1 && backgroundPath) {
            console.log('🎬 Rendering scenario 2.1 background image:', backgroundPath);
            return (
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${backgroundPath})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 1
                }}
                data-testid="scenario-2-1-background"
              />
            );
          }
          
          // For static background type, show background image
          if (animationConfig?.type === 'static_background' && backgroundPath) {
            console.log('🎬 Rendering static background image:', backgroundPath);
            return (
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${backgroundPath})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 1
                }}
                data-testid="static-background"
              />
            );
          }
          
          // Choose canvas based on animation type
          if (animationConfig?.type === 'tree_of_wisdom') {
            return (
              <TreeOfWisdomCanvas 
                ref={treeRef}
                onAnimationComplete={handleAnimationComplete}
                backgroundPath={backgroundPath}
                animationConfig={animationConfig}
              />
            );
          } else {
            // Default to MatrixSpiralCanvas for all other animation types
            return (
              <MatrixSpiralCanvas 
                ref={matrixRef}
                matrixState={matrixState}
                animationConfig={animationConfig}
                backgroundPath={backgroundPath}
                onAnimationComplete={handleAnimationComplete}
                transitionToScenario={transitionToScenario}
              />
            );
          }
        })()}
      </div>

      {/* LAYER 2: GRID SYSTEM - Always invisible for backend communication */}
      {isGridReady && gridConfig && (
        <div className="grid-layer" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 2,
          pointerEvents: (currentScene === 1 && currentSubscene === 2) ? 'none' : 'auto'
        }}>
          <GridPlay
            gridConfig={gridConfig}
            sceneName={`Scene ${currentScene}.${currentSubscene}`}
            onTileClick={handleTileClick}
            showInvisibleButtons={true}
            currentScene={currentScene}
            currentSubscene={currentSubscene}

            isProcessingClick={false}
          />
        </div>
      )}
      
      {/* LAYER 3: UI COMPONENTS - Loading indicator */}
      {!isGridReady && (
        <div className="layers-loading" style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 3,
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {isLoadingScenario ? 'Loading scenario data...' : 'Preparing grid configuration...'}
        </div>
      )}
      

      
      {/* LAYER 3: UI COMPONENTS - Thoradin Chat */}
      {currentScene === 2 && currentSubscene === 1 && (
        <ThoradinChat 
          onSendMessage={handleThoradinMessage}
          isVisible={true}
        />
      )}
      
    </div>
  );
};

export default LayeredInterface; 