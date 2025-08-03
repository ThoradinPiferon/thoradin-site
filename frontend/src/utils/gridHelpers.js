/**
 * Grid Helper Functions for Excel-style coordinates (A1-K7)
 * 
 * This module provides utilities for converting between grid indices
 * and Excel-style coordinate labels.
 */

/**
 * Convert column index to Excel column letter (A-Z, AA-ZZ, etc.)
 * @param {number} colIndex - Column index (0-based)
 * @returns {string} Column letter (A, B, ..., Z, AA, AB, etc.)
 */
export function getColumnLetter(colIndex) {
  if (colIndex < 0) {
    throw new Error(`Invalid column index: ${colIndex}. Must be >= 0.`);
  }
  
  let result = '';
  while (colIndex >= 0) {
    result = String.fromCharCode(65 + (colIndex % 26)) + result;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return result;
}

/**
 * Convert Excel column letter (A-Z, AA-ZZ, etc.) to column index
 * @param {string} columnLetter - Column letter (A, B, ..., Z, AA, AB, etc.)
 * @returns {number} Column index (0-based)
 */
export function getColumnIndex(columnLetter) {
  const letter = columnLetter.toUpperCase();
  let result = 0;
  
  for (let i = 0; i < letter.length; i++) {
    const charCode = letter.charCodeAt(i);
    if (charCode < 65 || charCode > 90) {
      throw new Error(`Invalid column letter: ${columnLetter}. Must contain only A-Z.`);
    }
    result = result * 26 + (charCode - 64);
  }
  
  return result - 1; // Convert to 0-based
}

/**
 * Get Excel-style grid ID from row and column indices
 * @param {number} colIndex - Column index (0-based)
 * @param {number} rowIndex - Row index (0-based)
 * @returns {string} Grid ID (e.g., "A1", "K7")
 */
export function getGridId(colIndex, rowIndex) {
  if (rowIndex < 0) {
    throw new Error(`Invalid row index: ${rowIndex}. Must be >= 0.`);
  }
  const columnLetter = getColumnLetter(colIndex);
  const rowNumber = rowIndex + 1; // Convert to 1-based
  return `${columnLetter}${rowNumber}`;
}

/**
 * Parse Excel-style grid ID to get row and column indices
 * @param {string} gridId - Grid ID (e.g., "A1", "K7", "AA1")
 * @returns {Object} { colIndex: number, rowIndex: number }
 */
export function parseGridId(gridId) {
  const match = gridId.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid grid ID format: ${gridId}. Expected format like "A1" or "K7".`);
  }
  
  const columnLetter = match[1];
  const rowNumber = parseInt(match[2]);
  
  if (rowNumber < 1) {
    throw new Error(`Invalid row number: ${rowNumber}. Must be >= 1.`);
  }
  
  return {
    colIndex: getColumnIndex(columnLetter),
    rowIndex: rowNumber - 1 // Convert to 0-based
  };
}

/**
 * Get all valid grid IDs for a given Excel range
 * @param {string} excelRange - Excel range (e.g., "A1:K7", "A1:A1")
 * @returns {Array<string>} Array of all grid IDs in the range
 */
export function getAllGridIdsFromRange(excelRange) {
  const { startColIndex, endColIndex, startRow, endRow } = parseExcelRange(excelRange);
  const gridIds = [];
  
  for (let row = startRow - 1; row < endRow; row++) {
    for (let col = startColIndex; col <= endColIndex; col++) {
      gridIds.push(getGridId(col, row));
    }
  }
  return gridIds;
}

/**
 * Get all valid grid IDs for the 11x7 grid (legacy function for backward compatibility)
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
 * Parse Excel range (e.g., "A1:K7") to get grid dimensions
 * @param {string} excelRange - Excel range (e.g., "A1:K7", "A1:A1")
 * @returns {Object} { rows: number, cols: number, startCol: string, endCol: string, startRow: number, endRow: number }
 */
export function parseExcelRange(excelRange) {
  const match = excelRange.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid Excel range format: ${excelRange}. Expected format like "A1:K7".`);
  }
  
  const startCol = match[1];
  const startRow = parseInt(match[2]);
  const endCol = match[3];
  const endRow = parseInt(match[4]);
  
  const startColIndex = getColumnIndex(startCol);
  const endColIndex = getColumnIndex(endCol);
  
  const cols = endColIndex - startColIndex + 1;
  const rows = endRow - startRow + 1;
  
  return {
    rows,
    cols,
    startCol,
    endCol,
    startRow,
    endRow,
    startColIndex,
    endColIndex
  };
}

/**
 * Get grid dimensions from Excel range
 * @param {string} excelRange - Excel range (e.g., "A1:K7")
 * @returns {Object} { rows: number, cols: number }
 */
export function getGridDimensionsFromRange(excelRange) {
  const { rows, cols } = parseExcelRange(excelRange);
  return { rows, cols };
}

/**
 * Get grid dimensions (legacy function for backward compatibility)
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