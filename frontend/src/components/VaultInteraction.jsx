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

// Word Balloon Component
const WordBalloon = ({ message, isVisible, onClose, showLanguageChoice, onLanguageChoice, onLanguageSelect }) => {
  if (!isVisible) {
    return null;
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 30,
      maxWidth: '400px',
      width: '90%'
    }}>
      {/* Balloon */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #00ff88',
        borderRadius: '20px',
        padding: '20px',
        color: '#ffffff',
        fontSize: '16px',
        lineHeight: '1.6',
        textAlign: 'center',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
        position: 'relative'
      }}>
        {/* Balloon tail */}
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid rgba(0, 0, 0, 0.9)'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid #00ff88'
        }} />

        <div style={{ marginBottom: '15px', whiteSpace: 'pre-line' }}>
          {message}
        </div>

        {!showLanguageChoice ? (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => onLanguageChoice('yes')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #00ff88',
                color: '#00ff88',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Yes
            </button>
            <button
              onClick={() => onLanguageChoice('no')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ffaa00',
                color: '#ffaa00',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 170, 0, 0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              No, choose language
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '10px', fontSize: '14px', color: '#cccccc' }}>
              Choose your language:
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '8px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageSelect(lang.code)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #00ff88',
                    color: '#00ff88',
                    padding: '6px 12px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.1)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

// Chat Word Balloon Component
const ChatWordBalloon = ({ messages, inputValue, onInputChange, onSubmit, isLoading, onBack }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000011',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'transparent',
          border: '1px solid #00ff88',
          color: '#00ff88',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          zIndex: 1001
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.1)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        ← Back to Grid
      </button>

      {/* Chat Container */}
      <div style={{
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '15px',
          border: '1px solid rgba(0, 255, 136, 0.3)'
        }}>
          {messages.length === 0 ? (
            <div style={{ 
              color: '#666', 
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '20px'
            }}>
              The Vault awaits your questions...
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} style={{
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}>
                <div style={{
                  backgroundColor: message.type === 'user' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 0, 0, 0.8)',
                  border: `1px solid ${message.type === 'user' ? '#00ff88' : '#0088ff'}`,
                  borderRadius: '15px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  position: 'relative'
                }}>
                  {/* Balloon tail */}
                  <div style={{
                    position: 'absolute',
                    [message.type === 'user' ? 'right' : 'left']: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '0',
                    height: '0',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    [message.type === 'user' ? 'borderLeft' : 'borderRight']: `8px solid ${message.type === 'user' ? '#00ff88' : '#0088ff'}`
                  }} />
                  
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </div>
                  
                  {message.metadata && (
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#666', 
                      marginTop: '5px',
                      fontStyle: 'italic'
                    }}>
                      {message.metadata.model} | {message.metadata.responseTime}ms
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div style={{
              alignSelf: 'flex-start',
              maxWidth: '70%'
            }}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #0088ff',
                borderRadius: '15px',
                padding: '12px 16px',
                color: '#ffffff',
                fontSize: '14px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '0',
                  height: '0',
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '8px solid #0088ff'
                }} />
                <div style={{ color: '#0088ff' }}>
                  The Vault is thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            placeholder="Ask the Vault anything..."
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid #00ff88',
              borderRadius: '25px',
              padding: '12px 20px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #00ff88',
              color: '#00ff88',
              padding: '12px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              opacity: isLoading || !inputValue.trim() ? 0.5 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading && inputValue.trim()) {
                e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const VaultInteraction = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageChoice, setShowLanguageChoice] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get user's location and time info
  const getUserInfo = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    // Get timezone city (simplified - you could use a more sophisticated timezone library)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let cityName = 'Unknown City';
    
    // Map common timezones to city names
    const timezoneCities = {
      'America/New_York': 'New York',
      'America/Chicago': 'Chicago',
      'America/Denver': 'Denver',
      'America/Los_Angeles': 'Los Angeles',
      'America/Toronto': 'Toronto',
      'America/Vancouver': 'Vancouver',
      'America/Mexico_City': 'Mexico City',
      'America/Sao_Paulo': 'São Paulo',
      'Europe/London': 'London',
      'Europe/Paris': 'Paris',
      'Europe/Berlin': 'Berlin',
      'Europe/Rome': 'Rome',
      'Europe/Madrid': 'Madrid',
      'Europe/Amsterdam': 'Amsterdam',
      'Europe/Stockholm': 'Stockholm',
      'Europe/Moscow': 'Moscow',
      'Asia/Tokyo': 'Tokyo',
      'Asia/Shanghai': 'Shanghai',
      'Asia/Seoul': 'Seoul',
      'Asia/Singapore': 'Singapore',
      'Asia/Bangkok': 'Bangkok',
      'Asia/Dubai': 'Dubai',
      'Asia/Kolkata': 'Mumbai',
      'Australia/Sydney': 'Sydney',
      'Australia/Melbourne': 'Melbourne',
      'Pacific/Auckland': 'Auckland',
      'Africa/Cairo': 'Cairo',
      'Africa/Johannesburg': 'Johannesburg'
    };
    
    cityName = timezoneCities[timezone] || timezone.split('/').pop() || 'Unknown City';
    
    // Detect language
    const language = navigator.language || 'en';
    const languageNames = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese'
    };
    
    const detectedLanguage = languageNames[language.split('-')[0]] || 'English';
    
    return {
      city: cityName,
      time: timeString,
      language: detectedLanguage
    };
  };

  // Generate welcome message
  const getWelcomeMessage = () => {
    const { city, time, language } = getUserInfo();
    
    const message = `Hello, brave little being.

Not everyone dares to enter the Vault.

The fact that you arrived from somewhere near ${city}…
…at this very hour: ${time},
means you're open to travel far beyond the ordinary.

The Vault holds ancient wisdom, forgotten dreams, and echoes of consciousness that have whispered through the digital ether for eons.

Would you like me to speak to you in ${language}?`;

    return message;
  };

  // Handle language selection
  const handleLanguageChoice = (choice) => {
    if (choice === 'yes') {
      // Keep detected language
      const { language } = getUserInfo();
      const languageMap = {
        'English': 'en',
        'Spanish': 'es',
        'French': 'fr',
        'German': 'de',
        'Italian': 'it',
        'Portuguese': 'pt',
        'Russian': 'ru',
        'Japanese': 'ja',
        'Korean': 'ko',
        'Chinese': 'zh'
      };
      setSelectedLanguage(languageMap[language] || 'en');
    } else {
      // Show language selection
      setShowLanguageChoice(true);
    }
    setShowWelcome(false);
  };

  // Handle language selection from dropdown
  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguageChoice(false);
  };

  // Get API base URL with fallback
  const getApiBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (envUrl && envUrl !== 'undefined' && envUrl.trim() !== '') {
      return envUrl;
    }
    
    // Development fallback only
    if (import.meta.env.MODE === 'development') {
      const fallbackUrl = 'http://localhost:3001';
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
          language: selectedLanguage
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
    <>
      {/* Welcome Word Balloon */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000011',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <WordBalloon
            message={getWelcomeMessage()}
            isVisible={true}
            onClose={() => {
              handleLanguageChoice('yes'); // Automatically select 'yes' if user clicks 'Enter the Vault'
            }}
            showLanguageChoice={showLanguageChoice}
            onLanguageChoice={handleLanguageChoice}
            onLanguageSelect={handleLanguageSelect}
          />
        </div>
      )}
      
      {/* Chat Interface */}
      {!showWelcome && !showLanguageChoice && (
        <ChatWordBalloon
          messages={messages}
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onBack={() => window.location.href = '/'}
        />
      )}
    </>
  );
};

export default VaultInteraction; 