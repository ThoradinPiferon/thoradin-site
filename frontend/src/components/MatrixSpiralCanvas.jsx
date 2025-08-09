import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getGridId } from '../utils/gridHelpers';

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
  
  // Built-in zoom effect for scenario 1.2
  const zoomRef = useRef({ isZooming: false, startTime: 0, duration: 1200 });
  
  // Background video/image element
  const backgroundRef = useRef(null);

  // Hoisted function declarations (to avoid TDZ issues)
  function draw() {
    // Ensure canvas is available
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      console.log('🎬 Canvas not available for drawing');
      return;
    }
    
    const ctx = canvasElement.getContext('2d');
    const { width, height } = canvasElement;
    
    // Get the actual display dimensions (accounting for device pixel ratio scaling)
    const rect = canvasElement.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    // Clear with CSS pixel dimensions after scaling
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any old transforms
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Use display dimensions for centering (not the full pixel dimensions)
    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const maxRadius = Math.max(displayWidth, displayHeight) * 0.5;
    
    // Debug centering (only log occasionally to avoid spam)
    if (frameRef.current % 60 === 0) { // Log every 60 frames (about once per second)
      console.log(`🎬 Drawing frame ${frameRef.current}: canvas ${width}x${height}, display ${displayWidth}x${displayHeight}, center (${centerX}, ${centerY}), maxRadius ${maxRadius}`);
    }
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
      
      // Apply zoom effect if active
      let zoomScale = 1;
      let zoomOffsetX = 0;
      let zoomOffsetY = 0;
      
      if (zoomRef.current.isZooming) {
        const elapsed = Date.now() - zoomRef.current.startTime;
        const progress = Math.min(elapsed / zoomRef.current.duration, 1);
        const easeProgress = Math.pow(progress, 2); // Quadratic acceleration
        
        zoomScale = 1 + (5 * easeProgress); // Zoom to 6x
        
        // Calculate zoom offset to keep center point centered
        zoomOffsetX = centerX * (1 - zoomScale);
        zoomOffsetY = centerY * (1 - zoomScale);
        
        // Check if zoom is complete
        if (progress >= 1) {
          console.log('✅ Built-in zoom completed');
          zoomRef.current.isZooming = false;
          
          // Trigger scenario transition after zoom
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      }
      
      // Apply zoom transformation if active
      if (zoomRef.current.isZooming) {
        ctx.save();
        ctx.translate(zoomOffsetX, zoomOffsetY);
        ctx.scale(zoomScale, zoomScale);
      }
      
      // Draw static spiral background with fully revealed phrase
      spiral.forEach(({ x, y, index, radius }) => {
        const charIndex = index % (characterStream.current?.length || 1);
        const char = characterStream.current?.[charIndex] || 'A';
        
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
      
      // Restore transformation if zoom was active
      if (zoomRef.current.isZooming) {
        ctx.restore();
      }
      
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
      
      // Continue to next section for animation loop
    }

    // Scene 1.1: Animated Matrix background (only if running)
    if (matrixState === 'running') {
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
        const charIndex = index % (characterStream.current?.length || 1);
        const char = characterStream.current?.[charIndex] || 'A';
        
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
    }
    
    // Store the draw function in ref for external access (at the end to avoid circular reference)
    drawRef.current = draw;
  }

  function startMatrixAnimation() {
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
      if (drawRef.current && typeof drawRef.current === 'function') {
        drawRef.current();
      } else {
        console.log('🎬 Draw function still not available, calling draw directly');
        draw();
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  }

  function drawStaticState() {
    console.log('🎬 Drawing static matrix state');
    
    // Cancel any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    // Draw static state once
    draw();
    
    // Always start animation loop for static state to handle zoom effects
    console.log('🎬 Static state - starting animation loop for zoom responsiveness');
    const animate = () => {
      draw();
      
      // Stop animation loop if zoom completed and we're transitioning
      if (!zoomRef.current.isZooming && onAnimationComplete) {
        console.log('🎬 Zoom completed - stopping animation loop');
        return; // Don't continue the loop
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animationIdRef.current = requestAnimationFrame(animate);
  }

  function fastForwardToEnd() {
    console.log('🎬 Fast-forwarding to end state');
    
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
      
      // Get the actual display dimensions
      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width;
      const displayHeight = rect.height;
      
      // Clear with CSS pixel dimensions
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any old transforms
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      
      // Draw static final state immediately
      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;
      const maxRadius = Math.max(displayWidth, displayHeight) * 0.5;
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
        const charIndex = index % (characterStream.current?.length || 1);
        const char = characterStream.current?.[charIndex] || 'A';
        
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
    
    console.log('✅ Fast-forward completed');
  }

  function restartAnimation() {
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
      if (drawRef.current && typeof drawRef.current === 'function') {
        drawRef.current();
      } else {
        console.log('🎬 Draw function still not available during restart, calling draw directly');
        draw();
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  // Only log state changes, not every render
  useEffect(() => {
    if (lastMatrixStateRef.current !== matrixState) {
      console.log(`🎬 MatrixSpiralCanvas: matrixState changed to ${matrixState}`);
      lastMatrixStateRef.current = matrixState;
    }
  }, [matrixState]);



  // Handle matrix click for fast-forward or zoom
  const handleMatrixClick = (event) => {
    if (matrixState === 'running' && config?.type === 'matrix_spiral') {
      console.log('🎬 Matrix clicked - triggering fast-forward');
      
      // Fast-forward to end state
      fastForwardToEnd();
      
      // Call onAnimationComplete to trigger scenario transition
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    } else if (matrixState === 'static' && config?.type === 'matrix_static') {
      // Scenario 1.2: Trigger built-in zoom effect
      console.log('🎬 Matrix clicked - triggering built-in zoom');
      zoomRef.current.isZooming = true;
      zoomRef.current.startTime = Date.now();
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
      } else if (config?.type === 'matrix_static' && matrixState === 'static') {
        console.log(`🎬 ✅ Drawing static matrix state for scenario 1.2`);
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


  // Canvas resize and initialization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      // Get the actual device pixel ratio for crisp rendering
      const devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set canvas size to match display size
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      
      // Scale the context to match the device pixel ratio
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any old transforms
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Clear static spiral cache when canvas size changes
      staticSpiralRef.current = null;
      
      console.log(`🎬 Canvas resized to: ${canvas.width}x${canvas.height} (device ratio: ${devicePixelRatio})`);
      console.log(`🎬 Canvas rect: ${rect.width}x${rect.height}, position: ${rect.left},${rect.top}`);
      console.log(`🎬 Window size: ${window.innerWidth}x${window.innerHeight}`);
      console.log(`🎬 Document size: ${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`);
      console.log(`🎬 Effective drawing area: ${rect.width}x${rect.height} (after device pixel ratio scaling)`);
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

  // Expose functions through ref
  useImperativeHandle(ref, () => ({
    canvasRef,
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
          const charIndex = index % (characterStream.current?.length || 1);
          const char = characterStream.current?.[charIndex] || 'A';
          
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
          pointerEvents: (matrixState === 'running' && config?.type === 'matrix_spiral') || (matrixState === 'static' && config?.type === 'matrix_static') ? 'auto' : 'none',
          cursor: (matrixState === 'running' && config?.type === 'matrix_spiral') || (matrixState === 'static' && config?.type === 'matrix_static') ? 'pointer' : 'default',
          display: backgroundPath ? 'none' : 'block',
          objectFit: 'cover',
          overflow: 'hidden'
        }} 
        onClick={handleMatrixClick}
        onLoad={() => {
          console.log('🎬 Canvas loaded, checking dimensions...');
          if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            console.log(`🎬 Canvas onLoad - rect: ${rect.width}x${rect.height}, position: ${rect.left},${rect.top}`);
            console.log(`🎬 Canvas onLoad - window: ${window.innerWidth}x${window.innerHeight}`);
            console.log(`🎬 Canvas onLoad - document: ${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`);
          }
        }}
      />
    </>
  );
});

export default MatrixSpiralCanvas; 