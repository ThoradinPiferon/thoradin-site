import React, { useState } from 'react';
import SceneViewer from './SceneViewer';

const GridPlay = ({ 
  backgroundComponent = null,
  gridCols = 7,
  gridRows = 11,
  gridActions = [],
  uiElements = [],
  showSceneViewer = false,
  showInvisibleButtons = false,
  currentScene = 1
}) => {
  console.log('GridPlay rendering with props:', { 
    backgroundComponent: !!backgroundComponent, 
    gridCols, 
    gridRows, 
    gridActionsLength: gridActions.length,
    uiElementsLength: uiElements.length,
    showSceneViewer,
    showInvisibleButtons,
    currentScene
  });

  const [selectedScene, setSelectedScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTileClick = async (row, col) => {
    const gridIndex = (row - 1) * gridCols + (col - 1);
    
    // Check if there's a custom action for this tile
    if (gridActions[gridIndex] && typeof gridActions[gridIndex] === 'function') {
      gridActions[gridIndex](col, row, gridIndex);
      return;
    }

    // Default scene functionality (only if showSceneViewer is true)
    if (showSceneViewer) {
      const gridId = `G${row}.${col}`;
      
      setIsLoading(true);
      setError(null);
      setSelectedScene(null);

      try {
        const response = await fetch(`/api/scene/${gridId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Failed to fetch scene for ${gridId}`);
        }

        setSelectedScene(data.data);
      } catch (err) {
        console.error('Error fetching scene:', err);
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
    const gridId = `G${row}.${col}`;
    const gridIndex = (row - 1) * gridCols + (col - 1);
    const hasAction = gridActions[gridIndex] && typeof gridActions[gridIndex] === 'function';
    
    // Determine button styling based on scene and visibility
    let buttonStyle = '';
    let buttonText = gridId;
    
    if (showInvisibleButtons) {
      // Completely invisible buttons for Matrix animation
      buttonStyle = `
        w-full h-full 
        bg-transparent border-transparent
        hover:bg-transparent hover:border-transparent
        text-transparent hover:text-transparent
        transition-none
        flex items-center justify-center
        text-xs font-mono
        focus:outline-none focus:ring-0
        active:scale-100
        cursor-pointer
        opacity-0
        pointer-events-auto
      `;
      buttonText = ''; // No text visible
    } else {
      // Normal visible buttons
      buttonStyle = `
        w-full h-full 
        ${hasAction 
          ? 'bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 border-green-400 hover:border-green-500 text-green-700 hover:text-green-800' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-700'
        }
        border transition-all duration-200 ease-in-out
        flex items-center justify-center
        text-xs font-mono
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        active:scale-95
        ${hasAction ? 'focus:ring-green-500' : 'focus:ring-blue-500'}
      `;
    }
    
    return (
      <button
        key={`${row}-${col}`}
        onClick={() => handleTileClick(row, col)}
        className={buttonStyle}
        title={hasAction ? `Click to interact with ${gridId}` : `Click to view scene ${gridId}`}
        style={showInvisibleButtons ? { 
          backgroundColor: 'transparent',
          border: 'none',
          color: 'transparent',
          outline: 'none',
          boxShadow: 'none'
        } : {}}
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
        padding: '20px'
      }}>
        {Array.from({ length: gridRows }, (_, row) =>
          Array.from({ length: gridCols }, (_, col) =>
            renderTile(row + 1, col + 1)
          )
        ).flat()}
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