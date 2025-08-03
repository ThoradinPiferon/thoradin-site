import React, { useState } from 'react';
import GridPlay from './GridPlay';
import { 
  getGridConfig, 
  getAllSceneConfigs, 
  createGridConfig,
  generateGridActions 
} from '../utils/gridConfig';

/**
 * Test component to demonstrate different grid configurations
 * This component allows testing various grid layouts and debug features
 */
const GridTestComponent = () => {
  const [selectedConfig, setSelectedConfig] = useState('homepage');
  const [customRows, setCustomRows] = useState(7);
  const [customCols, setCustomCols] = useState(11);
  const [debugMode, setDebugMode] = useState(false);
  const [showInvisibleButtons, setShowInvisibleButtons] = useState(false);

  // Get all available configurations
  const allConfigs = getAllSceneConfigs();
  
  // Handle grid click for testing
  const handleGridClick = (row, col, gridIndex) => {
    const gridId = `${String.fromCharCode(65 + col)}${row + 1}`;
    console.log(`🧪 Test Grid Click: ${gridId} (row: ${row + 1}, col: ${col + 1}, index: ${gridIndex})`);
    
    // You can add custom logic here for testing different scenarios
    if (gridId === 'K7') {
      console.log('🎯 Special tile K7 clicked!');
    }
  };

  // Generate grid actions
  const gridActions = generateGridActions(
    getGridConfig(selectedConfig), 
    handleGridClick
  );

  // Create custom configuration
  const customConfig = createGridConfig(customRows, customCols, {
    debug: debugMode,
    gap: '2px',
    padding: '20px'
  });

  // Get current configuration
  const currentConfig = selectedConfig === 'custom' 
    ? customConfig 
    : getGridConfig(selectedConfig, { debug: debugMode });

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #333',
        minWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#00ff00' }}>🎛️ Grid Test Controls</h3>
        
        {/* Configuration Selector */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Grid Configuration:</label>
          <select 
            value={selectedConfig} 
            onChange={(e) => setSelectedConfig(e.target.value)}
            style={{
              width: '100%',
              padding: '5px',
              backgroundColor: '#333',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '4px'
            }}
          >
            {Object.keys(allConfigs).map(configName => (
              <option key={configName} value={configName}>
                {configName} ({allConfigs[configName].rows}x{allConfigs[configName].cols})
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Custom Configuration Controls */}
        {selectedConfig === 'custom' && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px' }}>Rows:</label>
                <input 
                  type="number" 
                  value={customRows} 
                  onChange={(e) => setCustomRows(parseInt(e.target.value) || 1)}
                  min="1" 
                  max="26"
                  style={{
                    width: '60px',
                    padding: '3px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '2px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px' }}>Cols:</label>
                <input 
                  type="number" 
                  value={customCols} 
                  onChange={(e) => setCustomCols(parseInt(e.target.value) || 1)}
                  min="1" 
                  max="26"
                  style={{
                    width: '60px',
                    padding: '3px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '2px'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Debug Controls */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              checked={debugMode} 
              onChange={(e) => setDebugMode(e.target.checked)}
            />
            Debug Mode (Show Tile IDs)
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              checked={showInvisibleButtons} 
              onChange={(e) => setShowInvisibleButtons(e.target.checked)}
            />
            Invisible Buttons Mode
          </label>
        </div>

        {/* Current Configuration Info */}
        <div style={{ 
          fontSize: '12px', 
          color: '#888',
          borderTop: '1px solid #333',
          paddingTop: '10px'
        }}>
          <div>Current: {currentConfig.rows}x{currentConfig.cols}</div>
          <div>Total Tiles: {currentConfig.rows * currentConfig.cols}</div>
          <div>Debug: {currentConfig.debug ? 'ON' : 'OFF'}</div>
        </div>
      </div>

      {/* Grid Play Component */}
      <GridPlay
        gridConfig={currentConfig}
        gridActions={gridActions}
        showInvisibleButtons={showInvisibleButtons}
        currentScene={1}
        currentSubscene={1}
        isZooming={false}
        sceneName={selectedConfig}
      />

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #333',
        fontSize: '12px',
        maxWidth: '400px'
      }}>
        <div style={{ color: '#00ff00', marginBottom: '5px' }}>🧪 Test Instructions:</div>
        <div>• Click tiles to see their IDs in console</div>
        <div>• K7 is a special tile with custom logic</div>
        <div>• Debug mode shows tile boundaries</div>
        <div>• Invisible mode hides tile text</div>
      </div>
    </div>
  );
};

export default GridTestComponent; 