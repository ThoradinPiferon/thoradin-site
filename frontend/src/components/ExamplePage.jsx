import React, { useState } from 'react';
import GridPageTemplate from './GridPageTemplate';
import { 
  createBackButton, 
  createTitle, 
  createWindow, 
  createInputBox,
  createGridAction,
  gridConfigs
} from '../utils/gridElements';

// Example background component
const ExampleBackground = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, #000011, #001122)',
    zIndex: 1
  }} />
);

const ExamplePage = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: inputValue, 
      timestamp: new Date() 
    }]);
    setInputValue('');
  };

  // Example grid action - clicking G5.5 shows an alert
  const handleGridClick = (col, row, index) => {
    alert(`You clicked grid G${col}.${row}!`);
  };

  // Create UI elements
  const backButton = createBackButton(handleBackToHome);
  const title = createTitle("EXAMPLE PAGE", 2, 1, 3);
  
  const content = (
    <div>
      <h3>Welcome to the Example Page!</h3>
      <p>This demonstrates how easy it is to create new grid pages.</p>
      <ul>
        <li>Click G5.5 to see a grid action</li>
        <li>Use the input box below</li>
        <li>All styling is handled by the template</li>
      </ul>
      {messages.map((msg, index) => (
        <div key={index} style={{ 
          margin: '10px 0', 
          padding: '10px', 
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          borderRadius: '5px'
        }}>
          <strong>{msg.type}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );

  const mainWindow = createWindow(content, 2, 2, 7, 4, "Example Content");
  
  const inputBox = createInputBox(
    null,
    inputValue,
    (e) => setInputValue(e.target.value),
    handleSubmit,
    "Type something...",
    false,
    2, 6, 7
  );

  // Assemble UI elements
  const uiElements = [
    backButton,
    title,
    mainWindow,
    inputBox
  ];

  // Create grid actions - only G5.5 is interactive
  const gridActions = new Array(gridConfigs.standard.gridCols * gridConfigs.standard.gridRows).fill(null);
  gridActions[49] = createGridAction(49, handleGridClick, "Example grid action"); // G5.5

  return (
    <GridPageTemplate
      gridCols={gridConfigs.standard.gridCols}
      gridRows={gridConfigs.standard.gridRows}
      uiElements={uiElements}
      interactiveElements={[]}
      gridActions={gridActions}
      backgroundComponent={<ExampleBackground />}
      pageName="Example Page"
    />
  );
};

export default ExamplePage; 