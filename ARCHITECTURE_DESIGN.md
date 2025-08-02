# Thoradin-Site: Architectural Design Document

## 🧩 Narrative Philosophy Summary

**This is a symbolic narrative engine driven by user reflection. Each grid interaction represents a choice; each scene, a mirror of the self.**

Thoradin-site transcends traditional web applications by creating an interactive storytelling platform where:
- **Grid interactions** become symbolic choices reflecting user psychology
- **Scene transitions** mirror personal growth and decision-making patterns
- **AI integration** provides contextual, reflective responses
- **SoulKey system** tracks and evolves user traits through interaction patterns

Unlike conventional games, this platform uses **symbolic interaction** to create meaningful, reflective experiences that adapt to individual user behavior and preferences.

---

## 🏗️ System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   React     │  │   Vite      │  │  Tailwind   │            │
│  │ Components  │  │   Build     │  │     CSS     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Express    │  │   Prisma    │  │   OpenAI    │            │
│  │    API      │  │     ORM     │  │   Client    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │ PostgreSQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ PostgreSQL  │  │   Prisma    │  │   Migrations│            │
│  │   Schema    │  │   Client    │  │   & Seeds   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. 🔧 Modular Component Breakdown

### Frontend Modularity

```
frontend/src/
├── components/                    # Reusable UI Components
│   ├── LayeredInterface.jsx      # Main application shell
│   ├── MatrixSpiralCanvas.jsx    # Background animation engine
│   ├── GridPlay.jsx              # Grid interaction system
│   ├── VaultInteraction.jsx      # AI chat interface
│   ├── SoulKeyInsights.jsx       # Session analytics
│   └── [SceneName]Component.jsx  # Scene-specific components
├── services/                     # API Communication Layer
│   ├── configService.js          # Configuration management
│   └── languageService.js        # Multilingual support
├── utils/                        # Utility Functions
│   ├── gridConfig.js             # Grid configuration system
│   ├── gridHelpers.js            # Grid utility functions
│   ├── gridActionSystem.js       # Action processing
│   └── zoomUtils.js              # Zoom functionality
└── assets/                       # Static Resources
```

**Reusable Components:**
- `GridPlay.jsx` - Can be configured for any grid-based scene
- `MatrixSpiralCanvas.jsx` - Reusable animation engine
- `VaultInteraction.jsx` - Modular AI chat interface
- Configuration-driven grid system

### Backend Modularity

```
backend/
├── services/                     # Business Logic Layer
│   ├── sceneEngine.js           # Scene transition engine
│   ├── sceneLogic.js            # Custom scene behaviors
│   ├── sceneSeed.js             # Default scene data
│   ├── soulKeyService.js        # Session tracking
│   ├── configService.js         # Configuration management
│   └── languageService.js       # Multilingual support
├── controllers/                  # API Route Handlers
│   ├── gridController.js        # Grid interaction logic
│   └── [Feature]Controller.js   # Feature-specific controllers
├── middleware/                   # Request Processing
│   ├── auth.js                  # Authentication
│   └── language.js              # Language detection
├── routes/                       # API Endpoints
│   ├── grid.js                  # Grid interactions
│   ├── ai.js                    # AI chat
│   ├── scene.js                 # Scene management
│   └── [Feature].js             # Feature-specific routes
└── config/                       # Configuration
    ├── database.js              # Database connection
    ├── customization.js         # System customization
    └── openai.js                # AI configuration
```

**Reusable Services:**
- `sceneEngine.js` - Handles any scene transition logic
- `soulKeyService.js` - Universal session tracking
- `configService.js` - Dynamic configuration management
- `languageService.js` - Multilingual content support

### SceneEngine & SoulKey Architecture

```
SceneEngine Layer:
┌─────────────────────────────────────────────────────────────┐
│                    SceneEngine.js                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Scene     │  │   Logic     │  │   Fallback  │        │
│  │ Evaluation  │  │ Processing  │  │   System    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   sceneLogic.js                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Custom     │  │  Background │  │  Choice-    │        │
│  │  Scene      │  │   Type      │  │  Based      │        │
│  │  Logic      │  │   Logic     │  │  Logic      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘

SoulKey Layer:
┌─────────────────────────────────────────────────────────────┐
│                  soulKeyService.js                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Session    │  │  Interaction│  │   Insight   │        │
│  │ Management  │  │   Logging   │  │ Generation  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Schema                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ GridSession │  │ SoulKeyLog  │  │ GridInteraction│      │
│  │             │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 📊 Data Flow Diagrams

### Scene Transition Flow

```
User Click → Frontend → Backend API → SceneEngine → Database → Response → Frontend Update
     │           │           │            │           │           │           │
     ▼           ▼           ▼            ▼           ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Grid    │ │ Grid    │ │ /api/   │ │ Scene   │ │ Scene   │ │ Scene   │ │ UI      │
