import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayeredInterface from './components/LayeredInterface.jsx';
import VaultInteraction from './components/VaultInteraction.jsx';
import GridPlay from './components/GridPlay.jsx';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<LayeredInterface />} />
        <Route path="/vault" element={<VaultInteraction />} />
        <Route path="/gridplay" element={<GridPlay />} />
      </Routes>
    </div>
  );
}

export default App;