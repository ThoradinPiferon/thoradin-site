/**
 * Zoom Examples - Demonstrating the clean auto-detection zoom interface
 * 
 * This file shows how to use the new zoomToTile() function that automatically
 * detects the current scene and background type.
 */

import { zoomToTile, zoomUtils } from './sceneZoomManager.js';

/**
 * Example 1: Simple zoom with auto-detection
 * This works automatically regardless of current scene (Matrix, Vault, etc.)
 */
export const exampleSimpleZoom = async () => {
  try {
    // This automatically detects the current scene and uses the correct zoom handler
    await zoomToTile('F6');
    console.log('✅ Simple zoom completed');
  } catch (error) {
    console.error('❌ Zoom failed:', error.message);
  }
};

/**
 * Example 2: Zoom with options
 */
export const exampleZoomWithOptions = async () => {
  try {
    await zoomToTile('K7', { 
      scale: 2.5, 
      duration: 1500 
    });
    console.log('✅ Zoom with options completed');
  } catch (error) {
    console.error('❌ Zoom failed:', error.message);
  }
};

/**
 * Example 3: Using convenience functions
 */
export const exampleConvenienceFunctions = async () => {
  try {
    // These all use auto-detection
    await zoomUtils.toTile('A1');
    await zoomUtils.withDelay('B2', 1000);
    await zoomUtils.withScale('C3', 3);
    console.log('✅ Convenience functions completed');
  } catch (error) {
    console.error('❌ Zoom failed:', error.message);
  }
};

/**
 * Example 4: Explicit scene specification (for testing)
 */
export const exampleExplicitScene = async () => {
  try {
    // Explicitly specify scene (useful for testing or edge cases)
    await zoomToTile('F6', {}, 1, 2); // Scene 1.2
    console.log('✅ Explicit scene zoom completed');
  } catch (error) {
    console.error('❌ Zoom failed:', error.message);
  }
};

/**
 * Example 5: Error handling
 */
export const exampleErrorHandling = async () => {
  try {
    // This will throw an error if no zoom handler is registered for the current scene
    await zoomToTile('INVALID');
  } catch (error) {
    console.log('✅ Error properly caught:', error.message);
  }
};

/**
 * Example 6: Scene transition with zoom
 * This shows how zoom works seamlessly across different scenes
 */
export const exampleSceneTransition = async () => {
  try {
    // Zoom in Scene 1.2 (Matrix)
    await zoomToTile('F6', {}, 1, 2);
    console.log('✅ Matrix zoom completed');
    
    // Transition to Scene 2.1 (Vault) - zoom would automatically use vault handler
    // await zoomToTile('F6', {}, 2, 1); // This would use vault zoom handler
    
    console.log('✅ Scene transition zoom completed');
  } catch (error) {
    console.error('❌ Scene transition failed:', error.message);
  }
};

/**
 * Usage examples for different scenarios:
 * 
 * // In any scene - auto-detects background type
 * await zoomToTile('F6');
 * 
 * // With custom options
 * await zoomToTile('K7', { scale: 2, duration: 1000 });
 * 
 * // Using convenience functions
 * await zoomUtils.withDelay('A1', 500);
 * 
 * // Explicit scene (for testing)
 * await zoomToTile('F6', {}, 1, 2);
 * 
 * // Error handling
 * try {
 *   await zoomToTile('F6');
 * } catch (error) {
 *   console.error('Zoom failed:', error.message);
 * }
 */ 