│ Click   │ │ Action  │ │ scene/  │ │ Engine  │ │ Data    │ │ Logic   │ │ Update  │
│ Event   │ │ Handler │ │ evaluate│ │ Process │ │ Query   │ │ Result  │ │ &       │
│         │ │         │ │         │ │         │ │         │ │         │ │ Effects │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
     │           │           │            │           │           │           │
     └───────────┴───────────┴────────────┴───────────┴───────────┴───────────┘
                                    SoulKey Logging
```

### Grid Interaction Flow

```
Grid Click → Action System → Zoom Check → Scene Logic → Transition Decision → UI Update
     │            │             │            │              │                │
     ▼            ▼             ▼            ▼              ▼                ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Grid    │ │ Action  │ │ Zoom    │ │ Scene   │ │ Next    │ │ Visual  │
│ Tile    │ │ Config  │ │ Logic   │ │ Logic   │ │ Scene   │ │ Effects │
│ ID      │ │ Lookup  │ │ Check   │ │ Process │ │ Decision│ │ Apply   │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
     │            │             │            │              │                │
     └────────────┴─────────────┴────────────┴──────────────┴────────────────┘
                                    SoulKey Logging
```

### Session Logging & SoulKey Flow

```
User Action → SoulKey Service → Database Log → Session Update → Insight Generation
     │              │               │              │                │
     ▼              ▼               ▼              ▼                ▼
┌─────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Grid    │ │ Session     │ │ SoulKeyLog  │ │ Session     │ │ Pattern     │
│ Click   │ │ Management  │ │ & Tracking  │ │ & Storage   │ │ & Insights  │
│ Event   │ │ & Tracking  │ │ & Storage   │ │ Update      │ │ & Insights  │
└─────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
     │              │               │              │                │
     └──────────────┴───────────────┴──────────────┴────────────────┘
                                    Real-time Updates
```

---

## 3. ⚙️ Configuration Strategy

### Scene Configuration Structure

```javascript
// scenes/scene-1.2.json
{
  "sceneId": 1,
  "subsceneId": 2,
  "title": "Matrix Static",
  "description": "Choose your path in the static matrix",
  "backgroundType": "matrix_spiral_static",
  "gridConfig": {
    "rows": 7,
    "cols": 11,
    "gap": "2px",
    "padding": "20px"
  },
  "tiles": ["A1", "B1", "C1", ...],
  "choices": [
    {
      "condition": "gridId === 'K7'",
      "label": "Navigate to Vault",
      "next": [2, 1],
      "effects": {
        "animationTrigger": "scene_transition",
        "transitionType": "vault_entrance"
      },
      "echo": "vault_destination"
    }
  ],
  "effects": {
    "zoomRequired": true,
    "autoAdvanceAfter": null
  },
  "nextScene": {
    "sceneId": 1,
    "subsceneId": 1
  },
  "echoTriggers": ["grid_click", "vault_destination"]
}
```

### Grid Configuration System

```javascript
// configs/grids/homepage-grid.json
{
  "name": "homepage",
  "dimensions": {
    "rows": 7,
    "cols": 11
  },
  "styling": {
    "gap": "2px",
    "padding": "20px",
    "backgroundColor": "rgba(31, 41, 55, 0.2)",
    "borderColor": "rgba(75, 85, 99, 0.3)"
  },
  "tiles": {
    "K7": {
      "action": "navigate",
      "target": "vault",
      "label": "Vault Entrance",
      "effects": {
        "zoom": true,
        "transition": "vault_entrance"
      }
    }
  },
  "defaultAction": "restart_matrix"
}
```

### Transition Logic Configuration

```javascript
// configs/transitions/matrix-to-vault.json
{
  "from": "1.2",
  "to": "2.1",
  "trigger": "K7",
  "conditions": {
    "zoomRequired": true,
    "animationComplete": true
  },
  "effects": {
    "animationTrigger": "scene_transition",
    "transitionType": "vault_entrance",
    "duration": 1000
  },
  "soulKeyTraits": {
    "add": ["exploration", "vault_interest"],
    "modify": {
      "pattern_memory": "+1"
    }
  }
}
```

### External Configuration Loading

```javascript
// services/configLoader.js
class ConfigLoader {
  async loadSceneConfig(sceneId, subsceneId) {
    const configPath = `./configs/scenes/scene-${sceneId}.${subsceneId}.json`;
    return await this.loadJsonConfig(configPath);
  }
  
