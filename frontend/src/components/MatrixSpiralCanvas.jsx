import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getGridId } from '../utils/gridHelpers';
import { setMatrixCanvasRef } from '../utils/cursorZoomSystem';

// Original Matrix Spiral Canvas with Typing Effect and Sentence Reveal
const MatrixSpiralCanvas = forwardRef(({ 
  phrase = "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS", 
  onGridZoom, 
  onIntroComplete,
  matrixState = 'running', // 'running', 'static'
  animationConfig = null, // Will be set from database
  backgroundPath = null, // Optional static file path
  onAnimationComplete
}, ref) => {
  // Default animation config if none provided
  const defaultAnimationConfig = {
    type: 'matrix_spiral',
    speed: 'normal',
    colors: { primary: '#00ff00', secondary: '#00ffcc', background: '#000000' },
    text: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS",
    duration: 8000,
    effects: { glow: true, fade: true, spiral: true },
    interactiveParams: { zoomSpeed: 1.2, cursorSensitivity: 0.8, animationPause: false }
  };
  
  // Use provided config or default
  const config = animationConfig || defaultAnimationConfig;
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const characterStream = useRef([]);
  const animationComplete = useRef(false);
  const animationIdRef = useRef(null);
  const drawRef = useRef(null);
  
  // Performance optimizations
  const staticSpiralRef = useRef(null);
  const lastMatrixStateRef = useRef(null);
  
  // Animation timing for typing effect
  const sentenceRevealStart = useRef(0);
  const sentenceRevealActive = useRef(false);
  
  // Background video/image element
  const backgroundRef = useRef(null);

  // Only log state changes, not every render
  useEffect(() => {
    if (lastMatrixStateRef.current !== matrixState) {
      console.log(`🎬 MatrixSpiralCanvas: matrixState changed to ${matrixState}`);
      lastMatrixStateRef.current = matrixState;
    }
  }, [matrixState]);

  // Register with cursor zoom system
  useEffect(() => {
    setMatrixCanvasRef(canvasRef.current);
    console.log('🎬 MatrixSpiralCanvas registered with cursor zoom system');
  }, []);

  // Handle matrix click for fast-forward
  const handleMatrixClick = (event) => {
    if (matrixState === 'running' && config?.type === 'matrix_spiral') {
      console.log('🎬 Matrix clicked - triggering fast-forward');
      
      // Fast-forward to end state
      fastForwardToEnd();
      
      // Call onAnimationComplete to trigger scenario transition
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  };

  // Simple character generation
  const lightChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  function getRandomMatrixChar() {
    return lightChars[Math.floor(Math.random() * lightChars.length)];
  }
  
  // Responsive font size calculation
  function getResponsiveFontSize(width, height, distanceFromCenter) {
    const screenSize = Math.min(width, height);
    const baseFontSize = Math.max(8, Math.min(24, screenSize * 0.02)); // 2% of screen size, min 8px, max 24px
    return Math.max(6, baseFontSize - distanceFromCenter * (baseFontSize * 0.5));
  }

  // Simple spiral generation
  function generateSpiralPoints(total, centerX, centerY, frame, maxRadius, fillDuration = 900) {
    const points = [];
    const progress = Math.min(frame / fillDuration, 1);
    
    for (let i = 0; i < total; i++) {
      const t = i * 0.1 + frame * 0.05;
      const radius = maxRadius * progress * (i / total);
      const angle = t;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      points.push({ x, y, index: i, radius: radius });
    }

    return points;
  }

  // Define draw function
  const draw = () => {
    // Store the draw function in ref for external access
    drawRef.current = draw;
    
    // Ensure canvas is available
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      console.log('🎬 Canvas not available for drawing');
      return;
    }
    
    const ctx = canvasElement.getContext('2d');
    const { width, height } = canvasElement;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(width, height) * 0.5;
    const fillDuration = 900; // 15 seconds
    const totalDuration = 480; // 8 seconds total
    const sentenceRevealDuration = 300; // 5 seconds - when sentence starts revealing

    // Handle different animation states based on matrixState
    if (matrixState === 'static') {
      // Scene 1.2: Draw static final state with fully typed letters
      if (!staticSpiralRef.current) {
        staticSpiralRef.current = generateSpiralPoints(350, centerX, centerY, totalDuration, maxRadius, totalDuration);
      }
      const spiral = staticSpiralRef.current;
      
      // Draw static spiral background with fully revealed phrase
      spiral.forEach(({ x, y, index, radius }) => {
        const charIndex = index % characterStream.current.length;
        const char = characterStream.current[charIndex];
        
        const distanceFromCenter = radius / maxRadius;
        const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
        const fontSize = getResponsiveFontSize(width, height, distanceFromCenter);
        
        ctx.font = `${fontSize}px monospace`;
        
        // Determine if this is a phrase character
        const totalSpiralChars = spiral.length;
        const phraseStartIndex = totalSpiralChars - phrase.length;
        const isPhraseChar = index >= phraseStartIndex;
        const phraseCharIndex = index - phraseStartIndex;
        
        if (isPhraseChar && phraseCharIndex < phrase.length) {
          // Phrase characters - fully revealed and bright green
          const phraseChar = phrase[phraseCharIndex];
          ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
          ctx.shadowColor = '#00ffcc';
          ctx.shadowBlur = 5;
          ctx.fillText(phraseChar, x, y);
        } else {
          // Background spiral - faded to background
          ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.2})`;
          ctx.shadowBlur = 0;
          ctx.fillText(char, x, y);
        }
      });
      
      // Draw fully spelled horizontal sentence
      const sentenceWidth = phrase.length * 20;
      const startX = centerX - sentenceWidth / 2;
      const sentenceY = centerY;
      
      ctx.font = '20px monospace';
      ctx.fillStyle = 'rgba(0,255,180,0.9)';
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 8;
      
      // Draw ALL letters of the phrase (fully spelled out)
      for (let i = 0; i < phrase.length; i++) {
        ctx.fillText(phrase[i], startX + (i * 20), sentenceY);
      }
      
      // No animation loop for static state
      return;
    }

    // Scene 1.1: Animated Matrix background
    if (matrixState !== 'running') {
      // Not running - don't animate
      return;
    }

    // Check if sentence reveal should start
    if (frameRef.current >= sentenceRevealDuration && !sentenceRevealActive.current) {
      sentenceRevealStart.current = frameRef.current;
      sentenceRevealActive.current = true;
    }

    // Check if animation is complete
    if (frameRef.current >= totalDuration && !animationComplete.current) {
      animationComplete.current = true;
      console.log('✅ Matrix animation completed');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
      return;
    }

    // Generate spiral points for current frame
    const spiralPoints = generateSpiralPoints(350, centerX, centerY, frameRef.current, maxRadius, fillDuration);

    // Draw spiral points
    spiralPoints.forEach(({ x, y, index, radius }) => {
      const charIndex = index % characterStream.current.length;
      const char = characterStream.current[charIndex];
      
      const distanceFromCenter = radius / maxRadius;
      const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
      const fontSize = getResponsiveFontSize(width, height, distanceFromCenter);
      
      ctx.font = `${fontSize}px monospace`;
      
      // Determine if this is a phrase character
      const totalSpiralChars = spiralPoints.length;
      const phraseStartIndex = totalSpiralChars - phrase.length;
      const isPhraseChar = index >= phraseStartIndex;
      const phraseCharIndex = index - phraseStartIndex;
      
      if (isPhraseChar && phraseCharIndex < phrase.length) {
        // Phrase characters - check if they should be revealed
        if (sentenceRevealActive.current) {
          const sentenceProgress = (frameRef.current - sentenceRevealStart.current) / 180; // 3 seconds for sentence reveal
          const shouldReveal = phraseCharIndex <= sentenceProgress * phrase.length;
          
          if (shouldReveal) {
            // Bright green for revealed phrase characters
            const phraseChar = phrase[phraseCharIndex];
            ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 5;
            ctx.fillText(phraseChar, x, y);
          } else {
            // Not revealed yet - show as random character
            ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.3})`;
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 1;
            ctx.fillText(char, x, y);
          }
        } else {
          // Before sentence reveal - show as random character
          ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.8})`;
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 1;
          ctx.fillText(char, x, y);
        }
      } else {
        // Background spiral - fade to background when sentence is revealing
        if (sentenceRevealActive.current) {
          const fadeProgress = (frameRef.current - sentenceRevealStart.current) / 180;
          const fadeOpacity = Math.max(0.05, baseOpacity * 0.2 * (1 - fadeProgress * 0.5));
          ctx.fillStyle = `rgba(0,255,0,${fadeOpacity})`;
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.8})`;
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 1;
        }
        ctx.fillText(char, x, y);
      }
    });

    // Draw horizontal sentence reveal
    if (sentenceRevealActive.current) {
      const sentenceProgress = (frameRef.current - sentenceRevealStart.current) / 180;
      const sentenceWidth = phrase.length * 20;
      const startX = centerX - sentenceWidth / 2;
      const sentenceY = centerY;
      
      ctx.font = '20px monospace';
      ctx.fillStyle = 'rgba(0,255,180,0.9)';
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 8;
      
      // Draw phrase characters progressively
      for (let i = 0; i < phrase.length; i++) {
        if (i <= sentenceProgress * phrase.length) {
          ctx.fillText(phrase[i], startX + (i * 20), sentenceY);
        }
      }
    }
  };

  // Start matrix animation function
  const startMatrixAnimation = () => {
    console.log('🎬 Starting matrix animation...');
    frameRef.current = 0;
    animationComplete.current = false;
    sentenceRevealStart.current = 0;
    sentenceRevealActive.current = false;
    
    // Cancel any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    // Ensure draw function is available
    if (!drawRef.current) {
      console.log('🎬 Draw function not available, initializing...');
      draw();
    }
    
    // Start the animation loop
    const animate = () => {
      if (animationComplete.current) return;
      
      frameRef.current++;
      if (drawRef.current) {
        drawRef.current();
      } else {
        console.log('🎬 Draw function still not available, calling draw directly');
        draw();
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Draw static state function
  const drawStaticState = () => {
    console.log('🎬 Drawing static matrix state');
    
    // Cancel any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    // Draw static state once
    draw();
  };

  // Handle animation configuration and background path changes
  useEffect(() => {
    console.log(`🎬 MatrixSpiralCanvas useEffect triggered:`);
    console.log(`  - config?.type: ${config?.type}`);
    console.log(`  - matrixState: ${matrixState}`);
    console.log(`  - backgroundPath: ${backgroundPath}`);
    
    if (backgroundPath) {
      console.log(`🎬 Loading static background from: ${backgroundPath}`);
      // If we have a static background path, use it instead of canvas animation
      if (backgroundRef.current) {
        backgroundRef.current.src = backgroundPath;
        backgroundRef.current.style.display = 'block';
        if (canvasRef.current) {
          canvasRef.current.style.display = 'none';
        }
      }
    } else {
      // No static background, use frontend canvas animation based on animation config
      if (backgroundRef.current) {
        backgroundRef.current.style.display = 'none';
      }
      if (canvasRef.current) {
        canvasRef.current.style.display = 'block';
      }
      
      // Start appropriate animation based on configuration
      if (config?.type === 'matrix_spiral' && matrixState === 'running') {
        console.log(`🎬 ✅ Starting matrix spiral animation with config:`, config);
        startMatrixAnimation();
      } else if (config?.type === 'static') {
        console.log(`🎬 Using static background - drawing static state`);
        // Static mode - draw static state once
        drawStaticState();
      } else if (!config) {
        console.log(`🎬 ⏳ Animation config still loading, waiting...`);
        // Config is still loading, don't start animation yet
      } else {
        console.log(`🎬 ❌ Conditions not met for matrix animation:`);
        console.log(`  - config?.type === 'matrix_spiral': ${config?.type === 'matrix_spiral'}`);
        console.log(`  - matrixState === 'running': ${matrixState === 'running'}`);
        console.log(`🎬 Unknown animation type: ${config?.type}, using default matrix`);
        startMatrixAnimation();
      }
    }
  }, [config, backgroundPath, matrixState]);

  // Simple cursor-based zoom function
  const performCursorZoom = async (zoomParams) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve();
        return;
      }
      
      const { centerX, centerY, duration = 1200 } = zoomParams;
      
      console.log(`🎯 Starting cursor zoom to (${centerX.toFixed(3)}, ${centerY.toFixed(3)})`);
      
      // Convert normalized coordinates to canvas coordinates
      const targetX = centerX * canvas.width;
      const targetY = centerY * canvas.height;
      
      // Create a zoom effect by scaling and translating the canvas
      const startTime = Date.now();
      const startScale = 1;
      const endScale = 6; // Increased to 6x zoom
      
      const animateZoom = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Exponential easing for increasingly faster zoom
        const easeProgress = Math.pow(progress, 2); // Quadratic acceleration
        
        const currentScale = startScale + (endScale - startScale) * easeProgress;
        
        // Apply zoom transformation
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(targetX, targetY);
        ctx.scale(currentScale, currentScale);
        ctx.translate(-targetX, -targetY);
        
        // Redraw the current state
        if (matrixState === 'static') {
          drawStaticState();
        } else {
          // For running state, we'll just show the static state during zoom
          drawStaticState();
        }
        
        ctx.restore();
        
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          console.log('✅ Cursor zoom completed');
          resolve();
        }
      };
      
      requestAnimationFrame(animateZoom);
    });
  };

  // Canvas resize and initialization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      // Get the actual device pixel ratio for crisp rendering
      const devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set canvas size to match display size
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      
      // Scale the context to match the device pixel ratio
      const ctx = canvas.getContext('2d');
      ctx.scale(devicePixelRatio, devicePixelRatio);
      
      // Clear static spiral cache when canvas size changes
      staticSpiralRef.current = null;
      
      console.log(`🎬 Canvas resized to: ${canvas.width}x${canvas.height} (device ratio: ${devicePixelRatio})`);
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Initialize character stream
    if (characterStream.current.length === 0) {
      for (let i = 0; i < 500; i++) {
        characterStream.current.push(getRandomMatrixChar());
      }
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // Fast-forward function to skip to end of intro with fully spelled letters
  const fastForwardToEnd = () => {
    frameRef.current = 480; // Jump to end of animation (8 seconds)
    animationComplete.current = true;
    sentenceRevealActive.current = true;
    sentenceRevealStart.current = 300; // Set to when sentence reveal started
    
    // Trigger intro completion callback
    if (onIntroComplete) {
      onIntroComplete();
    }
    
    // Redraw final state immediately with fully spelled letters
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw final state of animation
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.max(width, height) * 0.5;
      const totalDuration = 480; // 8 seconds
      
      // Generate final spiral state
      const spiral = generateSpiralPoints(350, centerX, centerY, totalDuration, maxRadius, totalDuration);
      
      // Draw final spiral background with fully revealed phrase
      spiral.forEach(({ x, y, index, radius }) => {
        const charIndex = index % characterStream.current.length;
        const char = characterStream.current[charIndex];
        
        const distanceFromCenter = radius / maxRadius;
        const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
        const fontSize = Math.max(8, 16 - distanceFromCenter * 8);
        
        ctx.font = `${fontSize}px monospace`;
        
        // Calculate if this should be part of the phrase
        const totalSpiralChars = spiral.length;
        const phraseStartIndex = totalSpiralChars - phrase.length;
        const isPhraseChar = index >= phraseStartIndex;
        const phraseCharIndex = index - phraseStartIndex;
        
        if (isPhraseChar && phraseCharIndex < phrase.length) {
          // Phrase characters - fully revealed and bright green
          const phraseChar = phrase[phraseCharIndex];
          ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
          ctx.shadowColor = '#00ffcc';
          ctx.shadowBlur = 5;
          ctx.fillText(phraseChar, x, y);
        } else {
          // Background spiral - faded to background
          ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.2})`;
          ctx.shadowBlur = 0;
          ctx.fillText(char, x, y);
        }
      });
      
      // Draw fully spelled horizontal sentence
      const sentenceWidth = phrase.length * 20;
      const startX = centerX - sentenceWidth / 2;
      const sentenceY = centerY;
      
      ctx.font = '20px monospace';
      ctx.fillStyle = 'rgba(0,255,180,0.9)';
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 8;
      
      // Draw ALL letters of the phrase (fully spelled out)
      for (let i = 0; i < phrase.length; i++) {
        ctx.fillText(phrase[i], startX + (i * 20), sentenceY);
      }
    }
  };

  // Restart animation function
  const restartAnimation = () => {
    console.log('Restarting Matrix animation...');
    frameRef.current = 0;
    animationComplete.current = false;
    sentenceRevealStart.current = 0;
    sentenceRevealActive.current = false;
    
    // Cancel any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    // Ensure draw function is available
    if (!drawRef.current) {
      console.log('🎬 Draw function not available during restart, initializing...');
      draw();
    }
    
    // Restart the animation loop using the stored draw function
    const animate = () => {
      if (animationComplete.current) return;
      
      frameRef.current++;
      if (drawRef.current) {
        drawRef.current();
      } else {
        console.log('🎬 Draw function still not available during restart, calling draw directly');
        draw();
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Expose functions through ref
  useImperativeHandle(ref, () => ({
    performCursorZoom,
    fastForwardToEnd,
    restartAnimation,
    drawStaticState,
    stopSpiral: () => {
      console.log('🎬 stopSpiral() called - transitioning to static state');
      
      // Cancel any ongoing animation
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      
      // Mark animation as complete
      animationComplete.current = true;
      
      // Force immediate static state rendering
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        
        // Draw static final state immediately
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.max(width, height) * 0.5;
        const totalDuration = 480;
        
        // Use cached static spiral or generate it
        if (!staticSpiralRef.current) {
          staticSpiralRef.current = generateSpiralPoints(350, centerX, centerY, totalDuration, maxRadius, totalDuration);
        }
        const spiral = staticSpiralRef.current;
        
        // Pre-calculate static values
        const totalSpiralChars = spiral.length;
        const phraseStartIndex = totalSpiralChars - phrase.length;
        const phraseLength = phrase.length;
        
        // Draw static spiral background with fully revealed phrase
        spiral.forEach(({ x, y, index, radius }) => {
          const charIndex = index % characterStream.current.length;
          const char = characterStream.current[charIndex];
          
          const distanceFromCenter = radius / maxRadius;
          const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
          const fontSize = getResponsiveFontSize(width, height, distanceFromCenter);
          
          ctx.font = `${fontSize}px monospace`;
          
          const isPhraseChar = index >= phraseStartIndex;
          const phraseCharIndex = index - phraseStartIndex;
          
          if (isPhraseChar && phraseCharIndex < phraseLength) {
            // Phrase characters - fully revealed and bright green
            const phraseChar = phrase[phraseCharIndex];
            ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 5;
            ctx.fillText(phraseChar, x, y);
          } else {
            // Background spiral - faded to background
            ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.2})`;
            ctx.shadowBlur = 0;
            ctx.fillText(char, x, y);
          }
        });
        
        // Draw fully spelled horizontal sentence
        const sentenceWidth = phraseLength * 20;
        const startX = centerX - sentenceWidth / 2;
        const sentenceY = centerY;
        
        ctx.font = '20px monospace';
        ctx.fillStyle = 'rgba(0,255,180,0.9)';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 8;
        
        for (let i = 0; i < phraseLength; i++) {
          ctx.fillText(phrase[i], startX + (i * 20), sentenceY);
        }
      }
      
      console.log('✅ Spiral stopped and static state rendered');
    }
  }));

  // Register this component with the global zoom utility
  useEffect(() => {
    setMatrixCanvasRef({
      performCursorZoom: (zoomParams) => performCursorZoom(zoomParams)
    });
    
    return () => {
      setMatrixCanvasRef(null);
    };
  }, []);

  return (
    <>
      {/* Database-driven background video/image */}
      <video 
        ref={backgroundRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          width: '100vw',
          height: '100vh',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
          display: backgroundPath ? 'block' : 'none',
          overflow: 'hidden'
        }}
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Canvas-based matrix animation (fallback) */}
      <canvas 
        id="spiral-bg" 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          width: '100vw',
          height: '100vh',
          maxWidth: '100%',
          maxHeight: '100%',
          background: 'black',
          pointerEvents: matrixState === 'running' && config?.type === 'matrix_spiral' ? 'auto' : 'none',
          cursor: matrixState === 'running' && config?.type === 'matrix_spiral' ? 'pointer' : 'default',
          display: backgroundPath ? 'none' : 'block',
          objectFit: 'cover',
          overflow: 'hidden'
        }} 
        onClick={handleMatrixClick}
      />
    </>
  );
});

export default MatrixSpiralCanvas; 