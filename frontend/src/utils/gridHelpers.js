/**
 * Grid Helper Functions for Excel-style coordinates (A1-K7)
 * 
 * This module provides utilities for converting between grid indices
 * and Excel-style coordinate labels.
 */

/**
 * Convert column index (0-10) to Excel column letter (A-K)
 * @param {number} colIndex - Column index (0-based)
 * @returns {string} Column letter (A-K)
 */
export function getColumnLetter(colIndex) {
  if (colIndex < 0 || colIndex > 10) {
    throw new Error(`Invalid column index: ${colIndex}. Must be 0-10.`);
  }
  return String.fromCharCode(65 + colIndex); // A=65, B=66, ..., K=75
}

/**
 * Convert Excel column letter (A-K) to column index (0-10)
 * @param {string} columnLetter - Column letter (A-K)
 * @returns {number} Column index (0-based)
 */
export function getColumnIndex(columnLetter) {
  const letter = columnLetter.toUpperCase();
  if (letter < 'A' || letter > 'K') {
    throw new Error(`Invalid column letter: ${columnLetter}. Must be A-K.`);
  }
  return letter.charCodeAt(0) - 65; // A=0, B=1, ..., K=10
}

/**
 * Get Excel-style grid ID from row and column indices
 * @param {number} colIndex - Column index (0-based)
 * @param {number} rowIndex - Row index (0-based)
 * @returns {string} Grid ID (e.g., "A1", "K7")
 */
export function getGridId(colIndex, rowIndex) {
  if (rowIndex < 0 || rowIndex > 6) {
    throw new Error(`Invalid row index: ${rowIndex}. Must be 0-6.`);
  }
  const columnLetter = getColumnLetter(colIndex);
  const rowNumber = rowIndex + 1; // Convert to 1-based
  return `${columnLetter}${rowNumber}`;
}

/**
 * Parse Excel-style grid ID to get row and column indices
 * @param {string} gridId - Grid ID (e.g., "A1", "K7")
 * @returns {Object} { colIndex: number, rowIndex: number }
 */
export function parseGridId(gridId) {
  const match = gridId.match(/^([A-K])(\d+)$/);
  if (!match) {
    throw new Error(`Invalid grid ID format: ${gridId}. Expected format like "A1" or "K7".`);
  }
  
  const columnLetter = match[1];
  const rowNumber = parseInt(match[2]);
  
  if (rowNumber < 1 || rowNumber > 7) {
    throw new Error(`Invalid row number: ${rowNumber}. Must be 1-7.`);
  }
  
  return {
    colIndex: getColumnIndex(columnLetter),
    rowIndex: rowNumber - 1 // Convert to 0-based
  };
}

/**
 * Get all valid grid IDs for the 11x7 grid
 * @returns {Array<string>} Array of all grid IDs (A1-K7)
 */
export function getAllGridIds() {
  const gridIds = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 11; col++) {
      gridIds.push(getGridId(col, row));
    }
  }
  return gridIds;
}

/**
 * Validate if a grid ID is in the correct format and range
 * @param {string} gridId - Grid ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidGridId(gridId) {
  try {
    parseGridId(gridId);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get grid dimensions
 * @returns {Object} { rows: number, cols: number }
 */
export function getGridDimensions() {
  return { rows: 7, cols: 11 };
}

/**
 * Convert old Gx.y format to new Excel format
 * @param {string} oldGridId - Old format (e.g., "G1.1")
 * @returns {string} New format (e.g., "A1")
 */
export function convertOldGridId(oldGridId) {
  const match = oldGridId.match(/^G(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid old grid ID format: ${oldGridId}. Expected format like "G1.1".`);
  }
  
  const rowIndex = parseInt(match[1]) - 1; // Convert to 0-based
  const colIndex = parseInt(match[2]) - 1; // Convert to 0-based
  
  return getGridId(colIndex, rowIndex);
}

/**
 * Convert new Excel format to old Gx.y format (for backward compatibility)
 * @param {string} newGridId - New format (e.g., "A1")
 * @returns {string} Old format (e.g., "G1.1")
 */
export function convertToOldGridId(newGridId) {
  const { colIndex, rowIndex } = parseGridId(newGridId);
  const row = rowIndex + 1; // Convert to 1-based
  const col = colIndex + 1; // Convert to 1-based
  return `G${row}.${col}`;
} 