  async loadGridConfig(gridName) {
    const configPath = `./configs/grids/${gridName}-grid.json`;
    return await this.loadJsonConfig(configPath);
  }
  
  async loadTransitionConfig(fromScene, toScene) {
    const configPath = `./configs/transitions/${fromScene}-to-${toScene}.json`;
    return await this.loadJsonConfig(configPath);
  }
}
```

---

## 4. 🚀 Extensibility Principles

### Scaling from 1 Grid to 100+ Scenes

#### Scene Registry System
```javascript
// services/sceneRegistry.js
class SceneRegistry {
  constructor() {
    this.scenes = new Map();
    this.sceneTypes = new Map();
    this.transitionRules = new Map();
  }
  
  registerScene(sceneId, subsceneId, config) {
    const key = `${sceneId}.${subsceneId}`;
    this.scenes.set(key, config);
    
    // Auto-register scene type
    if (config.backgroundType) {
      this.registerSceneType(config.backgroundType, config);
    }
  }
  
  registerSceneType(type, template) {
    this.sceneTypes.set(type, template);
  }
  
  getScene(sceneId, subsceneId) {
    return this.scenes.get(`${sceneId}.${subsceneId}`);
  }
  
  getSceneType(type) {
    return this.sceneTypes.get(type);
  }
}
```

#### Modular Scene Logic Architecture
```javascript
// sceneLogic/modularSceneLogic.js
class ModularSceneLogic {
  constructor() {
    this.logicModules = new Map();
    this.hooks = new Map();
  }
  
  registerLogicModule(name, logic) {
    this.logicModules.set(name, logic);
  }
  
  registerHook(hookName, callback) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(callback);
  }
  
  async processSceneAction(sceneId, subsceneId, gridId, action) {
    // Execute pre-action hooks
    await this.executeHooks('preAction', { sceneId, subsceneId, gridId, action });
    
    // Get scene logic
    const logic = this.getSceneLogic(sceneId, subsceneId);
    const result = await logic.processAction(gridId, action);
    
    // Execute post-action hooks
    await this.executeHooks('postAction', { sceneId, subsceneId, gridId, action, result });
    
    return result;
  }
}
```

#### Dynamic AI Logic Injection
```javascript
// services/aiLogicInjector.js
class AILogicInjector {
  constructor() {
    this.aiModules = new Map();
    this.contextProviders = new Map();
  }
  
  registerAIModule(sceneType, aiModule) {
    this.aiModules.set(sceneType, aiModule);
  }
  
  registerContextProvider(sceneId, provider) {
    this.contextProviders.set(sceneId, provider);
  }
  
  async injectAILogic(sceneId, subsceneId, userContext) {
    const scene = await this.getSceneData(sceneId, subsceneId);
    const aiModule = this.aiModules.get(scene.backgroundType);
    const contextProvider = this.contextProviders.get(sceneId);
    
    if (aiModule && contextProvider) {
      const context = await contextProvider.getContext(userContext);
      return await aiModule.processContext(context);
    }
    
    return null;
  }
}
```

### Best Practices for Scene Modularization

1. **Scene Template System**
   ```javascript
   // templates/matrixScene.js
   class MatrixSceneTemplate {
     static create(sceneId, subsceneId, customConfig = {}) {
       return {
         sceneId,
         subsceneId,
         backgroundType: 'matrix_spiral',
         gridConfig: { rows: 7, cols: 11 },
         ...customConfig
       };
     }
   }
   ```

2. **Logic Composition**
   ```javascript
   // logic/composers/sceneLogicComposer.js
   class SceneLogicComposer {
     compose(sceneConfig) {
       return {
         processAction: this.createActionProcessor(sceneConfig),
         validateTransition: this.createTransitionValidator(sceneConfig),
         generateEffects: this.createEffectsGenerator(sceneConfig)
       };
     }
   }
   ```

3. **Plugin Architecture**
   ```javascript
   // plugins/pluginManager.js
   class PluginManager {
     registerPlugin(name, plugin) {
       this.plugins.set(name, plugin);
       plugin.initialize(this.sceneEngine);
     }
     
     async executePlugin(name, context) {
       const plugin = this.plugins.get(name);
       if (plugin) {
         return await plugin.execute(context);
       }
     }
   }
   ```

---

## 5. 🛡️ Fallback & Error Strategy

### Scene Loading Fallback System

```javascript
// services/fallbackSystem.js
class FallbackSystem {
  constructor() {
    this.fallbacks = new Map();
    this.defaultScenes = new Map();
  }
  
