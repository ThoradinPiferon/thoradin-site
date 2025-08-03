# 🏛️ Thoradin Clean Architecture

A clean, database-driven interactive storytelling platform with layered architecture and independent zoom system.

## 🎯 **Core Principles**

1. **Database-Driven**: All scenarios, grid configs, and tile handlers come from DB
2. **Layered Architecture**: Background → Grid → UI layers with clear separation
3. **Independent Zoom**: Screen-pointer based, grid-agnostic zoom system
4. **Dynamic Tile Handlers**: Backend defines per-tile behavior

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────┐
│  LAYER 3: UI Components            │  ← Zoom overlays, cutscenes
├─────────────────────────────────────┤
│  LAYER 2: Grid System              │  ← Interactive tiles, handlers
├─────────────────────────────────────┤
│  LAYER 1: Background Animation     │  ← Matrix spiral, effects
├─────────────────────────────────────┤
│  LAYER 0: Scenario Engine          │  ← DB loading, state management
└─────────────────────────────────────┘
```

## 🎮 **Tile Handler System**

```javascript
// Backend defines per-tile behavior
tiles: [
  {
    id: "A1",
    handler: "frontend", // "frontend" | "backend" | "both" | "none"
    actions: {
      frontend: ["cursor_zoom", "matrix_trigger"],
      backend: ["scene_transition"],
      effects: { animationSpeed: "fast" }
    }
  }
]
```

## 🔍 **Independent Zoom System**

```javascript
// Screen-pointer based, grid-agnostic
const performCursorZoom = async (cursorPos, onComplete) => {
  // 1. Calculate zoom center from cursor position
  // 2. Animate zoom effect
  // 3. Call onComplete() when done
  // 4. No knowledge of grid structure needed
};
```

## 🗄️ **Database Schema**

```sql
-- Core scenario system
Scenario {
  id, sceneId, subsceneId,
  gridConfig: JSON,        -- {rows, cols, gap, padding}
  metadata: JSON,          -- {title, background, effects}
  tiles: JSON,             -- [{id, handler, actions, effects}]
  nextScenes: JSON         -- [{sceneId, subsceneId, triggerTile}]
}
```

## 🚀 **Quick Start**

```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Set up database
npm run db:migrate
npm run db:generate

# Start development
npm run dev
```

## 📁 **Project Structure**

```
thoradin-clean/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── LayeredInterface.jsx  # Main orchestrator
│   │   │   ├── MatrixSpiralCanvas.jsx # Background animation
│   │   │   └── GridPlay.jsx          # Grid system
│   │   └── utils/           # Utilities
├── backend/                  # Node.js + Express backend
│   ├── routes/
│   │   └── scenario.js      # Scenario API endpoints
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── server.js            # Express server
└── package.json             # Root package.json
```

## 🎭 **Scenario Loading Flow**

```javascript
// 1. Load scenario from DB
const scenario = await fetch(`/api/scenario?sceneId=1&subsceneId=1`);

// 2. Extract grid config
const gridConfig = scenario.gridConfig;

// 3. Set up tile handlers
const tileHandlers = scenario.tiles;

// 4. Render layers
<BackgroundLayer config={scenario.metadata} />
<GridLayer config={gridConfig} handlers={tileHandlers} />
<UILayer />
```

## 🔧 **Key Features**

- ✅ **Database-driven scenarios** - No hardcoded scene logic
- ✅ **Independent zoom system** - Works with any cursor position
- ✅ **Dynamic tile handlers** - Backend defines behavior
- ✅ **Layered architecture** - Clear separation of concerns
- ✅ **Session tracking** - User interaction logging
- ✅ **Modular design** - Easy to extend and maintain

## 🎯 **Current Status**

- ✅ **Clean architecture** implemented
- ✅ **Database schema** designed
- ✅ **Scenario API** created
- ✅ **LayeredInterface** component built
- ✅ **Independent zoom** system working
- ✅ **Matrix background** copied from archive

## 🚧 **Next Steps**

1. **Set up backend server** with Express
2. **Initialize database** with Prisma
3. **Create frontend app** with React + Vite
4. **Test scenario loading** from database
5. **Implement tile handlers** for Scene 1.1

---

**🎭 Start from Scene 1.1 with Matrix background and clean architecture!**
