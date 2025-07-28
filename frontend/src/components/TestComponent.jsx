import React from 'react';

const TestComponent = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#00ff00',
      fontSize: '2rem',
      fontFamily: 'monospace',
      zIndex: 1000
    }}>
      GridPlay Frontend Working! 🎮
    </div>
  );
};

export default TestComponent; 