import { prisma } from '../config/database.js';

/**
 * Scene Seed Data
 * Defines the structure and default data for scenes and subscenes
 */
export const sceneSeedData = [
  // Scene 1.1 - Matrix Awakening (Single Tile)
  {
    sceneId: 1,
    subsceneId: 1,
    title: "Matrix Awakening",
    description: "The spiral begins to spin...",
    backgroundType: "matrix_spiral",
    gridConfig: { rows: 1, cols: 1 },
    tiles: ["A1"],
    invisibleMode: true,
    effects: {
      autoAdvanceAfter: 8000, // 8 seconds
      nextScene: { sceneId: 1, subsceneId: 2 }
    },
    choices: [], // No choices - auto-advance only
    nextScene: { sceneId: 1, subsceneId: 2 }, // Auto-advance to Scene 1.2
    echoTriggers: ["matrix_awakening"]
  },
  
  // Scene 1.2 - Matrix Static (Full Grid)
  {
    sceneId: 1,
    subsceneId: 2,
    title: "Matrix Spiral Static",
    description: "The spiral has reached its final form",
    backgroundType: "matrix_spiral_static",
    gridConfig: { rows: 7, cols: 11 },
    tiles: ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1",
            "A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2",
            "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3",
            "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4",
            "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5",
            "A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6", "K6",
            "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7", "K7"],
    invisibleMode: false,
    effects: {
      zoomRequired: true,
      transitionType: "zoom_then_transition"
    },
    choices: [
      {
        label: "Navigate to Vault",
        next: [2, 1],
        condition: "gridId === 'K7'",
        effects: {
          animationTrigger: "scene_transition",
          transitionType: "vault_entrance"
        },
        echo: "vault_destination"
      },
      {
        label: "Restart Matrix",
        next: [1, 1],
        condition: "gridId !== 'K7'",
        effects: {
          animationTrigger: "matrix_restart",
          transitionType: "spiral_reset"
        },
        echo: "matrix_rebirth"
      }
    ],
    nextScene: null,
    echoTriggers: ["matrix_static"]
  },
  
  // Scene 2.1 - Vault Interface
  {
    sceneId: 2,
    subsceneId: 1,
    title: "Vault Interface",
    description: "The AI awaits your questions",
    backgroundType: "vault_background",
    gridConfig: { rows: 7, cols: 11 },
    tiles: ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1",
            "A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2",
            "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3",
            "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4",
            "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5",
            "A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6", "K6",
            "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7", "K7"],
    invisibleMode: false,
    effects: {
      zoomRequired: true,
      transitionType: "zoom_then_transition"
    },
    choices: [
      {
        label: "Return to Homepage",
        next: [1, 1],
        condition: "gridId === 'K7'",
        effects: {
          animationTrigger: "vault_exit",
          transitionType: "return_to_matrix"
        },
        echo: "home_return"
      },
      {
        label: "Vault Interaction",
        next: [2, 1],
        condition: "gridId !== 'K7'",
        effects: {
          animationTrigger: "vault_interaction",
          transitionType: "none"
        },
        echo: "vault_exploration"
      }
    ],
    nextScene: null,
    echoTriggers: ["vault_interface"]
  }
];

/**
 * Initialize scene data in the database
 */
export async function initializeSceneData() {
  console.log('🌱 Initializing scene data...');
  
  try {
    for (const sceneData of sceneSeedData) {
      const { sceneId, subsceneId, ...data } = sceneData;
      
      await prisma.sceneSubscene.upsert({
        where: {
          sceneId_subsceneId: {
            sceneId: sceneId,
            subsceneId: subsceneId
          }
        },
        update: {
          ...data,
          gridConfig: JSON.stringify(data.gridConfig),
          tiles: data.tiles,
          effects: JSON.stringify(data.effects),
          choices: JSON.stringify(data.choices),
          echoTriggers: data.echoTriggers
        },
        create: {
          sceneId: sceneId,
          subsceneId: subsceneId,
          ...data,
          gridConfig: JSON.stringify(data.gridConfig),
          tiles: data.tiles,
          effects: JSON.stringify(data.effects),
          choices: JSON.stringify(data.choices),
          echoTriggers: data.echoTriggers
        }
      });
      
      console.log(`✅ Scene ${sceneId}.${subsceneId} initialized: ${data.title}`);
    }
    
    console.log('🎭 All scene data initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing scene data:', error);
    throw error;
  }
}

/**
 * Get scene data by ID
 */
export function getSceneData(sceneId, subsceneId) {
  return sceneSeedData.find(
    scene => scene.sceneId === sceneId && scene.subsceneId === subsceneId
  );
}

/**
 * Get all scene data
 */
export function getAllSceneData() {
  return sceneSeedData;
}

/**
 * Get scene configuration for a specific scene
 */
export function getSceneConfig(sceneId, subsceneId) {
  const scene = getSceneData(sceneId, subsceneId);
  return scene ? scene.gridConfig : null;
}

/**
 * Check if scene has auto-advance functionality
 */
export function hasAutoAdvance(sceneId, subsceneId) {
  const scene = getSceneData(sceneId, subsceneId);
  return scene?.effects?.autoAdvanceAfter ? true : false;
}

/**
 * Get auto-advance configuration
 */
export function getAutoAdvanceConfig(sceneId, subsceneId) {
  const scene = getSceneData(sceneId, subsceneId);
  return scene?.effects?.autoAdvanceAfter ? {
    delay: scene.effects.autoAdvanceAfter,
    nextScene: scene.effects.nextScene
  } : null;
} 