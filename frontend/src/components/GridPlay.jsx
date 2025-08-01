import React, { useState } from 'react';
import SceneViewer from './SceneViewer';
import { getGridId } from '../utils/gridHelpers';
import { 
  getGridConfig, 
  generateTileIds, 
  generateGridActions, 
  getGridStyles, 
  getTileStyles, 
  getTileClasses 
} from '../utils/gridConfig';

const GridPlay = ({ 
  backgroundComponent = null,
  gridConfig = null, // New: Use grid configuration object
  gridActions = [],
  uiElements = [],
  showSceneViewer = false,
  showInvisibleButtons = false,
  currentScene = 1,
  currentSubscene = 1,
  isZooming = false,
  sceneName = 'homepage' // New: Scene name for configuration
}) => {
  // Get grid configuration based on scene name or use provided config
  const config = gridConfig || getGridConfig(sceneName);
  
  console.log('GridPlay rendering with props:', { 
    backgroundComponent: !!backgroundComponent, 
    sceneName,
    config,
    gridActionsLength: gridActions.length,
    uiElementsLength: uiElements.length,
    showSceneViewer,
    showInvisibleButtons,
    currentScene,
    currentSubscene,
    isZooming
  });

  // Debug the invisible button logic
  console.log(`🔍 Invisible button check: showInvisibleButtons=${showInvisibleButtons}, currentScene=${currentScene}, currentSubscene=${currentSubscene}`);
  console.log(`🔍 Should be invisible: ${currentScene === 1 && currentSubscene === 1}`);

  const [selectedScene, setSelectedScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate tile IDs for this configuration
  const tileIds = generateTileIds(config);
  
  // Generate grid actions if not provided
  const finalGridActions = gridActions.length > 0 ? gridActions : generateGridActions(config, handleTileClick);

  const handleTileClick = async (row, col) => {
    // Disable clicks during zooming
    if (isZooming) {
      console.log('Click disabled during zoom animation');
      return;
    }
    
    const gridIndex = row * config.cols + col;
    
    // Check if there's a custom action for this tile
    if (finalGridActions[gridIndex] && typeof finalGridActions[gridIndex] === 'function') {
      console.log(`🎯 Executing custom action for tile ${getGridId(col, row)}`);
      finalGridActions[gridIndex](row, col, gridIndex);
      return;
    }

    // Default scene functionality (if not overridden by custom action)
    if (showSceneViewer) {
      setIsLoading(true);
      setError(null);
      setSelectedScene(null);
      try {
        const gridId = getGridId(col, row);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/scene/${gridId}`);
        if (!response.ok) {
          throw new Error(`Scene ${gridId} not found`);
        }
        const data = await response.json();
        setSelectedScene(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseScene = () => {
    setSelectedScene(null);
    setError(null);
  };

  const renderTile = (row, col) => {
    const gridId = getGridId(col, row);
    const gridIndex = row * config.cols + col;
    const hasAction = finalGridActions[gridIndex] && typeof finalGridActions[gridIndex] === 'function';
    
    // Debug logging for first few tiles
    if (row <= 1 && col <= 1) {
      console.log(`Rendering tile ${gridId}, showInvisibleButtons: ${showInvisibleButtons}, currentScene: ${currentScene}.${currentSubscene}, isZooming: ${isZooming}`);
    }
    
    // Get tile styles and classes based on configuration
    const tileStyles = getTileStyles(config, showInvisibleButtons, isZooming, gridId, hasAction);
    const tileClasses = getTileClasses(config, showInvisibleButtons, isZooming, hasAction);
    
    // Determine button text based on configuration
    let buttonText = showInvisibleButtons ? '' : gridId;
    
    // Disable click handler for Scene 1.1
    const handleClick = (currentScene === 1 && currentSubscene === 1) ? 
      () => { console.log('🚫 Click disabled for Scene 1.1'); } : 
      () => handleTileClick(row, col);
    
    return (
      <button
        key={gridId}
        className={tileClasses}
        onClick={handleClick}
        style={tileStyles}
        disabled={isZooming || (currentScene === 1 && currentSubscene === 1)}
      >
        {buttonText}
      </button>
    );
  };

  // Get grid container styles
  const gridStyles = getGridStyles(config);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Background Component */}
      {backgroundComponent && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          {backgroundComponent}
        </div>
      )}

      {/* Grid Container */}
      <div style={gridStyles}>
        {Array.from({ length: config.rows }, (_, row) =>
          Array.from({ length: config.cols }, (_, col) => {
            const gridId = getGridId(col, row);
            const gridIndex = row * config.cols + col;
            const hasAction = finalGridActions[gridIndex] && typeof finalGridActions[gridIndex] === 'function';
            
            // Debug logging for first few tiles
            if (row <= 1 && col <= 1) {
              console.log(`Grid tile ${gridId}: showInvisibleButtons=${showInvisibleButtons}, currentScene=${currentScene}.${currentSubscene}`);
            }
            
            // Always render clickable buttons, just make them invisible when needed
            console.log(`🎭 Rendering ${showInvisibleButtons ? 'invisible' : 'visible'} button for ${gridId}`);
            return renderTile(row, col);
          })
        )}
      </div>

      {/* UI Elements Layer */}
      {uiElements.length > 0 && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 20,
          pointerEvents: 'none'
        }}>
          {uiElements.map((element, index) => (
            <div key={index} style={{ pointerEvents: 'auto' }}>
              {element}
            </div>
          ))}
        </div>
      )}

      {/* Scene Viewer Modal - only if showSceneViewer is true */}
      {showSceneViewer && (selectedScene || isLoading || error) && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          maxWidth: '90vw',
          width: '600px'
        }}>
          <SceneViewer
            scene={selectedScene}
            isLoading={isLoading}
            error={error}
            onClose={handleCloseScene}
          />
        </div>
      )}
    </div>
  );
};

export default GridPlay; 