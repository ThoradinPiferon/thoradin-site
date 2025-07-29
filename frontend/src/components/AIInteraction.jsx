import React, { useState, useRef, useEffect } from 'react';
import GridPlay from './GridPlay';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';

const AIInteraction = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { type: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          language: 'en' // You can make this dynamic based on user preference
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const aiMessage = { 
          type: 'ai', 
          content: data.response || data.message, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = { 
          type: 'error', 
          content: 'Sorry, I encountered an error. Please try again.', 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = { 
        type: 'error', 
        content: 'Connection error. Please check your internet connection.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // Grid configuration
  const gridCols = 11;
  const gridRows = 7;

  // AI Response Window (G5.1-G7.4)
  const responseWindow = (
    <div style={{
      ...getGridCellStyle(5, 1, 3, 4),
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid #00ff00',
      borderRadius: '8px',
      padding: '15px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '14px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px',
        paddingRight: '10px'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Welcome to the AI Grid Interface. Ask me anything about consciousness, creativity, or the digital realm...
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} style={{
              marginBottom: '15px',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: message.type === 'user' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
              borderLeft: `3px solid ${message.type === 'user' ? '#00ff00' : '#0088ff'}`
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '5px',
                color: message.type === 'user' ? '#00ff00' : '#0088ff'
              }}>
                {message.type === 'user' ? 'You' : message.type === 'ai' ? 'AI' : 'System'}
              </div>
              <div style={{ lineHeight: '1.4' }}>
                {message.content}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#666', 
                marginTop: '5px' 
              }}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{
            padding: '10px',
            color: '#00ff00',
            fontStyle: 'italic'
          }}>
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  // Input Box (G5.7-G7.7)
  const inputBox = (
    <div style={{
      ...getGridCellStyle(5, 7, 3, 1),
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #00ff00',
      borderRadius: '8px',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', gap: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask the AI anything..."
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            padding: '8px 12px',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontSize: '14px',
            outline: 'none'
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          style={{
            backgroundColor: '#00ff00',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            fontFamily: 'monospace',
            fontSize: '14px',
            cursor: 'pointer',
            opacity: isLoading || !inputValue.trim() ? 0.5 : 1
          }}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );

  // Back Button (G1.1)
  const backButton = (
    <div 
      onClick={handleBackToHome}
      style={{
        ...getGridCellStyle(1, 1, 1, 1),
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        border: '2px solid #ff0000',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '12px',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 0, 0, 1)';
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        e.target.style.transform = 'scale(1)';
      }}
    >
      ← HOME
    </div>
  );

  // Title (G2.1-G4.1)
  const title = (
    <div style={{
      ...getGridCellStyle(2, 1, 3, 1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '18px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      AI GRID INTERFACE
    </div>
  );

  // Helper function for grid cell styling
  const getGridCellStyle = (col, row, spanCols = 1, spanRows = 1) => ({
    gridColumn: `${col} / span ${spanCols}`,
    gridRow: `${row} / span ${spanRows}`,
    position: 'relative',
    zIndex: 10
  });

  // UI Elements array
  const uiElements = [
    backButton,
    title,
    responseWindow,
    inputBox
  ];

  // Background component
  const backgroundComponent = <MatrixSpiralCanvas />;

  return (
    <GridPlay
      backgroundComponent={backgroundComponent}
      gridCols={gridCols}
      gridRows={gridRows}
      uiElements={uiElements}
    />
  );
};

export default AIInteraction; 