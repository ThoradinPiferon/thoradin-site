// Global Zoom Utility Functions
// This allows zoom functionality to be called from anywhere in the application

let matrixCanvasRef = null;
let currentZoomState = {
  isZooming: false,
  currentTarget: null,
  zoomQueue: []
};

// Set the MatrixSpiralCanvas reference (called from MatrixSpiralCanvas component)
export const setMatrixCanvasRef = (ref) => {
  matrixCanvasRef = ref;
  console.log('🎬 Matrix Canvas reference set for global zoom');
};

// Parse grid ID to coordinates (e.g., "K1" -> { col: 10, row: 0 })
export const parseGridId = (gridId) => {
  if (!gridId || typeof gridId !== 'string') {
    console.error('❌ Invalid gridId:', gridId);
    return { colIndex: 0, rowIndex: 0 };
  }
  
  const col = gridId.charAt(0).toUpperCase();
  const row = parseInt(gridId.slice(1)) - 1; // Convert to 0-based index
  
  const colIndex = col.charCodeAt(0) - 65; // A=0, B=1, ..., K=10
  const rowIndex = row;
  
  console.log(`🎯 Parsed gridId "${gridId}" to coordinates: col=${colIndex}, row=${rowIndex}`);
  return { colIndex, rowIndex };
};

// Convert coordinates to grid ID (e.g., { col: 10, row: 0 } -> "K1")
export const getGridId = (colIndex, rowIndex) => {
  const col = String.fromCharCode(65 + colIndex); // 0=A, 1=B, ..., 10=K
  const row = rowIndex + 1; // Convert back to 1-based index
  return `${col}${row}`;
};

