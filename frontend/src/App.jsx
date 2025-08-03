import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayeredInterface from './components/LayeredInterface';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LayeredInterface />} />
      </Routes>
    </div>
  );
}

export default App;