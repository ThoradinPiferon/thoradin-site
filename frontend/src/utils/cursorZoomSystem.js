// Cursor-Based Zoom System
// Completely independent of grid - works purely on cursor position and precision

let matrixCanvasRef = null;
let currentZoomState = {
  isZooming: false,
  zoomTarget: null,
  zoomLevel: 1,
  zoomCenter: { x: 0, y: 0 }
};

// Set the MatrixSpiralCanvas reference
export const setMatrixCanvasRef = (ref) => {
  matrixCanvasRef = ref;
  console.log('🎯 Cursor zoom system: Matrix Canvas reference set');
};

// Calculate cursor position relative to viewport
export const getCursorPosition = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Normalize to 0-1 range
  const normalizedX = x / rect.width;
  const normalizedY = y / rect.height;
  
  return {
    x: normalizedX,
    y: normalizedY,
    rawX: x,
    rawY: y,
    viewportWidth: rect.width,
    viewportHeight: rect.height
  };
};

// Calculate zoom precision based on cursor position
export const calculateZoomPrecision = (cursorPos) => {
  const { x, y } = cursorPos;
  
  // Distance from center (0.5, 0.5)
  const centerDistance = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2));
  
  // Precision increases as you get closer to center
  // 0 = edge, 1 = center
  const precision = Math.max(0, 1 - (centerDistance * 2));
  
  // Calculate zoom level based on precision
  const zoomLevel = 1 + (precision * 3); // 1x to 4x zoom
  
  return {
    precision,
    zoomLevel,
    centerDistance
  };
};

// Main cursor-based zoom function
export const performCursorZoom = async (cursorPos, options = {}) => {
  const {
    duration = 1200,
    easing = 'ease-in-out',
    minZoom = 1,
    maxZoom = 4,
    precisionThreshold = 0.3
  } = options;
  
  if (!matrixCanvasRef) {
    console.error('❌ Matrix Canvas reference not set for cursor zoom');
    return Promise.resolve();
  }
  
  const { precision, zoomLevel } = calculateZoomPrecision(cursorPos);
  
  console.log(`🎯 Cursor zoom triggered:`, {
    position: { x: cursorPos.x.toFixed(3), y: cursorPos.y.toFixed(3) },
    precision: precision.toFixed(3),
    zoomLevel: zoomLevel.toFixed(2)
  });
  
  // Only zoom if precision is above threshold
  if (precision < precisionThreshold) {
    console.log(`🚫 Zoom precision too low: ${precision.toFixed(3)} < ${precisionThreshold}`);
    return Promise.resolve();
  }
  
  // Clamp zoom level
  const finalZoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel));
  
  // Set zoom state
  currentZoomState.isZooming = true;
  currentZoomState.zoomTarget = cursorPos;
  currentZoomState.zoomLevel = finalZoomLevel;
  currentZoomState.zoomCenter = { x: cursorPos.x, y: cursorPos.y };
  
  try {
    // Call the MatrixSpiralCanvas zoom function with cursor-based parameters
    await matrixCanvasRef.performCursorZoom({
      centerX: cursorPos.x,
      centerY: cursorPos.y,
      zoomLevel: finalZoomLevel,
      duration,
      easing,
      precision
    });
    
    console.log(`✅ Cursor zoom completed: ${finalZoomLevel.toFixed(2)}x at (${cursorPos.x.toFixed(3)}, ${cursorPos.y.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Cursor zoom error:', error);
  } finally {
    // Reset zoom state
    currentZoomState.isZooming = false;
    currentZoomState.zoomTarget = null;
  }
};

// Multi-cursor zoom (for complex interactions)
export const performMultiCursorZoom = async (cursorPositions, options = {}) => {
  const {
    delayBetween = 300,
    sequenceType = 'sequential' // 'sequential', 'parallel', 'cascade'
  } = options;
  
  console.log(`🎯 Multi-cursor zoom: ${cursorPositions.length} positions`);
  
  if (sequenceType === 'parallel') {
    // Zoom to all positions simultaneously
    const promises = cursorPositions.map(pos => performCursorZoom(pos, options));
    await Promise.all(promises);
  } else if (sequenceType === 'cascade') {
    // Zoom with decreasing precision threshold
    for (let i = 0; i < cursorPositions.length; i++) {
      const pos = cursorPositions[i];
      const cascadeOptions = {
        ...options,
        precisionThreshold: 0.3 - (i * 0.05) // Decreasing threshold
      };
      await performCursorZoom(pos, cascadeOptions);
      if (i < cursorPositions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetween));
      }
    }
  } else {
    // Sequential zoom
    for (let i = 0; i < cursorPositions.length; i++) {
      await performCursorZoom(cursorPositions[i], options);
      if (i < cursorPositions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetween));
      }
    }
  }
  
  console.log('✅ Multi-cursor zoom completed');
};

// Gesture-based zoom (for mouse movements)
export const performGestureZoom = async (startPos, endPos, options = {}) => {
  const {
    gestureType = 'swipe', // 'swipe', 'pinch', 'circle'
    minDistance = 0.1
  } = options;
  
  const distance = Math.sqrt(
    Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
  );
  
  if (distance < minDistance) {
    console.log('🚫 Gesture distance too small for zoom');
    return Promise.resolve();
  }
  
  console.log(`🎯 Gesture zoom: ${gestureType} from (${startPos.x.toFixed(3)}, ${startPos.y.toFixed(3)}) to (${endPos.x.toFixed(3)}, ${endPos.y.toFixed(3)})`);
  
  // Calculate gesture center and intensity
  const centerX = (startPos.x + endPos.x) / 2;
  const centerY = (startPos.y + endPos.y) / 2;
  const intensity = Math.min(1, distance * 2);
  
  const gesturePos = {
    x: centerX,
    y: centerY,
    intensity
  };
  
  await performCursorZoom(gesturePos, {
    ...options,
    zoomLevel: 1 + (intensity * 3)
  });
};

// Get current zoom state
export const getCursorZoomState = () => {
  return { ...currentZoomState };
};

// Check if currently zooming
export const isCursorZooming = () => {
  return currentZoomState.isZooming;
};

// Reset zoom state
export const resetCursorZoom = () => {
  currentZoomState.isZooming = false;
  currentZoomState.zoomTarget = null;
  currentZoomState.zoomLevel = 1;
  currentZoomState.zoomCenter = { x: 0, y: 0 };
  console.log('🎯 Cursor zoom state reset');
};

// Utility functions for different zoom patterns
export const cursorZoomPatterns = {
  // Zoom to cursor with high precision
  precise: (cursorPos) => performCursorZoom(cursorPos, { precisionThreshold: 0.5 }),
  
  // Zoom to cursor with any precision
  any: (cursorPos) => performCursorZoom(cursorPos, { precisionThreshold: 0.1 }),
  
  // Zoom to multiple cursor positions
  multi: (positions) => performMultiCursorZoom(positions),
  
  // Gesture-based zoom
  gesture: (start, end) => performGestureZoom(start, end),
  
  // Swipe zoom
  swipe: (start, end) => performGestureZoom(start, end, { gestureType: 'swipe' }),
  
  // Circle zoom
  circle: (center, radius) => {
    const positions = [];
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      positions.push({ x, y });
    }
    return performMultiCursorZoom(positions, { sequenceType: 'cascade' });
  }
}; 