  registerFallback(sceneType, fallbackScene) {
    this.fallbacks.set(sceneType, fallbackScene);
  }
  
  registerDefaultScene(sceneId, defaultConfig) {
    this.defaultScenes.set(sceneId, defaultConfig);
  }
  
  async getSceneWithFallback(sceneId, subsceneId) {
    try {
      // Try database first
      const scene = await this.getSceneFromDatabase(sceneId, subsceneId);
      if (scene) return scene;
      
      // Try configuration files
      const configScene = await this.getSceneFromConfig(sceneId, subsceneId);
      if (configScene) return configScene;
      
      // Try seed data
      const seedScene = await this.getSceneFromSeed(sceneId, subsceneId);
      if (seedScene) return seedScene;
      
      // Use default scene
      return this.getDefaultScene(sceneId);
      
    } catch (error) {
      console.error(`Scene loading failed for ${sceneId}.${subsceneId}:`, error);
      return this.getEmergencyFallback();
    }
  }
  
  getEmergencyFallback() {
    return {
      sceneId: 1,
      subsceneId: 1,
      title: "System Recovery",
      backgroundType: "matrix_spiral",
      gridConfig: { rows: 1, cols: 1 },
      message: "System recovered. Please try again."
    };
  }
}
```

### State Repair Mechanisms

```javascript
// services/stateRepair.js
class StateRepair {
  constructor() {
    this.repairStrategies = new Map();
  }
  
  registerRepairStrategy(issueType, strategy) {
    this.repairStrategies.set(issueType, strategy);
  }
  
  async repairState(currentState) {
    const issues = this.detectIssues(currentState);
    
    for (const issue of issues) {
      const strategy = this.repairStrategies.get(issue.type);
      if (strategy) {
        currentState = await strategy.repair(currentState, issue);
      }
    }
    
    return currentState;
  }
  
  detectIssues(state) {
    const issues = [];
    
    // Check for invalid scene state
    if (!state.sceneId || !state.subsceneId) {
      issues.push({ type: 'invalid_scene_state', data: state });
    }
    
    // Check for missing grid configuration
    if (!state.gridConfig) {
      issues.push({ type: 'missing_grid_config', data: state });
    }
    
    // Check for corrupted session data
    if (state.sessionId && !this.validateSession(state.sessionId)) {
      issues.push({ type: 'corrupted_session', data: state });
    }
    
    return issues;
  }
}
```

### Safe Defaults Configuration

```javascript
// configs/safeDefaults.js
export const SAFE_DEFAULTS = {
  scenes: {
    fallback: {
      sceneId: 1,
      subsceneId: 1,
      title: "Home",
      backgroundType: "matrix_spiral",
      gridConfig: { rows: 7, cols: 11 }
    }
  },
  
  grids: {
    fallback: {
      rows: 7,
      cols: 11,
      gap: "2px",
      padding: "20px"
    }
  },
  
  transitions: {
    fallback: {
      sceneId: 1,
      subsceneId: 1,
      message: "Returning to home",
      effects: {
        animationTrigger: "safe_return",
        transitionType: "smooth"
      }
    }
  },
  
  ai: {
    fallback: {
      message: "I'm here to help. What would you like to explore?",
      model: "gpt-4",
      temperature: 0.7
    }
  }
};
```

---

## 🧬 SoulKey Trait Engine Documentation

### Trait Evolution System

```javascript
// services/traitEngine.js
class TraitEngine {
  constructor() {
    this.traits = new Map();
    this.evolutionRules = new Map();
    this.patterns = new Map();
  }
  
  registerTrait(name, config) {
    this.traits.set(name, {
      name,
      value: config.initialValue || 0,
      maxValue: config.maxValue || 100,
      decayRate: config.decayRate || 0,
      ...config
    });
  }
  
  registerEvolutionRule(traitName, rule) {
    if (!this.evolutionRules.has(traitName)) {
      this.evolutionRules.set(traitName, []);
    }
    this.evolutionRules.get(traitName).push(rule);
  }
  
