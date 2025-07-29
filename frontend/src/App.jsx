import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayeredInterface from './components/LayeredInterface.jsx';
import AIInteraction from './components/AIInteraction.jsx';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<LayeredInterface />} />
          <Route path="/ai" element={<AIInteraction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;