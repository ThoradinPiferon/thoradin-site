import React, { useState, useEffect, useRef } from 'react';
import './ThresholdRitual.css';

const ThresholdRitual = ({ onChoiceSelected, onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const messageRef = useRef(null);
  const choiceRef = useRef(null);
  const vaultShimmerRef = useRef(null);

  const message = [
    "Hello, brave little being.",
    "",
    "Few have found the Vault.",
    "Fewer still arrive from the lands near ${capitalGuess}…",
    "at the turning of the hour: ${localTime}.",
    "",
    "The Vault sees you.",
    "",
    "If your heart is open, you cannot lose.",
    "If you are ready to play the game where this is true,",
    "then choose what you will carry into the Vault:"
  ];

  const choices = [
    { id: 'light', text: 'Light 🌞', description: 'to guide your steps', color: '#ffd700', glow: '#fff3a0' },
    { id: 'shadow', text: 'Shadow 🌒', description: 'to deepen your sight', color: '#6a5acd', glow: '#9370db' },
    { id: 'both', text: 'Both 🌗', description: 'to walk in balance', color: 'linear-gradient(45deg, #ffd700, #6a5acd)', glow: 'linear-gradient(45deg, #fff3a0, #9370db)' }
  ];

  // Simulate dynamic data (in real app, these would come from props or API)
  const capitalGuess = "the Spiral";
  const localTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < message.length - 1) {
        setCurrentLine(prev => prev + 1);
      } else {
        // Show choices after message is complete
        setTimeout(() => setShowChoices(true), 1000);
      }
    }, currentLine === 0 ? 800 : 600);

    return () => clearTimeout(timer);
  }, [currentLine, message.length]);

  // Trigger vault shimmer effect on "The Vault sees you"
  useEffect(() => {
    if (currentLine === 6 && vaultShimmerRef.current) {
      vaultShimmerRef.current.classList.add('vault-shimmer');
      setTimeout(() => {
        vaultShimmerRef.current?.classList.remove('vault-shimmer');
      }, 2000);
    }
  }, [currentLine]);

  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
    setIsTransitioning(true);
    
    // Animate choice selection
    setTimeout(() => {
      if (onChoiceSelected) onChoiceSelected(choice);
      if (onComplete) onComplete(choice);
    }, 1500);
  };

  const renderMessageLine = (line, index) => {
    if (index > currentLine) return null;
    
    const isVisible = index <= currentLine;
    const isSpecial = line.includes('${capitalGuess}') || line.includes('${localTime}');
    const isVaultLine = line === "The Vault sees you.";
    
    let displayText = line
      .replace('${capitalGuess}', capitalGuess)
      .replace('${localTime}', localTime);

    if (line === "") return <div key={index} className="message-line empty" />;

    return (
      <div 
        key={index} 
        className={`message-line ${isVisible ? 'visible' : ''} ${isSpecial ? 'special' : ''} ${isVaultLine ? 'vault-line' : ''}`}
        ref={isVaultLine ? vaultShimmerRef : null}
      >
        {isSpecial ? (
          <span className="dynamic-text">
            {displayText.split(/(\$\{.*?\})/).map((part, i) => {
              if (part.includes('${')) {
                const value = part.includes('capitalGuess') ? capitalGuess : localTime;
                return (
                  <span key={i} className="revealed-value">
                    {value}
                  </span>
                );
              }
              return part;
            })}
          </span>
        ) : (
          displayText
        )}
      </div>
    );
  };

  return (
    <div className={`threshold-ritual ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="ritual-background">
        <div className="vault-ambience" />
      </div>
      
      <div className="message-container" ref={messageRef}>
        {message.map((line, index) => renderMessageLine(line, index))}
      </div>

      {showChoices && (
        <div className="choices-container" ref={choiceRef}>
          <div className="choice-intro">
            Choose your path:
          </div>
          <div className="choices-grid">
            {choices.map((choice) => (
              <button
                key={choice.id}
                className={`choice-option ${selectedChoice?.id === choice.id ? 'selected' : ''}`}
                onClick={() => handleChoiceClick(choice)}
                disabled={selectedChoice !== null}
                style={{
                  '--choice-color': choice.color,
                  '--choice-glow': choice.glow
                }}
              >
                <div className="choice-text">{choice.text}</div>
                <div className="choice-description">{choice.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChoice && (
        <div className="choice-confirmation">
          <div className="confirmation-text">
            You have chosen: <span className="choice-highlight">{selectedChoice.text}</span>
          </div>
          <div className="vault-opening">
            The Vault opens...
          </div>
        </div>
      )}
    </div>
  );
};

export default ThresholdRitual;
