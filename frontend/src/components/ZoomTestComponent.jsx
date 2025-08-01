import React from 'react';
import { 
  handleGridZoom, 
  handleBatchZoom, 
  handleRegionZoom, 
  zoomExamples,
  isZooming 
} from '../utils/zoomUtils';

const ZoomTestComponent = () => {
  const handleSingleZoom = async () => {
    console.log('🧪 Testing single zoom to K1');
    await handleGridZoom('K1');
  };

  const handleDelayedZoom = async () => {
    console.log('🧪 Testing delayed zoom to A1');
    await handleGridZoom('A1', { delay: 1000 });
  };

  const handleBatchZoomTest = async () => {
    console.log('🧪 Testing batch zoom to corners');
    await handleBatchZoom(['A1', 'K1', 'K7', 'A7'], { delayBetween: 800 });
  };

  const handleRegionZoomTest = async () => {
    console.log('🧪 Testing region zoom (A1 to C3)');
    await handleRegionZoom('A1', 'C3', { pattern: 'spiral', delayBetween: 500 });
  };

  const handleExampleZooms = async () => {
    console.log('🧪 Testing example zooms');
    
    // Test various zoom patterns
    await zoomExamples.toTile('F4');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await zoomExamples.withDelay('G5', 500);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await zoomExamples.toCorners();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await zoomExamples.toCenter();
  };

  const handleRowZoom = async () => {
    console.log('🧪 Testing row zoom (row 4)');
    await zoomExamples.toRow(4);
  };

  const handleColumnZoom = async () => {
    console.log('🧪 Testing column zoom (column F)');
    await zoomExamples.toColumn(6); // F is column 6 (0-based)
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#00ff00',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#00ffcc' }}>🧪 Zoom Tests</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button 
          onClick={handleSingleZoom}
          style={{ padding: '5px', background: '#003300', color: '#00ff00', border: '1px solid #00ff00' }}
        >
          Single: K1
        </button>
        
        <button 
          onClick={handleDelayedZoom}
          style={{ padding: '5px', background: '#003300', color: '#00ff00', border: '1px solid #00ff00' }}
        >
          Delayed: A1
        </button>
        
        <button 
          onClick={handleBatchZoomTest}
          style={{ padding: '5px', background: '#003300', color: '#00ff00', border: '1px solid #00ff00' }}
        >
          Batch: Corners
        </button>
        
        <button 
          onClick={handleRegionZoomTest}
          style={{ padding: '5px', background: '#003300', color: '#00ff00', border: '1px solid #00ff00' }}
        >
          Region: A1-C3
        </button>
        
        <button 
          onClick={handleExampleZooms}
          style={{ padding: '5px', background: '#003300', color: '#00ff00', border: '1px solid #00ff00' }}
        >
          Examples
        </button>
        
        <button 
          onClick={handleRowZoom}
          style={{ padding: '5px', background: '#003300', color: '#00ff00', border: '1px solid #00ff00' }}
        >
          Row 4
        </button>
        
        <button 
          onClick={handleColumnZoom}
          style={{ padding: '5px', background: '#003300', color: '#00ff00', border: '1px solid #00ff00' }}
        >
          Column F
        </button>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
        Status: {isZooming() ? '🔄 Zooming...' : '✅ Ready'}
      </div>
    </div>
  );
};

export default ZoomTestComponent; 