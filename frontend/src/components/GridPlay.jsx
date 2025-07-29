import React, { useRef, useEffect, useState } from 'react';

// GridPlay Component - Reusable 4-layer structure
const GridPlay = ({ 
  // Background layer configuration
  backgroundComponent = null,
  
  // Grid configuration
  gridCols = 11,
  gridRows = 7,
  
  // Grid click actions - array of functions for each grid cell
  gridActions = [],
  
  // UI elements for Layer 3
  uiElements = null,
  
  // Grid background elements for Layer 2
  gridBackgrounds = null,
  
  // Overlay elements that span multiple grids
  overlayElements = [],
  
  // Interactive UI elements that should be above click handlers
  interactiveElements = [],
  
  // Additional props
  className = '',
  style = {}
}) => {
  const [introComplete, setIntroComplete] = useState(false);
  const canvasRef = useRef(null);

  // Calculate grid cell dimensions
  const getGridCellStyle = (col, row, spanCols = 1, spanRows = 1) => ({
    gridColumn: `${col} / span ${spanCols}`,
    gridRow: `${row} / span ${spanRows}`,
    position: 'relative',
    zIndex: 10
  });

  // Layer 2: Grid Background Layer (Individual Grid Cell Backgrounds)
  const GridBackgroundLayer = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2
    }}>
      {gridBackgrounds}
    </div>
  );

  // Layer 3: Stickers/UI Layer (Text, Buttons, Design Elements)
  const StickersLayer = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'grid',
      gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
      gridTemplateRows: `repeat(${gridRows}, 1fr)`,
      gap: 0,
      zIndex: 3,
      pointerEvents: 'auto' // Allow UI elements to be interactive
    }}>
      {uiElements}
      
      {/* Overlay Elements that span multiple grids */}
      {overlayElements.map((overlay, index) => (
        <div
          key={`overlay-${index}`}
          style={{
            ...getGridCellStyle(
              overlay.startCol, 
              overlay.startRow, 
              overlay.spanCols || 1, 
              overlay.spanRows || 1
            ),
            pointerEvents: overlay.clickable ? 'auto' : 'none',
            cursor: overlay.clickable ? 'pointer' : 'default',
            ...overlay.style
          }}
          onClick={overlay.onClick}
        >
          {overlay.content}
        </div>
      ))}
    </div>
  );

  // Layer 4: Interactive UI Elements Layer (above click handlers)
  const InteractiveElementsLayer = () => (
    interactiveElements && interactiveElements.length > 0 ? (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 6,
        pointerEvents: 'auto'
      }}>
        {interactiveElements}
      </div>
    ) : null
  );

  // Layer 5: Invisible Click Handlers Layer
  const ClickHandlersLayer = () => {
    const handleGridClick = (event) => {
      // Check if intro animation is complete (if background has intro)
      if (backgroundComponent && !introComplete) {
        // Fast-forward animation to end if available
        if (canvasRef.current && canvasRef.current.fastForwardToEnd) {
          canvasRef.current.fastForwardToEnd();
        }
        return; // Skip grid processing during intro
      }
      
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const cellWidth = rect.width / gridCols;
      const cellHeight = rect.height / gridRows;
      
      const col = Math.floor(x / cellWidth) + 1;
      const row = Math.floor(y / cellHeight) + 1;
      
      // Calculate grid index (1-based)
      const gridIndex = (row - 1) * gridCols + (col - 1);
      
      // Execute grid action if defined
      if (gridActions[gridIndex] && typeof gridActions[gridIndex] === 'function') {
        gridActions[gridIndex](col, row, gridIndex);
      }
      
      // Default zoom behavior if no specific action and background supports it
      if (!gridActions[gridIndex] && canvasRef.current && canvasRef.current.handleGridZoom) {
        canvasRef.current.handleGridZoom(col, row);
        // After zoom animation, return to homepage
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    };

    return (
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: 'pointer',
          zIndex: 5
        }}
        onClick={handleGridClick}
        title="Click anywhere on the grid"
      />
    );
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        ...style
      }}
      className={className}
    >
      {/* Layer 1: Background */}
      {backgroundComponent ? (
        React.cloneElement(backgroundComponent, {
          ref: canvasRef,
          onIntroComplete: () => setIntroComplete(true)
        })
      ) : (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
          zIndex: 1
        }} />
      )}
      
      {/* Layer 2: Grid Backgrounds */}
      <GridBackgroundLayer />
      
      {/* Layer 3: Stickers/UI */}
      <StickersLayer />
      
      {/* Layer 4: Interactive Elements */}
      <InteractiveElementsLayer />
      
      {/* Layer 5: Click Handlers */}
      <ClickHandlersLayer />
    </div>
  );
};

export default GridPlay; 