// Main zoom function - can be called from anywhere
export const handleGridZoom = async (target, options = {}) => {
  const { delay = 0, duration = 1000, scale = 2 } = options;
  
  if (!matrixCanvasRef) {
    console.error('❌ Matrix Canvas reference not set');
    return Promise.resolve();
  }
  
  // Parse target if it's a string (grid ID)
  let colIndex, rowIndex;
  if (typeof target === 'string') {
    const coords = parseGridId(target);
    colIndex = coords.colIndex;
    rowIndex = coords.rowIndex;
  } else if (typeof target === 'object' && target.colIndex !== undefined && target.rowIndex !== undefined) {
    colIndex = target.colIndex;
    rowIndex = target.rowIndex;
  } else {
    console.error('❌ Invalid target format:', target);
    return Promise.resolve();
  }
  
  const gridId = getGridId(colIndex, rowIndex);
  console.log(`🎬 Global zoom called: ${gridId} (${colIndex}, ${rowIndex})`);
  
  // Set zoom state
  currentZoomState.isZooming = true;
  currentZoomState.currentTarget = gridId;
  
  // Add delay if specified
  if (delay > 0) {
    console.log(`⏳ Waiting ${delay}ms before zoom...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  try {
    // Call the MatrixSpiralCanvas zoom function
    await matrixCanvasRef.handleGridZoom(colIndex, rowIndex);
    console.log(`✅ Global zoom completed: ${gridId}`);
  } catch (error) {
    console.error('❌ Zoom error:', error);
  } finally {
    // Reset zoom state
    currentZoomState.isZooming = false;
    currentZoomState.currentTarget = null;
  }
};

// Batch zoom function - zoom to multiple targets in sequence
export const handleBatchZoom = async (targets, options = {}) => {
  const { delayBetween = 500, delayBefore = 0 } = options;
  
  console.log(`🎬 Batch zoom called with ${targets.length} targets:`, targets);
  
  // Add initial delay if specified
  if (delayBefore > 0) {
    console.log(`⏳ Waiting ${delayBefore}ms before batch zoom...`);
    await new Promise(resolve => setTimeout(resolve, delayBefore));
  }
  
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    console.log(`🎬 Batch zoom ${i + 1}/${targets.length}: ${target}`);
    
    await handleGridZoom(target);
    
    // Add delay between zooms (except for the last one)
    if (i < targets.length - 1 && delayBetween > 0) {
      console.log(`⏳ Waiting ${delayBetween}ms before next zoom...`);
      await new Promise(resolve => setTimeout(resolve, delayBetween));
    }
  }
  
  console.log('✅ Batch zoom completed');
};

// Region zoom function - zoom to all tiles in a region
export const handleRegionZoom = async (startGridId, endGridId, options = {}) => {
  const { delayBetween = 300, pattern = 'horizontal' } = options;
  
  console.log(`🎬 Region zoom called: ${startGridId} to ${endGridId} (${pattern})`);
  
  const start = parseGridId(startGridId);
  const end = parseGridId(endGridId);
  
  // Generate all grid IDs in the region
  const targets = [];
  const minCol = Math.min(start.colIndex, end.colIndex);
  const maxCol = Math.max(start.colIndex, end.colIndex);
  const minRow = Math.min(start.rowIndex, end.rowIndex);
  const maxRow = Math.max(start.rowIndex, end.rowIndex);
  
  if (pattern === 'horizontal') {
    // Horizontal pattern: A1, B1, C1, A2, B2, C2, etc.
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        targets.push(getGridId(col, row));
      }
    }
  } else if (pattern === 'vertical') {
    // Vertical pattern: A1, A2, A3, B1, B2, B3, etc.
    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow; row <= maxRow; row++) {
        targets.push(getGridId(col, row));
      }
    }
  } else if (pattern === 'spiral') {
    // Spiral pattern: start from center and spiral out
    const centerCol = Math.floor((minCol + maxCol) / 2);
    const centerRow = Math.floor((minRow + maxRow) / 2);
    targets.push(getGridId(centerCol, centerRow));
    
    // Add surrounding tiles in spiral pattern
    const directions = [
      [0, -1], [1, 0], [0, 1], [-1, 0] // up, right, down, left
    ];
    let currentCol = centerCol;
    let currentRow = centerRow;
    let step = 1;
    let direction = 0;
    
    while (targets.length < (maxCol - minCol + 1) * (maxRow - minRow + 1)) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < step; j++) {
          currentCol += directions[direction][0];
          currentRow += directions[direction][1];
          
          if (currentCol >= minCol && currentCol <= maxCol && 
              currentRow >= minRow && currentRow <= maxRow) {
            const gridId = getGridId(currentCol, currentRow);
            if (!targets.includes(gridId)) {
              targets.push(gridId);
            }
          }
        }
        direction = (direction + 1) % 4;
      }
      step++;
    }
  }
  
  console.log(`🎬 Generated ${targets.length} targets for region zoom:`, targets);
  await handleBatchZoom(targets, { delayBetween });
};

// Get current zoom state
export const getZoomState = () => {
  return { ...currentZoomState };
};

// Check if currently zooming
export const isZooming = () => {
  return currentZoomState.isZooming;
};

// Clear zoom queue
export const clearZoomQueue = () => {
  currentZoomState.zoomQueue = [];
  console.log('🎬 Zoom queue cleared');
};

// Example usage functions
export const zoomExamples = {
  // Zoom to specific tile
  toTile: (gridId) => handleGridZoom(gridId),
  
  // Zoom with delay
  withDelay: (gridId, delay) => handleGridZoom(gridId, { delay }),
  
  // Zoom to corner tiles
  toCorners: () => handleBatchZoom(['A1', 'K1', 'K7', 'A7']),
  
  // Zoom to center tiles
  toCenter: () => handleBatchZoom(['F4', 'G4', 'F5', 'G5']),
  
  // Zoom to entire row
  toRow: (row) => {
    const targets = [];
    for (let col = 0; col < 11; col++) {
      targets.push(getGridId(col, row - 1));
    }
    return handleBatchZoom(targets);
  },
  
  // Zoom to entire column
  toColumn: (col) => {
    const targets = [];
    for (let row = 0; row < 7; row++) {
      targets.push(getGridId(col - 1, row));
    }
    return handleBatchZoom(targets);
  }
}; 