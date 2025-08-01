import React, { useState } from 'react';
import SceneViewer from './SceneViewer';
import { getGridId } from '../utils/gridHelpers';

const GridPlay = ({ 
  backgroundComponent = null,
  gridRows = 7,
  gridCols = 11,
  gridActions = [],
  uiElements = [],
  showSceneViewer = false,
  showInvisibleButtons = false,
  currentScene = 1,
  currentSubscene = 1,
  isZooming = false
}) => {
  console.log('GridPlay rendering with props:', { 
    backgroundComponent: !!backgroundComponent, 
    gridRows, 
    gridCols, 
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

  const handleTileClick = async (row, col) => {
    // Disable clicks during zooming
    if (isZooming) {
      console.log('Click disabled during zoom animation');
      return;
    }
    
    const gridIndex = row * gridCols + col;
    
    // Check if there's a custom action for this tile
    if (gridActions[gridIndex] && typeof gridActions[gridIndex] === 'function') {
      console.log(`🎯 Executing custom action for tile ${getGridId(col, row)}`);
      gridActions[gridIndex](row, col, gridIndex);
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
    const gridIndex = row * gridCols + col;
    const hasAction = gridActions[gridIndex] && typeof gridActions[gridIndex] === 'function';
    
    // Debug logging for first few tiles
    if (row <= 1 && col <= 1) {
      console.log(`Rendering tile ${gridId}, showInvisibleButtons: ${showInvisibleButtons}, currentScene: ${currentScene}.${currentSubscene}, isZooming: ${isZooming}`);
    }
    
    // Determine button styling based on scene and visibility
    let buttonStyle = '';
    let buttonText = gridId;
    let inlineStyles = {};
    
    if (showInvisibleButtons) {
      // Completely invisible buttons for Matrix animation - but still clickable!
      buttonStyle = `
        w-full h-full 
        flex items-center justify-center
        text-xs font-mono
        focus:outline-none focus:ring-0
        cursor-pointer
      `;
      buttonText = ''; // No text at all
      inlineStyles = {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'transparent',
        opacity: 0,
        pointerEvents: 'auto',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 5
      };
    } else {
      // Normal visible buttons for other scenes
      buttonStyle = `
        w-full h-full 
        bg-gray-800/20 border border-gray-600/30
        hover:bg-gray-700/30 hover:border-gray-500/50
        text-gray-300 hover:text-white
        transition-all duration-200
        flex items-center justify-center
        text-xs font-mono
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        ${hasAction ? 'cursor-pointer' : 'cursor-default opacity-50'}
        ${isZooming ? 'pointer-events-none opacity-30' : ''}
      `;
      inlineStyles = {};
    }
    
    return (
      <button
        key={gridId}
        className={buttonStyle}
        onClick={() => handleTileClick(row, col)}
        style={inlineStyles}
        disabled={isZooming}
      >
        {buttonText}
      </button>
    );
  };

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
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        gap: '2px',
        padding: '20px',
        pointerEvents: 'auto'
      }}>
        {Array.from({ length: gridRows }, (_, row) =>
          Array.from({ length: gridCols }, (_, col) => {
            const gridId = getGridId(col, row);
            const gridIndex = row * gridCols + col;
            const hasAction = gridActions[gridIndex] && typeof gridActions[gridIndex] === 'function';
            
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