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

  // Welcome message window (G1.1-G3.4) - Matrix style
  if (!hasStartedChat) {
    uiElements.push(
      React.createElement('div', {
        key: 'welcome-window',
        style: {
          ...getGridCellStyle(1, 1, 3, 3),
          backgroundColor: 'transparent',
          border: 'none',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#00ffcc',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.6',
          textShadow: '0 0 10px #00ffcc',
          backdropFilter: 'blur(2px)',
          zIndex: 20
        }
      }, getWelcomeMessage())
    );
  }

  // Chat messages window (G1.1-G3.4) - Matrix style
  if (hasStartedChat) {
    uiElements.push(
      React.createElement('div', {
        key: 'chat-window',
        style: {
          ...getGridCellStyle(1, 1, 3, 3),
          backgroundColor: 'transparent',
          border: 'none',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          overflowY: 'auto',
          maxHeight: '100%',
          color: '#00ffcc',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.5',
          textShadow: '0 0 5px #00ffcc',
          zIndex: 20
        }
      }, [
        messages.length === 0 ? (
          React.createElement('div', {
            key: 'empty-state',
            style: { 
              color: '#00ff88', 
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '20px',
              textShadow: '0 0 8px #00ff88'
            }
          }, 'The Vault awaits your questions...')
        ) : (
          messages.map((message, index) => 
            React.createElement('div', {
              key: index,
              style: {
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                marginBottom: '10px'
              }
            }, [
              React.createElement('div', {
                key: 'message-content',
                style: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 0',
                  color: message.type === 'user' ? '#00ff88' : '#00ffcc',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  textShadow: message.type === 'user' ? '0 0 6px #00ff88' : '0 0 6px #00ffcc',
                  whiteSpace: 'pre-line'
                }
              }, message.content),
              message.metadata && React.createElement('div', {
                key: 'metadata',
                style: { 
                  fontSize: '10px', 
                  color: '#00ff66', 
                  marginTop: '4px',
                  fontStyle: 'italic',
                  textShadow: '0 0 4px #00ff66'
                }
              }, `${message.metadata.model} | ${message.metadata.responseTime}ms`)
            ])
          )
        ),
        isLoading && React.createElement('div', {
          key: 'loading',
          style: {
            alignSelf: 'flex-start',
            color: '#00ff88',
            fontSize: '12px',
            fontStyle: 'italic',
            textShadow: '0 0 6px #00ff88'
          }
        }, 'Thoradin is thinking...'),
        React.createElement('div', { key: 'scroll-ref', ref: messagesEndRef })
      ])
    );
  }

  // Language choice buttons
  if (!hasStartedChat) {
    // Yes button (G4.7) - Matrix style
    uiElements.push(
      React.createElement('div', {
        key: 'yes-button',
        onClick: () => handleLanguageChoice('yes'),
        style: {
          ...getGridCellStyle(4, 7, 1, 1),
          backgroundColor: 'transparent',
          border: 'none',
          color: '#00ff88',
          fontSize: '14px',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          textShadow: '0 0 8px #00ff88',
          transition: 'all 0.3s ease',
          zIndex: 25
        },
        onMouseEnter: (e) => {
          e.target.style.textShadow = '0 0 15px #00ff88, 0 0 25px #00ff88';
          e.target.style.transform = 'scale(1.05)';
        },
        onMouseLeave: (e) => {
          e.target.style.textShadow = '0 0 8px #00ff88';
          e.target.style.transform = 'scale(1)';
        }
      }, 'Yes')
    );

    // No, choose language button (G7.7) - Matrix style
    uiElements.push(
      React.createElement('div', {
        key: 'no-button',
        onClick: () => handleLanguageChoice('no'),
        style: {
          ...getGridCellStyle(7, 7, 1, 1),
          backgroundColor: 'transparent',
          border: 'none',
          color: '#00ffcc',
          fontSize: '12px',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          textShadow: '0 0 8px #00ffcc',
          transition: 'all 0.3s ease',
          zIndex: 25
        },
        onMouseEnter: (e) => {
          e.target.style.textShadow = '0 0 15px #00ffcc, 0 0 25px #00ffcc';
          e.target.style.transform = 'scale(1.05)';
        },
        onMouseLeave: (e) => {
          e.target.style.textShadow = '0 0 8px #00ffcc';
          e.target.style.transform = 'scale(1)';
        }
      }, 'No, choose language')
    );
  }

  // Language selection grid - Matrix style
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
            border: 'none',
            color: '#00ff88',
            fontSize: '11px',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textShadow: '0 0 6px #00ff88',
            transition: 'all 0.3s ease',
            zIndex: 25
          },
          onMouseEnter: (e) => {
            e.target.style.textShadow = '0 0 12px #00ff88, 0 0 20px #00ff88';
            e.target.style.transform = 'scale(1.1)';
          },
          onMouseLeave: (e) => {
            e.target.style.textShadow = '0 0 6px #00ff88';
            e.target.style.transform = 'scale(1)';
          }
        }, lang.name)
      );
    });
  }

  // Input field (G4.6-G7.6) - show when chat has started or language choice is active
  if (hasStartedChat || showLanguageChoice) {
    uiElements.push(
      createInputBox(
        inputRef,
        inputValue,
        (e) => setInputValue(e.target.value),
        handleSubmit,
        'Ask Thoradin anything...',
        isLoading,
        4, 6, 4
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