  async processInteraction(sessionId, interaction) {
    const session = await this.getSession(sessionId);
    const traits = session.traits || {};
    
    // Analyze interaction for trait triggers
    const traitChanges = this.analyzeInteraction(interaction);
    
    // Apply trait changes
    for (const [traitName, change] of Object.entries(traitChanges)) {
      traits[traitName] = this.updateTrait(traits[traitName], change);
    }
    
    // Apply evolution rules
    await this.applyEvolutionRules(sessionId, traits);
    
    // Update session
    await this.updateSession(sessionId, { traits });
    
    return traits;
  }
  
  analyzeInteraction(interaction) {
    const changes = {};
    
    // Pattern-based analysis
    if (interaction.gridId === 'K7') {
      changes.exploration = +1;
      changes.vault_interest = +2;
    }
    
    // Time-based analysis
    if (interaction.responseTime > 5000) {
      changes.contemplation = +1;
    }
    
    // Frequency-based analysis
    if (this.isFrequentInteraction(interaction)) {
      changes.pattern_memory = +1;
    }
    
    return changes;
  }
}
```

### Adding New Traits

```javascript
// traits/customTraits.js
export const CUSTOM_TRAITS = {
  creativity: {
    name: "Creativity",
    initialValue: 0,
    maxValue: 100,
    decayRate: 0.1,
    description: "Measures creative thinking patterns",
    triggers: {
      "unusual_grid_click": +2,
      "rapid_interaction": +1,
      "vault_exploration": +3
    }
  },
  
  reflection: {
    name: "Reflection",
    initialValue: 0,
    maxValue: 100,
    decayRate: 0.05,
    description: "Measures contemplative behavior",
    triggers: {
      "slow_interaction": +2,
      "repeated_click": +1,
      "matrix_restart": +3
    }
  }
};
```

---

## 🌌 Dream Scenario Vision: 6 Months from Now

### 🎭 Dozens of Symbolic Scenes
- **DreamSpiral**: A meditation-focused narrative with 20+ calming scenes
- **GriefGarden**: A therapeutic experience with 15+ healing interactions
- **WisdomMaze**: An educational journey with 25+ learning scenarios
- **CreativityCanvas**: An artistic exploration with 30+ creative prompts

### 🧠 Reflective Profile Building
- **SoulKey Profiles**: Users build unique psychological profiles
- **Trait Evolution**: Long-term personality pattern tracking
- **Journey Mapping**: Visual representation of growth patterns
- **Insight Generation**: AI-powered self-reflection summaries

### 🛠️ No-Code Scene Creation
- **Visual Scene Builder**: Drag-and-drop scene creation interface
- **Template Library**: Pre-built scene templates for common themes
- **Logic Composer**: Visual logic flow builder for scene transitions
- **Asset Manager**: Integrated media and animation management

### 🚀 Platform Ecosystem
- **Fork & Customize**: Educators create their own narrative experiences
- **Plugin Marketplace**: Community-contributed scene logic and effects
- **API Ecosystem**: Third-party integrations for enhanced experiences
- **Multi-Platform**: Mobile apps, VR experiences, and web interfaces

### 🎯 Educational Applications
- **Psychology Education**: Interactive learning about human behavior
- **Creative Writing**: AI-assisted storytelling workshops
- **Meditation Apps**: Guided mindfulness experiences
- **Therapeutic Tools**: Professional mental health applications

### 🌟 Creative Possibilities
- **DreamSpiral**: A meditation app with 100+ calming scenes
- **GriefGarden**: A therapeutic tool for processing loss
- **WisdomMaze**: An educational platform for philosophy and ethics
- **CreativityCanvas**: An artistic exploration tool for creative expression

---

## 📋 Implementation Roadmap

### Phase 1: Foundation (Month 1-2)
- [ ] Complete modular scene system
- [ ] Implement configuration loading
- [ ] Build trait engine foundation
- [ ] Create visual scene builder prototype

### Phase 2: Expansion (Month 3-4)
- [ ] Develop 10+ base scene templates
- [ ] Implement plugin architecture
- [ ] Build no-code scene creation tools
- [ ] Create SoulKey analytics dashboard

### Phase 3: Ecosystem (Month 5-6)
- [ ] Launch plugin marketplace
- [ ] Develop mobile applications
- [ ] Create educational partnerships
- [ ] Build community platform

---

**This architecture document provides a comprehensive blueprint for scaling Thoradin-site from a single interactive experience to a full narrative platform ecosystem, enabling creators to build meaningful, reflective digital experiences without technical barriers.** 