import { prisma } from '../config/database.js';

/**
 * Scene Seed Data
 * Defines the structure and default data for scenes and subscenes
 */
export const sceneSeedData = [
  // Scene 1.1 - Matrix Awakening (Full Grid A1-K7, A1 communicates with background layer)
  {
    sceneId: 1,
    subsceneId: 1,
    title: "Matrix Awakening",
    description: "The spiral begins to spin...",
    backgroundType: "matrix_spiral",
    gridConfig: { 
      rows: 7, 
      cols: 11,
      gap: '2px',
      padding: '20px',
      debug: false,
      invisibleMode: false,
      matrixAnimationMode: true,
      triggerTile: 'A1'
    },
    tiles: [
      {
        id: "A1",
        handler: "frontend",
        actions: {
          frontend: ["background_communication", "matrix_animation_trigger"],
          backend: null,
          effects: {
            animationTrigger: "matrix_fast_forward",
            transitionType: "immediate"
          }
        }
      },
      {
        id: "B1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      }
    ],
    invisibleMode: false,
    effects: {
      autoAdvanceAfter: 8000, // 8 seconds
      nextScene: { sceneId: 1, subsceneId: 2 }
    },
    choices: [
      {
        label: "Fast-forward Matrix Animation",
        next: [1, 2],
        condition: "gridId === 'A1'",
        effects: {
          animationTrigger: "matrix_fast_forward",
          transitionType: "immediate"
        },
        echo: "matrix_fast_forward"
      }
    ],
    nextScene: { sceneId: 1, subsceneId: 2 }, // Auto-advance to Scene 1.2
    nextScenes: [
      { sceneId: 1, subsceneId: 2, triggerTile: "A1", label: "Fast-forward Matrix Animation" }
    ],
    echoTriggers: ["matrix_awakening"]
  },
  
  // Scene 1.2 - Matrix Static (Full Grid)
  {
    sceneId: 1,
    subsceneId: 2,
    title: "Matrix Spiral Static",
    description: "The spiral has reached its final form",
    backgroundType: "matrix_spiral_static",
    gridConfig: { 
      rows: 7, 
      cols: 11,
      gap: '2px',
      padding: '20px',
      debug: false,
      invisibleMode: false,
      matrixAnimationMode: false,
      triggerTile: null
    },
    tiles: [
      {
        id: "K7",
        handler: "both",
        actions: {
          frontend: ["cursor_zoom"],
          backend: ["scene_transition"],
          effects: {
            animationTrigger: "scene_transition",
            transitionType: "vault_entrance"
          }
        }
      },
      {
        id: "A1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "B1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "C1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "D1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "E1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "F1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "G1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "H1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "I1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "J1", handler: "both", actions: { 
          frontend: ["cursor_zoom"], 
          backend: ["scene_transition"], 
          effects: { animationTrigger: "matrix_restart", transitionType: "spiral_reset" }
        }
      },
      {
        id: "K1", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K2", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K3", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K4", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K5", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "K6", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "A7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "B7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "C7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "D7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "E7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "F7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "G7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "H7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "I7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      },
      {
        id: "J7", handler: "none", actions: { frontend: null, backend: null, effects: {} }
      }
    ],
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
    nextScenes: [
      { sceneId: 2, subsceneId: 1, triggerTile: "K7", label: "Navigate to Vault" },
      { sceneId: 1, subsceneId: 1, triggerTile: "A1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "B1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "C1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "D1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "E1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "F1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "G1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "H1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "I1", label: "Restart Matrix" },
      { sceneId: 1, subsceneId: 1, triggerTile: "J1", label: "Restart Matrix" }
    ],
    echoTriggers: ["matrix_static"]
  },
  
  // Scene 2.1 - Vault Interface
  {
    sceneId: 2,
    subsceneId: 1,
    title: "Thoradin's Vault",
    description: "Deep underground, roots of an ancient tree hang from the ceiling. A massive vault door stands closed, with Thoradin waiting before it.",
    backgroundType: "dungeon_vault",
    gridConfig: { 
      rows: 7, 
      cols: 11,
      gap: '2px',
      padding: '20px',
      debug: false,
      invisibleMode: true,
      matrixAnimationMode: false,
      triggerTile: null
    },
    tiles: ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1",
            "A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2",
            "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3",
            "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4",
            "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5",
            "A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6", "K6",
            "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7", "K7"],
    invisibleMode: true,
    effects: {
      zoomRequired: true,
      transitionType: "zoom_then_transition",
      dungeonTheme: true,
      characterInteraction: true
    },
    choices: [
      {
        label: "Interact with Thoradin",
        next: [2, 2],
        condition: "gridId === 'F4'",
        effects: {
          animationTrigger: "character_interaction",
          transitionType: "zoom_to_character"
        },
        echo: "thoradin_interaction"
      },
      {
        label: "Examine Vault Door",
        next: [2, 3],
        condition: "gridId === 'G4'",
        effects: {
          animationTrigger: "vault_examination",
          transitionType: "zoom_to_vault"
        },
        echo: "vault_examination"
      },
      {
        label: "Explore Roots",
        next: [2, 4],
        condition: "gridId === 'F3'",
        effects: {
          animationTrigger: "root_exploration",
          transitionType: "zoom_to_roots"
        },
        echo: "root_exploration"
      }
    ],
    nextScene: null,
    nextScenes: [
      { sceneId: 2, subsceneId: 2, triggerTile: "F4", label: "Interact with Thoradin" },
      { sceneId: 2, subsceneId: 3, triggerTile: "G4", label: "Examine Vault Door" },
      { sceneId: 2, subsceneId: 4, triggerTile: "F3", label: "Explore Roots" }
    ],
    echoTriggers: ["dungeon_vault", "thoradin_presence"]
  },
  
  // Scene 1.3 - Thoradin's Vault (Dungeon Theme)
  {
    sceneId: 1,
    subsceneId: 3,
    title: "Thoradin's Vault",
    description: "Deep underground, roots of an ancient tree hang from the ceiling. A massive vault door stands closed, with Thoradin waiting before it.",
    backgroundType: "dungeon_vault",
    gridConfig: { 
      rows: 7, 
      cols: 11,
      gap: '2px',
      padding: '20px',
      debug: false,
      invisibleMode: true,
      matrixAnimationMode: false,
      triggerTile: null
    },
    tiles: ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1",
            "A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2",
            "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3",
            "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4",
            "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5",
            "A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6", "K6",
            "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7", "K7"],
    invisibleMode: true,
    effects: {
      zoomRequired: true,
      transitionType: "zoom_then_transition",
      dungeonTheme: true,
      characterInteraction: true
    },
    choices: [
      {
        label: "Interact with Thoradin",
        next: [1, 4],
        condition: "gridId === 'F4'",
        effects: {
          animationTrigger: "character_interaction",
          transitionType: "zoom_to_character"
        },
        echo: "thoradin_interaction"
      },
      {
        label: "Examine Vault Door",
        next: [1, 5],
        condition: "gridId === 'G4'",
        effects: {
          animationTrigger: "vault_examination",
          transitionType: "zoom_to_vault"
        },
        echo: "vault_examination"
      },
      {
        label: "Explore Roots",
        next: [1, 6],
        condition: "gridId === 'F3'",
        effects: {
          animationTrigger: "root_exploration",
          transitionType: "zoom_to_roots"
        },
        echo: "root_exploration"
      }
    ],
    nextScene: null,
    nextScenes: [
      { sceneId: 1, subsceneId: 4, triggerTile: "F4", label: "Interact with Thoradin" },
      { sceneId: 1, subsceneId: 5, triggerTile: "G4", label: "Examine Vault Door" },
      { sceneId: 1, subsceneId: 6, triggerTile: "F3", label: "Explore Roots" }
    ],
    echoTriggers: ["dungeon_vault", "thoradin_presence"]
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