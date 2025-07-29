import React, { useState, useRef, useEffect } from 'react';
import GridPageTemplate from './GridPageTemplate';
import { PAGES } from '../utils/gridActionSystem';
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
    if (envUrl) {
      console.log('Using API URL:', envUrl);
      return envUrl;
    }
    const fallbackUrl = 'http://localhost:3001';
    console.log('Using fallback API URL:', fallbackUrl);
    return fallbackUrl;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
        }
      } catch (error) {
        console.warn('API connection test failed:', error);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${getApiBaseUrl()}/api/ai/chat`, {
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
      
      if (error.name === 'AbortError') {
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

  // Create UI elements using the template system
  const backButton = createBackButton(() => window.location.href = '/');
  const title = createTitle("DIGITAL VAULT INTERFACE");
  const statusIndicator = createStatusIndicator(connectionStatus);
  
  // Create response window content
  const responseWindowContent = (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      marginBottom: '10px',
      paddingRight: '10px'
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

  const responseWindow = createWindow(responseWindowContent, 5, 1, 3, 4);
  
  const inputBox = createInputBox(
    inputRef,
    inputValue,
    (e) => setInputValue(e.target.value),
    handleSubmit,
    connectionStatus === 'connected' ? "Ask the vault anything..." : "Vault disconnected - check connection",
    isLoading || connectionStatus !== 'connected'
  );

  // Assemble UI elements
  const uiElements = [
    backButton,
    title,
    statusIndicator,
    responseWindow,
    inputBox
  ];

  // Context for vault page (mostly empty since vault is non-interactive)
  const vaultContext = {
    // Add any vault-specific context here if needed
  };

  return (
    <GridPageTemplate
      pageId={PAGES.VAULT}
      context={vaultContext}
      uiElements={uiElements}
      backgroundComponent={<StarryBackground />}
      pageName="Digital Vault"
    />
  );
};

export default VaultInteraction; 