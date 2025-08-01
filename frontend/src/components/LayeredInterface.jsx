import React from 'react';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';

const LayeredInterface = () => {
  const handleVaultClick = () => {
    console.log('Clicked G11.7 - Navigating to Vault page');
    window.location.href = '/vault';
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Matrix Spiral Background */}
      <MatrixSpiralCanvas />
      
      {/* G11.7 Button - Bottom Right */}
      <button
        onClick={handleVaultClick}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          border: '2px solid #00ff00',
          borderRadius: '8px',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 10,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 15px rgba(0, 255, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.4)';
          e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.5)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
          e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.3)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        G11.7<br />Vault
      </button>
    </div>
  );
};

export default LayeredInterface; 