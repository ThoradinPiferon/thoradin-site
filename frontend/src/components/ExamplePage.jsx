import React, { useState } from 'react';
import GridPageTemplate from './GridPageTemplate';
import { PAGES } from '../utils/gridActionSystem';
import { 
  createBackButton, 
  createTitle, 
  createWindow, 
  createInputBox,
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

  // Create UI elements
  const backButton = createBackButton(() => window.location.href = '/');
  const title = createTitle("EXAMPLE PAGE", 2, 1, 3);
  
  const content = (
    <div>
      <h3>Welcome to the Example Page!</h3>
      <p>This demonstrates how easy it is to create new grid pages.</p>
      <ul>
        <li>Click E5 to see a grid action</li>
        <li>Use the input box below</li>
        <li>All styling is handled by the template</li>
        <li>Grid actions are centralized and modular</li>
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

  // Context for example page
  const exampleContext = {
    // Add any example-specific context here
    user: { name: 'Example User' },
    settings: { theme: 'dark' }
  };

  return (
    <GridPageTemplate
      pageId={PAGES.EXAMPLE}
      context={exampleContext}
      uiElements={uiElements}
      backgroundComponent={<ExampleBackground />}
      pageName="Example Page"
    />
  );
};

export default ExamplePage; 