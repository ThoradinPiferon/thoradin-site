import React, { useState, useEffect } from 'react';

const LayeredInterface = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [greenIntensity, setGreenIntensity] = useState(255); // Start bright
  const [characterFlickers, setCharacterFlickers] = useState({}); // Individual character flickers
  const [loadTime, setLoadTime] = useState(Date.now()); // Track load time

  // Grid configuration
  const gridRows = 7;
  const gridCols = 11;

  // Animation effects
  useEffect(() => {
    setLoadTime(Date.now()); // Set load time when component mounts
    
    const rotationInterval = setInterval(() => {
      setRotationAngle(prev => prev + 0.02);
    }, 50);

    // Individual character flicker animation
    const characterFlickerInterval = setInterval(() => {
      setCharacterFlickers(prev => {
        const newFlickers = { ...prev };
        // Update random characters with random flicker values
        const numToUpdate = Math.floor(Math.random() * 10) + 5; // Update 5-15 characters per frame
        for (let i = 0; i < numToUpdate; i++) {
          const charId = Math.floor(Math.random() * 1000); // Random character ID
          newFlickers[charId] = Math.random() * 0.4 + 0.6; // Random opacity between 0.6 and 1.0
        }
        return newFlickers;
      });
    }, 50);

    // Add green intensity animation - start bright, fade to dark
    const greenInterval = setInterval(() => {
      setGreenIntensity(prev => {
        const timeSinceLoad = (Date.now() - loadTime) * 0.001; // Time since load in seconds
        const fadeDuration = 3; // 3 seconds to fade from bright to dark
        
        if (timeSinceLoad < fadeDuration) {
          // Fade from bright (255) to dark (100) over 3 seconds
          const fadeProgress = timeSinceLoad / fadeDuration;
          return Math.floor(255 - (fadeProgress * 155)); // 255 to 100
        } else {
          // After fade, continue with normal sine wave oscillation
          const time = Date.now() * 0.001; // Slow oscillation
          const sine = Math.sin(time * 0.5); // Slower frequency
          // Map sine wave (-1 to 1) to green intensity (100 to 255)
          return Math.floor(100 + (sine + 1) * 77.5); // 100 to 255 range
        }
      });
    }, 50);

    return () => {
      clearInterval(rotationInterval);
      clearInterval(characterFlickerInterval);
      clearInterval(greenInterval);
    };
  }, [loadTime]);

  // Layer 1: Background Layer
  const BackgroundLayer = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charArray = chars.split('');
    
    // Generate Fibonacci sequence
    const generateFibonacci = (max) => {
      const fib = [0, 1];
      while (fib[fib.length - 1] + fib[fib.length - 2] <= max) {
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
      }
      return fib;
    };
    
    const fibonacci = generateFibonacci(charArray.length);
    
    // Draw static spiral
    const drawSpiral = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const maxRadius = Math.max(window.innerWidth, window.innerHeight) / 2;
      const minRadius = 10;
      
      let currentRadius = maxRadius;
      let currentAngle = 0; // Start from 0, rotation applied to entire spiral
      const angleStep = 0.08;
      const radiusDecay = 0.998;
      let charIndex = 0;
      
      const spiralElements = [];
      
      while (currentRadius > minRadius) {
        // Apply rotation to the entire spiral pattern
        const rotatedAngle = currentAngle + rotationAngle;
        const x = centerX + Math.cos(rotatedAngle) * currentRadius;
        const y = centerY + Math.sin(rotatedAngle) * currentRadius;
        
        if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
          const fibIndex = charIndex % fibonacci.length;
          const char = charArray[fibonacci[fibIndex] % charArray.length];
          
          const sizeRatio = currentRadius / maxRadius;
          const minSize = 8;
          const maxSize = 32;
          const size = minSize + (maxSize - minSize) * sizeRatio;
          
          const charId = charIndex; // Unique ID for each character
          const baseOpacity = Math.random() * 0.08 + 0.8;
          const individualFlicker = characterFlickers[charId] || 1; // Get individual flicker or default to 1
          const finalOpacity = baseOpacity * individualFlicker; // Apply individual flicker
          
          spiralElements.push({
            char,
            x,
            y,
            size,
            opacity: finalOpacity,
            charId: charId
          });
          
          charIndex++;
        }
        
        currentAngle += angleStep;
        currentRadius *= radiusDecay;
      }
      
      return spiralElements;
    };
    
    const spiralElements = drawSpiral();
    
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'black'
      }}>
        {spiralElements.map((element, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              fontSize: `${element.size}px`,
              color: `rgb(0, ${Math.floor(greenIntensity * element.opacity)}, 0)`,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              transform: 'translate(-50%, -50%)',
              userSelect: 'none'
            }}
          >
            {element.char}
          </div>
        ))}
      </div>
    );
  };

  // Layer 2: Grid Layer
  const GridLayer = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(11, 1fr)',
      gridTemplateRows: 'repeat(7, 1fr)',
      gap: 0,
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      {[...Array(gridRows * gridCols)].map((_, i) => (
        <div
          key={i}
          style={{
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        />
      ))}
    </div>
  );

  // Layer 3: Content Layer (where you add elements)
  const ContentLayer = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(11, 1fr)',
      gridTemplateRows: 'repeat(7, 1fr)',
      gap: 0,
      pointerEvents: 'none'
    }}>
      {/* Add grid elements here easily */}
      {/* Example: G3.3 - Black fill */}
      {/* <div style={{
        gridColumn: '3',
        gridRow: '3',
        backgroundColor: 'black',
        pointerEvents: 'none'
      }} /> */}
      
      {/* Example: G2.2 - White fill */}
      {/* <div style={{
        gridColumn: '2',
        gridRow: '2',
        backgroundColor: 'white',
        pointerEvents: 'none'
      }} /> */}
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Layer 1: Background */}
      <BackgroundLayer />
      
      {/* Layer 2: Grid */}
      <GridLayer />
      
      {/* Layer 3: Content */}
      <ContentLayer />
    </div>
  );
};

export default LayeredInterface; 