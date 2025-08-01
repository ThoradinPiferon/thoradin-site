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
  gridConfig, 
  sceneName, 
  onTileClick, 
  showInvisibleButtons, 
  currentScene, 
  currentSubscene,
  gridActions = [],
  showSceneViewer = false,
  isZooming = false
}) => {
  console.log(`🎮 GridPlay rendering: ${sceneName}, showInvisibleButtons: ${showInvisibleButtons}, config:`, gridConfig);
  
  const { rows, cols, gap, padding, debug } = gridConfig;
  
  // Generate grid tiles
  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      tiles.push({ row, col });
    }
  }

  // Get grid configuration based on scene name or use provided config
  const config = gridConfig || getGridConfig(sceneName);
  
  console.log('GridPlay rendering with props:', { 
    sceneName,
    config,
    showInvisibleButtons,
    currentScene,
    currentSubscene
  });

  // Debug the invisible button logic
  console.log(`🔍 Invisible button check: showInvisibleButtons=${showInvisibleButtons}, currentScene=${currentScene}, currentSubscene=${currentSubscene}`);
  console.log(`🔍 Should be invisible: ${currentScene === 1 && currentSubscene === 1}`);

  const [selectedScene, setSelectedScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate tile IDs for this configuration
  const tileIds = generateTileIds(config);
  
  const handleTileClick = async (row, col) => {
    // Disable clicks during zooming
    if (isZooming) {
      console.log('🚫 Click disabled during zoom animation - grid is hidden');
      return;
    }
    
    const gridIndex = row * config.cols + col;
    const gridId = getGridId(col, row);
    
    console.log(`🎮 Tile clicked: ${gridId} in ${sceneName}, isZooming: ${isZooming}`);
    
    // Check if there's a custom action for this tile
    if (gridActions[gridIndex] && typeof gridActions[gridIndex] === 'function') {
      console.log(`🎯 Executing custom action for tile ${gridId}`);
      gridActions[gridIndex](row, col, gridIndex);
      return;
    }

    // Default scene functionality (if not overridden by custom action)
    if (showSceneViewer) {
      setIsLoading(true);
      setError(null);
      setSelectedScene(null);
      try {
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
  
  // Generate grid actions if not provided
  const finalGridActions = gridActions.length > 0 ? gridActions : generateGridActions(config, handleTileClick);

  const handleCloseScene = () => {
    setSelectedScene(null);
    setError(null);
  };

  const renderTile = (row, col) => {
    const gridId = getGridId(col, row);
    const gridIndex = row * config.cols + col;
    
    // Debug logging for scene state
    console.log(`🎯 Rendering tile ${gridId} in ${sceneName}, showInvisibleButtons: ${showInvisibleButtons}, scene: ${currentScene}.${currentSubscene}, isZooming: ${isZooming}`);
    
    // Get tile styles and classes based on configuration
    const tileStyles = getTileStyles(config, showInvisibleButtons, isZooming, gridId, true);
    const tileClasses = getTileClasses(config, showInvisibleButtons, isZooming, true);
    
    // Determine button text based on configuration
    let buttonText = showInvisibleButtons ? '' : gridId;
    
    // Disable clicks for Scene 1.1 (Matrix Awakening) or during zoom
    const isScene11 = currentScene === 1 && currentSubscene === 1;
    const isDisabled = isScene11 || isZooming;
    
    // Add zoom state logging
    if (isZooming) {
      console.log(`🚫 Tile ${gridId} disabled during zoom animation`);
    }
    
    const handleClick = isDisabled ? 
      () => { 
        if (isScene11) {
          console.log('🚫 Click disabled for Scene 1.1'); 
        } else if (isZooming) {
          console.log('🚫 Click disabled during zoom animation'); 
        }
      } : 
      () => onTileClick(row, col, gridIndex);
    
    return (
      <button
        key={gridId}
        className={tileClasses}
        onClick={handleClick}
        style={{
          ...tileStyles,
          // Add visual feedback during zoom - completely hide grid
          ...(isZooming && {
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            cursor: 'not-allowed',
            transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out'
          })
        }}
        disabled={isDisabled}
      >
        {buttonText}
        {config.debug && (
          <span style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 10,
            fontSize: '8px',
            color: 'red'
          }}>
            {gridId}
          </span>
        )}
      </button>
    );
  };

  // Get grid container styles
  const gridStyles = getGridStyles(config);

  return (
    <div 
      className="grid-container" 
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: gap || '2px',
        padding: padding || '10px',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 5,
        // Completely hide grid during zoom
        ...(isZooming && {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out'
        })
      }}
    >
      {tiles.map(({ row, col }) => renderTile(row, col))}
    </div>
  );
};

export default GridPlay; 