import React, { useState, useEffect, useRef } from 'react';
import GridPlay from './GridPlay';
import { 
  createButton,
  createTitle,
  createWindow,
  createInputBox,
  createSpinner,
  gridConfigs,
  getGridCellStyle,
  createBackButton
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
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageChoice, setShowLanguageChoice] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
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
    setHasStartedChat(true);
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
    
    if (import.meta.env.MODE === 'development') {
      const fallbackUrl = 'http://localhost:3001';
      return fallbackUrl;
    }
    
    return null;
  };

  // Test connection
  useEffect(() => {
    const testConnection = async () => {
      const apiUrl = getApiBaseUrl();
      if (!apiUrl) {
        setConnectionStatus('disconnected');
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${apiUrl}/api/health`, {
          method: 'GET',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    testConnection();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    try {
      const apiUrl = getApiBaseUrl();
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: selectedLanguage
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          type: 'vault',
          content: data.response,
          timestamp: new Date().toISOString(),
          metadata: {
            model: data.model,
            responseTime: data.responseTime
          }
        }]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        type: 'vault',
        content: 'I am here to guide you through the digital realm. What would you like to explore?',
        timestamp: new Date().toISOString(),
        metadata: {
          model: 'fallback',
          responseTime: 0
        }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create grid elements
  const uiElements = [];

  // Welcome message window (G1.1-G3.4)
  if (!hasStartedChat) {
    uiElements.push(
      createWindow(
        getWelcomeMessage(),
        1, 1, 3, 3,
        'Welcome to the Vault'
      )
    );
  }

  // Chat messages window (G1.1-G3.4)
  if (hasStartedChat) {
    uiElements.push(
      createWindow(
        (
          <div style={{ 
            height: '100%', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
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
                  maxWidth: '80%'
                }}>
                  <div style={{
                    backgroundColor: message.type === 'user' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 0, 0, 0.8)',
                    border: `1px solid ${message.type === 'user' ? '#00ff88' : '#0088ff'}`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}>
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {message.content}
                    </div>
                    {message.metadata && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#666', 
                        marginTop: '4px',
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
                maxWidth: '80%'
              }}>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #0088ff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#0088ff',
                  fontSize: '12px'
                }}>
                  Thoradin is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ),
        1, 1, 3, 3,
        'Thoradin Vault'
      )
    );
  }

  // Language choice buttons
  if (!hasStartedChat) {
    // Yes button (G4.7)
    uiElements.push(
      React.createElement('div', {
        key: 'yes-button',
        onClick: () => handleLanguageChoice('yes'),
        style: {
          ...getGridCellStyle(7, 4, 1, 1),
          backgroundColor: 'transparent',
          border: '1px solid #00ff88',
          color: '#00ff88',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '5px'
        }
      }, 'Yes')
    );

    // No, choose language button (G7.7)
    uiElements.push(
      React.createElement('div', {
        key: 'no-button',
        onClick: () => handleLanguageChoice('no'),
        style: {
          ...getGridCellStyle(7, 7, 1, 1),
          backgroundColor: 'transparent',
          border: '1px solid #ffaa00',
          color: '#ffaa00',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '5px'
        }
      }, 'No, choose language')
    );
  }

  // Language selection grid
  if (showLanguageChoice) {
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

    languages.forEach((lang, index) => {
      const row = Math.floor(index / 2) + 1;
      const col = (index % 2) + 1;
      
      uiElements.push(
        React.createElement('div', {
          key: `lang-${lang.code}`,
          onClick: () => handleLanguageSelect(lang.code),
          style: {
            ...getGridCellStyle(col, row, 1, 1),
            backgroundColor: 'transparent',
            border: '1px solid #00ff88',
            color: '#00ff88',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '3px'
          }
        }, lang.name)
      );
    });
  }

  // Input field (G4.5-G4.7)
  if (hasStartedChat) {
    uiElements.push(
      createInputBox(
        inputRef,
        inputValue,
        (e) => setInputValue(e.target.value),
        handleSubmit,
        'Ask Thoradin anything...',
        isLoading,
        5, 4, 3
      )
    );
  }

  // Back button
  uiElements.push(
    createBackButton(() => window.location.href = '/')
  );

  // No grid actions (disable clicks)
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