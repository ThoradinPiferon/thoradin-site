import React, { useState, useRef, useEffect } from 'react';
import GridPlay from './GridPlay';
import { 
  createBackButton, 
  createTitle, 
  createStatusIndicator, 
  createWindow, 
  createInputBox,
  createLoadingSpinner,
  gridConfigs
} from '../utils/gridElements';

// Starry Background Component
const StarryBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stars = [];
    const numStars = 200;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        brightness: Math.random()
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move stars
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000011',
        zIndex: 1
      }}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

const VaultInteraction = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get API base URL with fallback
  const getApiBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    console.log('Environment variable VITE_API_BASE_URL:', envUrl);
    
    if (envUrl && envUrl !== 'undefined' && envUrl.trim() !== '') {
      console.log('Using API URL:', envUrl);
      return envUrl;
    }
    
    // Development fallback only
    if (import.meta.env.MODE === 'development') {
      const fallbackUrl = 'http://localhost:3001';
      console.log('Using development fallback URL:', fallbackUrl);
      return fallbackUrl;
    }
    
    // Production: require environment variable
    console.error('VITE_API_BASE_URL is not set in production. Please configure this environment variable.');
    return null;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test API connection on component mount
  useEffect(() => {
    // Log all environment variables for debugging
    console.log('All environment variables:', import.meta.env);
    console.log('VITE_API_BASE_URL specifically:', import.meta.env.VITE_API_BASE_URL);
    console.log('MODE:', import.meta.env.MODE);
    
    // Test URL construction
    const apiUrl = getApiBaseUrl();
    
    if (!apiUrl) {
      console.error('No API URL available. Please set VITE_API_BASE_URL environment variable.');
      setConnectionStatus('disconnected');
      return;
    }
    
    const healthUrl = `${apiUrl}/api/health`;
    console.log('Constructed health check URL:', healthUrl);
    
    const testConnection = async () => {
      console.log('Testing connection to:', apiUrl);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Health check response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Health check response:', data);
          setConnectionStatus('connected');
        } else {
          console.error('Health check failed with status:', response.status);
          setConnectionStatus('error');
        }
      } catch (error) {
        console.error('API connection test failed:', error);
        if (error.name === 'AbortError') {
          console.error('Request timed out');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network error - possible CORS or mixed content issue');
        }
        setConnectionStatus('disconnected');
      }
    };

    testConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { type: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    try {
      const apiUrl = getApiBaseUrl();
      if (!apiUrl) {
        throw new Error('API URL not configured. Please set VITE_API_BASE_URL environment variable.');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          language: 'en'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const vaultMessage = { 
          type: 'vault', 
          content: data.response || data.message || 'I received your message but had trouble processing it.', 
          timestamp: new Date(),
          metadata: {
            model: data.model,
            responseTime: data.responseTime,
            language: data.language
          }
        };
        setMessages(prev => [...prev, vaultMessage]);
        setConnectionStatus('connected');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = { 
          type: 'error', 
          content: errorData.message || `Server error (${response.status}). Please try again.`, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMessage]);
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Vault Chat Error:', error);
      
      let errorContent = 'Connection error. Please check your internet connection.';
      
      if (error.message.includes('API URL not configured')) {
        errorContent = 'Backend URL not configured. Please set VITE_API_BASE_URL environment variable.';
      } else if (error.name === 'AbortError') {
        errorContent = 'Request timed out. Please try again.';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorContent = 'Cannot connect to vault service. Please check your connection.';
      }
      
      const errorMessage = { 
        type: 'error', 
        content: errorContent, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  // Create response window content
  const responseWindowContent = (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      maxHeight: '400px', // Add max height to ensure scrolling
      marginBottom: '10px',
      paddingRight: '10px',
      scrollBehavior: 'smooth' // Smooth scrolling
    }}>
      {messages.length === 0 ? (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Welcome to the Digital Vault Interface. Ask me anything about consciousness, creativity, or the digital realm...
          {connectionStatus !== 'connected' && (
            <div style={{ color: '#ffaa00', marginTop: '10px' }}>
              ⚠ Connection status: {connectionStatus}
            </div>
          )}
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={index} style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: message.type === 'user' ? 'rgba(0, 255, 0, 0.1)' : 
                           message.type === 'vault' ? 'rgba(0, 0, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)',
            borderLeft: `3px solid ${message.type === 'user' ? '#00ff00' : 
                                   message.type === 'vault' ? '#0088ff' : '#ff0000'}`
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '5px',
              color: message.type === 'user' ? '#00ff00' : 
                     message.type === 'vault' ? '#0088ff' : '#ff0000'
            }}>
              {message.type === 'user' ? 'You' : message.type === 'vault' ? 'Vault' : 'System'}
            </div>
            <div style={{ lineHeight: '1.4' }}>
              {message.content}
            </div>
            {message.metadata && (
              <div style={{ 
                fontSize: '10px', 
                color: '#666', 
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                Model: {message.metadata.model} | Time: {message.metadata.responseTime}ms
              </div>
            )}
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
      {isLoading && createLoadingSpinner("Vault is processing...")}
      <div ref={messagesEndRef} />
    </div>
  );

  // Create UI elements that will be positioned within the grid
  const backButton = createBackButton(() => window.location.href = '/');
  const title = createTitle("DIGITAL VAULT INTERFACE");
  const statusIndicator = createStatusIndicator(connectionStatus);
  const responseWindow = createWindow(responseWindowContent, 5, 1, 3, 4);
  
  // Create input box as a UI element within the grid
  const inputBox = createInputBox(
    inputRef,
    inputValue,
    (e) => setInputValue(e.target.value),
    handleSubmit,
    connectionStatus === 'connected' ? "Ask the vault anything..." : "Vault disconnected - check connection",
    isLoading || connectionStatus !== 'connected'
  );

  // Assemble UI elements (Layer 3 - within grid structure)
  const uiElements = [
    backButton,
    title,
    statusIndicator,
    responseWindow,
    inputBox
  ];

  // No grid actions for vault page (non-interactive grid)
  const gridActions = [];

  return (
    <GridPlay
      backgroundComponent={<StarryBackground />}
      gridCols={gridConfigs.standard.gridCols}
      gridRows={gridConfigs.standard.gridRows}
      uiElements={uiElements}
      gridActions={gridActions}
    />
  );
};

export default VaultInteraction; 