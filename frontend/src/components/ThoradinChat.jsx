import React, { useState, useRef, useEffect } from 'react';

const ThoradinChat = ({ onSendMessage, isVisible = true }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'thoradin',
      text: "Welcome, traveler. I am Thoradin, guardian of this vault. What knowledge do you seek?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Call the parent's onSendMessage function
      if (onSendMessage) {
        const response = await onSendMessage(message.trim());
        
        const thoradinResponse = {
          id: Date.now() + 1,
          sender: 'thoradin',
          text: response || "I hear your words, but the meaning eludes me. Speak clearly, seeker.",
          timestamp: new Date()
        };

        setMessages(prev => [...prev, thoradinResponse]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        sender: 'thoradin',
        text: "The ancient magic is disturbed. Try again, mortal.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      maxWidth: '90vw',
      zIndex: 1000,
      backgroundColor: 'rgba(26, 15, 15, 0.95)',
      border: '2px solid #4a3c2a',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Messages Area */}
      <div style={{
        height: '300px',
        overflowY: 'auto',
        padding: '15px',
        borderBottom: '1px solid #4a3c2a'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: msg.sender === 'user' 
                ? 'rgba(255, 215, 0, 0.2)' 
                : 'rgba(0, 170, 255, 0.2)',
              border: `1px solid ${msg.sender === 'user' ? '#ffd700' : '#00aaff'}`,
              color: '#ffffff',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {msg.text}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#888',
              marginTop: '2px',
              opacity: 0.7
            }}>
              {msg.sender === 'user' ? 'You' : 'Thoradin'} • {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '10px'
          }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 170, 255, 0.2)',
              border: '1px solid #00aaff',
              color: '#ffffff',
              fontSize: '14px'
            }}>
              <span style={{ animation: 'pulse 1.5s infinite' }}>
                Thoradin is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={{
        padding: '15px',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Thoradin anything..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 12px',
            backgroundColor: 'rgba(42, 26, 26, 0.8)',
            border: '1px solid #4a3c2a',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ffd700';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#4a3c2a';
          }}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffd700',
            border: 'none',
            borderRadius: '4px',
            color: '#1a0f0f',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            opacity: (!message.trim() || isLoading) ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (message.trim() && !isLoading) {
              e.target.style.backgroundColor = '#ffed4e';
            }
          }}
          onMouseLeave={(e) => {
            if (message.trim() && !isLoading) {
              e.target.style.backgroundColor = '#ffd700';
            }
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ThoradinChat; 