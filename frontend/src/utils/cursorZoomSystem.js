// Simplified Cursor-Based Zoom System
// Just handles: start zoom → still frame → signal completion

let matrixCanvasRef = null;
let isZooming = false;

// Set the MatrixSpiralCanvas reference
export const setMatrixCanvasRef = (ref) => {
  matrixCanvasRef = ref;
  console.log('🎯 Cursor zoom system: Matrix Canvas reference set');
};

// Get cursor position from click event
export const getCursorPosition = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;  // Normalized 0-1
  const y = (event.clientY - rect.top) / rect.height;   // Normalized 0-1
  
  return { x, y };
};

// Simple cursor-based zoom with optional callback - just start zoom and signal when done
export const performCursorZoom = async (cursorPos, onZoomComplete = null) => {
  if (!matrixCanvasRef || isZooming) {
    console.log('🚫 Zoom blocked - already zooming or no canvas ref');
    return;
  }
  
  console.log(`🎯 Starting cursor zoom at (${cursorPos.x.toFixed(3)}, ${cursorPos.y.toFixed(3)})`);
  
  isZooming = true;
  
  try {
    // Start zoom animation
    await matrixCanvasRef.performCursorZoom({
      centerX: cursorPos.x,
      centerY: cursorPos.y,
      duration: 1200
    });
    
    // Zoom complete - show still frame
    console.log('✅ Cursor zoom completed - showing still frame');
    
    // Execute optional callback if provided
    if (onZoomComplete && typeof onZoomComplete === 'function') {
      console.log('🎬 Executing post-zoom callback');
      await onZoomComplete();
    }
    
  } catch (error) {
    console.error('❌ Cursor zoom error:', error);
  } finally {
    // Always signal completion
    isZooming = false;
    console.log('🎯 Zoom ended - next handler can run');
  }
};

// Check if currently zooming
export const isCursorZooming = () => {
  return isZooming;
};

// Reset zoom state
export const resetCursorZoom = () => {
  isZooming = false;
  console.log('🎯 Cursor zoom state reset');
}; 