import React, { useState, useEffect, useRef } from 'react';
import GridPlay from './GridPlay';
import SceneViewer from './SceneViewer';
import { 
  createTitle,
  createWindow,
  createInputBox,
  gridConfigs,
  getGridCellStyle
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
  
  // Scene state management
  const [selectedScene, setSelectedScene] = useState(null);
  const [sceneLoading, setSceneLoading] = useState(false);
  const [sceneError, setSceneError] = useState(null);
  
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
    
    const message = `Welcome, seeker of wisdom.

You have crossed the digital desert to reach this sacred space.

From the sands of ${city}, at the hour of ${time}, 
you have chosen to seek knowledge beyond the ordinary.

Here, in this vault of consciousness, 
we explore the depths of thought, 
the mysteries of existence, 
and the infinite possibilities of the mind.

The spice of knowledge flows freely here.
Ancient wisdom whispers through the digital winds.
Every question opens a new path through the desert of understanding.

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

  // Welcome message window (G4.1-G7.3) - Dune style
  if (!hasStartedChat) {
    uiElements.push(
      React.createElement('div', {
        key: 'welcome-window',
        style: {
          ...getGridCellStyle(4, 1, 4, 3),
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(160, 82, 45, 0.05))',
          border: '1px solid rgba(210, 180, 140, 0.3)',
          borderRadius: '8px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#D2B48C',
          fontFamily: 'Georgia, serif',
          fontSize: '15px',
          lineHeight: '1.8',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(210, 180, 140, 0.4)',
          backdropFilter: 'blur(3px)',
          boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          zIndex: 20
        }
      }, getWelcomeMessage())
    );
  }

  // Chat messages window (G4.1-G7.3) - Dune style
  if (hasStartedChat) {
    uiElements.push(
      React.createElement('div', {
        key: 'chat-window',
        style: {
          ...getGridCellStyle(4, 1, 4, 3),
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(160, 82, 45, 0.03))',
          border: '1px solid rgba(210, 180, 140, 0.2)',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          overflowY: 'auto',
          maxHeight: '100%',
          color: '#D2B48C',
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          lineHeight: '1.7',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(2px)',
          boxShadow: '0 4px 16px rgba(139, 69, 19, 0.2)',
          zIndex: 20
        }
      }, [
        messages.length === 0 ? (
          React.createElement('div', {
            key: 'empty-state',
            style: { 
              color: '#CD853F', 
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '25px',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
              fontSize: '15px'
            }
          }, 'The Vault awaits your questions...')
        ) : (
          messages.map((message, index) => 
            React.createElement('div', {
              key: index,
              style: {
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                marginBottom: '12px'
              }
            }, [
              React.createElement('div', {
                key: 'message-content',
                style: {
                  backgroundColor: message.type === 'user' ? 'rgba(210, 180, 140, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                  border: `1px solid ${message.type === 'user' ? 'rgba(210, 180, 140, 0.3)' : 'rgba(160, 82, 45, 0.2)'}`,
                  borderRadius: '6px',
                  padding: '12px 16px',
                  color: message.type === 'user' ? '#F5DEB3' : '#D2B48C',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 8px rgba(139, 69, 19, 0.15)'
                }
              }, message.content),
              message.metadata && React.createElement('div', {
                key: 'metadata',
                style: { 
                  fontSize: '11px', 
                  color: '#CD853F', 
                  marginTop: '6px',
                  fontStyle: 'italic',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                }
              }, `${message.metadata.model} | ${message.metadata.responseTime}ms`)
            ])
          )
        ),
        isLoading && React.createElement('div', {
          key: 'loading',
          style: {
            alignSelf: 'flex-start',
            color: '#CD853F',
            fontSize: '13px',
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }
        }, 'Thoradin is thinking...'),
        React.createElement('div', { key: 'scroll-ref', ref: messagesEndRef })
      ])
    );
  }

  // Language choice buttons
  if (!hasStartedChat) {
    // Yes button (G4.7) - Dune style
    uiElements.push(
      React.createElement('div', {
        key: 'yes-button',
        onClick: () => handleLanguageChoice('yes'),
        style: {
          ...getGridCellStyle(4, 7, 1, 1),
          background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.15), rgba(160, 82, 45, 0.1))',
          border: '1px solid rgba(210, 180, 140, 0.4)',
          borderRadius: '6px',
          color: '#F5DEB3',
          fontSize: '14px',
          fontFamily: 'Georgia, serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
          zIndex: 25
        },
        onMouseEnter: (e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(210, 180, 140, 0.25), rgba(160, 82, 45, 0.2))';
          e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.5)';
          e.target.style.transform = 'scale(1.05)';
        },
        onMouseLeave: (e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(210, 180, 140, 0.15), rgba(160, 82, 45, 0.1))';
          e.target.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.3)';
          e.target.style.transform = 'scale(1)';
        }
      }, 'Yes')
    );

    // No, choose language button (G7.7) - Dune style
    uiElements.push(
      React.createElement('div', {
        key: 'no-button',
        onClick: () => handleLanguageChoice('no'),
        style: {
          ...getGridCellStyle(7, 7, 1, 1),
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.15), rgba(160, 82, 45, 0.1))',
          border: '1px solid rgba(160, 82, 45, 0.4)',
          borderRadius: '6px',
          color: '#D2B48C',
          fontSize: '11px',
          fontFamily: 'Georgia, serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
          zIndex: 25
        },
        onMouseEnter: (e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(139, 69, 19, 0.25), rgba(160, 82, 45, 0.2))';
          e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.5)';
          e.target.style.transform = 'scale(1.05)';
        },
        onMouseLeave: (e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(139, 69, 19, 0.15), rgba(160, 82, 45, 0.1))';
          e.target.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.3)';
          e.target.style.transform = 'scale(1)';
        }
      }, 'No, choose language')
    );
  }

  // Language selection grid - Dune style
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
            background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(160, 82, 45, 0.05))',
            border: '1px solid rgba(210, 180, 140, 0.3)',
            borderRadius: '4px',
            color: '#D2B48C',
            fontSize: '10px',
            fontFamily: 'Georgia, serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
            zIndex: 25
          },
          onMouseEnter: (e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(160, 82, 45, 0.15))';
            e.target.style.boxShadow = '0 4px 16px rgba(139, 69, 19, 0.4)';
            e.target.style.transform = 'scale(1.1)';
          },
          onMouseLeave: (e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(160, 82, 45, 0.05))';
            e.target.style.boxShadow = '0 2px 8px rgba(139, 69, 19, 0.2)';
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

  // Scene click handler
  const handleSceneClick = async (gridId) => {
    setSceneLoading(true);
    setSceneError(null);
    setSelectedScene(null);

    try {
      const apiBaseUrl = getApiBaseUrl();
      if (!apiBaseUrl) {
        throw new Error('API base URL not configured');
      }

      const response = await fetch(`${apiBaseUrl}/api/scene/${gridId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch scene for ${gridId}`);
      }

      setSelectedScene(data.data);
    } catch (err) {
      console.error('Error fetching scene:', err);
      setSceneError(err.message);
    } finally {
      setSceneLoading(false);
    }
  };

  // Close scene viewer
  const handleCloseScene = () => {
    setSelectedScene(null);
    setSceneError(null);
  };

  // Create grid actions for scene clicks
  const gridActions = [];
  
  // Add scene click handlers for all grid tiles (G1.1 to G11.7)
  for (let row = 1; row <= 11; row++) {
    for (let col = 1; col <= 7; col++) {
      const gridId = `G${row}.${col}`;
      const index = (row - 1) * 7 + (col - 1);
      gridActions[index] = () => handleSceneClick(gridId);
    }
  }

  return (
    <GridPlay
      backgroundComponent={<StarryBackground />}
      gridCols={gridConfigs.standard.gridCols}
      gridRows={gridConfigs.standard.gridRows}
      uiElements={uiElements}
      gridActions={gridActions}
      showSceneViewer={true}
    />
  );
};

export default VaultInteraction; 