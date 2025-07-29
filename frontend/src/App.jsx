import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayeredInterface from './components/LayeredInterface.jsx';
import AIInteraction from './components/AIInteraction.jsx';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<LayeredInterface />} />
        <Route path="/ai" element={<AIInteraction />} />
      </Routes>
    </div>
  );
}

export default App;