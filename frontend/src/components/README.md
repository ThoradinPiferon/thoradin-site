# Frontend Components Structure

This folder is organized to align with the backend scenario system, making it easy to understand which components belong to which scenes.

## Folder Structure

### 📁 scene1/
**Scene 1: Matrix Awakening**
- `MatrixSpiralCanvas.jsx` - The iconic matrix spiral animation (Scene 1.1 & 1.2)

### 📁 scene2/
**Scene 2: Tree of Wisdom**
- `TreeOfWisdomCanvas.jsx` - Rainy forest night with Tree of Wisdom (Scene 2.1)

### 📁 shared/
**Shared Components**
- `LayeredInterface.jsx` - Main interface that orchestrates all scenes
- `GridPlay.jsx` - Grid system for interactive tiles
- `ThoradinChat.jsx` - Chat interface with AI
- `ThresholdRitual.jsx` - Ritual interaction component
- `ThresholdRitual.css` - Styles for ritual component

## Backend Alignment

This structure directly corresponds to the backend scenarios:

| Scene | Subscene | Title | Component |
|-------|----------|-------|-----------|
| 1.1 | Matrix Awakening | Thoradin's Web of Consciousness | MatrixSpiralCanvas |
| 1.2 | Fast-Forward Matrix Complete | static | MatrixSpiralCanvas (static) |
| 2.1 | Tree of Wisdom Intro | tree_of_wisdom | TreeOfWisdomCanvas |

## Adding New Scenes

When adding new scenes:
1. Create a new `sceneX/` folder for the scene
2. Add your canvas components to that folder
3. Update `shared/LayeredInterface.jsx` to import and use the new components
4. Ensure the animation type in the database matches your component logic

## Animation Types

- `matrix_spiral` → MatrixSpiralCanvas
- `tree_of_wisdom` → TreeOfWisdomCanvas
- `static` → Static background or MatrixSpiralCanvas in static mode

## Scenario Flow

1. **Scene 1.1** → Matrix Spiral Animation → Click A1 → **Scene 1.2**
2. **Scene 1.2** → Static Matrix → Click F1 → **Scene 2.1** (Tree of Wisdom)
3. **Scene 2.1** → Tree of Wisdom Animation (End of current flow)
