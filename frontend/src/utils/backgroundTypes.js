/**
 * Background Types - Examples of how different backgrounds can register with the zoom manager
 * 
 * This file demonstrates how to create background-agnostic zoom functionality
 * for different visual styles (Matrix, Vault, Hand-drawn, etc.)
 */

import { registerBackgroundZoomHandler } from './sceneZoomManager.js';

/**
 * Example: Vault Background Zoom Handler
 * This shows how a different visual style can implement its own zoom logic
 */
export const createVaultZoomHandler = (vaultCanvasRef) => {
  const vaultZoomHandler = async (colIndex, rowIndex, options = {}) => {
    const { scale = 2, duration = 1000 } = options;
    
    console.log(`🏛️ Vault zoom to (${colIndex}, ${rowIndex}) with scale ${scale}`);
    
    // Vault-specific zoom animation
    // This could be a different visual effect (e.g., vault door opening, light beam, etc.)
    return new Promise((resolve) => {
      // Simulate vault zoom animation
      setTimeout(() => {
        console.log('🏛️ Vault zoom animation completed');
        resolve();
      }, duration);
    });
  };
  
  // Register the vault background
  registerBackgroundZoomHandler('vault', vaultCanvasRef, vaultZoomHandler);
  
  return vaultZoomHandler;
};

/**
 * Example: Hand-drawn Canvas Zoom Handler
 * This shows how a hand-drawn style background could implement zoom
 */
export const createHandDrawnZoomHandler = (canvasRef) => {
  const handDrawnZoomHandler = async (colIndex, rowIndex, options = {}) => {
    const { scale = 1.5, duration = 800 } = options;
    
    console.log(`✏️ Hand-drawn zoom to (${colIndex}, ${rowIndex}) with scale ${scale}`);
    
    // Hand-drawn specific zoom animation
    // This could be a sketch-like zoom effect, pencil strokes, etc.
    return new Promise((resolve) => {
      // Simulate hand-drawn zoom animation
      setTimeout(() => {
        console.log('✏️ Hand-drawn zoom animation completed');
        resolve();
      }, duration);
    });
  };
  
  // Register the hand-drawn background
  registerBackgroundZoomHandler('handDrawn', canvasRef, handDrawnZoomHandler);
  
  return handDrawnZoomHandler;
};

/**
 * Example: Static Grid Zoom Handler
 * This shows how a simple static grid could implement zoom
 */
export const createStaticGridZoomHandler = (gridRef) => {
  const staticGridZoomHandler = async (colIndex, rowIndex, options = {}) => {
    const { scale = 3, duration = 600 } = options;
    
    console.log(`📐 Static grid zoom to (${colIndex}, ${rowIndex}) with scale ${scale}`);
    
    // Static grid zoom animation
    // This could be a simple CSS transform zoom
    return new Promise((resolve) => {
      // Simulate static grid zoom animation
      setTimeout(() => {
        console.log('📐 Static grid zoom animation completed');
        resolve();
      }, duration);
    });
  };
  
  // Register the static grid background
  registerBackgroundZoomHandler('staticGrid', gridRef, staticGridZoomHandler);
  
  return staticGridZoomHandler;
};

/**
 * Example: How to use different background types in a scene
 */
export const registerSceneBackgrounds = (sceneType, canvasRef) => {
  switch (sceneType) {
    case 'matrix':
      // Matrix background is already registered in MatrixSpiralCanvas
      console.log('🎬 Matrix background already registered');
      break;
      
    case 'vault':
      createVaultZoomHandler(canvasRef);
      break;
      
    case 'handDrawn':
      createHandDrawnZoomHandler(canvasRef);
      break;
      
    case 'staticGrid':
      createStaticGridZoomHandler(canvasRef);
      break;
      
    default:
      console.warn(`⚠️ Unknown scene type: ${sceneType}`);
  }
}; 