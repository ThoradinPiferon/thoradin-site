import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { setMatrixCanvasRef } from '../utils/zoomUtils';
import { getGridId } from '../utils/gridHelpers';
import { registerBackgroundZoomHandler, setActiveBackgroundRef } from '../utils/sceneZoomManager';
import { registerBackgroundTypeZoomHandler } from '../utils/sceneDefinitions';
import { setMatrixCanvasRef as setCursorZoomRef } from '../utils/cursorZoomSystem';

// Light Spiral Calculation with Exponential Speed
function generateSpiralPoints(total, centerX, centerY, frame, maxRadius, fillDuration = 900) {
  const points = [];
  const currentTime = frame;
  const progress = Math.min(currentTime / fillDuration, 1);
  
  // Exponential speed increase with faster beginning
  const baseSpeed = 0.05; // Increased starting speed (was 0.02)
  const exponentialMultiplier = Math.pow(progress + 0.2, 1.5) * 3; // Adjusted curve for faster start
  const speedMultiplier = baseSpeed * exponentialMultiplier;
  
  for (let i = 0; i < total; i++) {
    const t = i * 0.1 + frame * speedMultiplier;
    const radius = maxRadius * progress * (i / total);
    const angle = t;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    points.push({ x, y, index: i, radius: radius, progress: progress });
  }

  return points;
}

// Light Character Generation (Simplified)
const lightChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function getRandomMatrixChar() {
  return lightChars[Math.floor(Math.random() * lightChars.length)];
}

// Count alphanumeric characters in the string
function countAlphanumeric(str) {
  return str.replace(/[^A-Za-z0-9]/g, '').length;
}

// Light Matrix Spiral Canvas with Natural Word Reveal
const MatrixSpiralCanvas = forwardRef(({ 
  phrase = "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS", 
  onGridZoom, 
  onIntroComplete,
  matrixState = 'running', // 'running', 'static', 'zooming'
  onAnimationComplete
}, ref) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const characterStream = useRef([]);
  const fillComplete = useRef(false);
  const animationComplete = useRef(false);
  const sentenceRevealStart = useRef(0);
  const sentenceRevealActive = useRef(false);
  const zoomState = useRef({ active: false, targetX: 0, targetY: 0, progress: 0, gridCol: 0, gridRow: 0 });
  const animationIdRef = useRef(null);
  const drawRef = useRef(null);
  
  // Performance optimizations
  const staticSpiralRef = useRef(null);
  const lastMatrixStateRef = useRef(null);
  const lastFrameRef = useRef(-1);

  // Only log state changes, not every render
  useEffect(() => {
    if (lastMatrixStateRef.current !== matrixState) {
      console.log(`🎬 MatrixSpiralCanvas: matrixState changed to ${matrixState}`);
      lastMatrixStateRef.current = matrixState;
    }
  }, [matrixState]);

  // Register this background with the generic zoom manager
  useEffect(() => {
    // Register the matrix background zoom handler with the scene definitions system
    registerBackgroundTypeZoomHandler('matrix', handleGridZoom);
    
    // Also register with the legacy system for backward compatibility
    registerBackgroundZoomHandler('matrix', canvasRef.current, handleGridZoom);
    
    // Set as active background reference
    setActiveBackgroundRef(canvasRef.current);
    
    // Register with cursor zoom system
    setCursorZoomRef(canvasRef.current);
    
    // Legacy support for direct zoom calls
    if (onGridZoom) {
      onGridZoom(handleGridZoom);
    }
    
    console.log('🎬 MatrixSpiralCanvas registered with scene definitions and cursor zoom systems');
  }, [onGridZoom, onIntroComplete]);

  // Zoom transition function - now returns a Promise
  const handleGridZoom = (gridCol, gridRow) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve();
        return;
      }
      
      const { width, height } = canvas;
      const cellWidth = width / 11; // 11 columns
      const cellHeight = height / 7; // 7 rows
      
      // Calculate target position (center of the clicked grid)
      const targetX = (gridCol - 0.5) * cellWidth;
      const targetY = (gridRow - 0.5) * cellHeight;
      
      console.log(`🎬 Starting zoom animation to grid ${getGridId(gridCol, gridRow)} (${gridCol}, ${gridRow})`);
      
      // Start zoom animation
      zoomState.current = {
        active: true,
        targetX,
        targetY,
        progress: 0,
        gridCol,
        gridRow
      };
      
      // Restart animation loop for zoom effect
      if (animationComplete.current) {
        // Animation was stopped, restart it for zoom
        const zoomDraw = () => {
          const ctx = canvas.getContext('2d');
          const { width, height } = canvas;
          
          // Clear canvas
          ctx.clearRect(0, 0, width, height);
          
          // Draw static background (final state of intro animation)
          const centerX = width / 2;
          const centerY = height / 2;
          const maxRadius = Math.max(width, height) * 0.5;
          const totalDuration = 480; // 8 seconds
          
          // Generate final spiral state
          const spiral = generateSpiralPoints(350, centerX, centerY, totalDuration, maxRadius, totalDuration);
          
          // Draw static spiral background
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
              // Phrase characters - bright green
              const phraseChar = phrase[phraseCharIndex];
              ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
              ctx.shadowColor = '#00ffcc';
              ctx.shadowBlur = 5;
              ctx.fillText(phraseChar, x, y);
            } else {
              // Background spiral - faded
              ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.2})`;
              ctx.shadowBlur = 0;
              ctx.fillText(char, x, y);
            }
          });
          
          // Draw static horizontal sentence
          const sentenceWidth = phrase.length * 20;
          const startX = centerX - sentenceWidth / 2;
          const sentenceY = centerY;
          
          ctx.font = '20px monospace';
          ctx.fillStyle = 'rgba(0,255,180,0.9)';
          ctx.shadowColor = '#00ffcc';
          ctx.shadowBlur = 8;
          
          for (let i = 0; i < phrase.length; i++) {
            ctx.fillText(phrase[i], startX + (i * 20), sentenceY);
          }
          
          // Apply zoom effect with slow approach then fast acceleration
          if (zoomState.current.active) {
            zoomState.current.progress += 0.02; // Much faster transition
            
            if (zoomState.current.progress >= 1) {
              zoomState.current.progress = 1;
            }
            
            const zoomProgress = zoomState.current.progress;
            
            // Three-phase zoom: very slow initial (0-0.3), slow approach (0.3-0.8), then super fast (0.8-1.0)
            let zoomEase;
            if (zoomProgress < 0.3) {
              zoomEase = zoomProgress / 0.3 * 0.1; // Very slow initial
            } else if (zoomProgress < 0.8) {
              zoomEase = 0.1 + (zoomProgress - 0.3) / 0.5 * 0.3; // Slow approach
            } else {
              zoomEase = 0.4 + (zoomProgress - 0.8) / 0.2 * 0.6; // Super fast final
            }
            
            const zoomScale = 1 + zoomEase * 2; // Scale up to 3x
            const opacity = 1 - zoomEase * 0.5; // Fade out slightly
            
            ctx.save();
            ctx.translate(zoomState.current.targetX, zoomState.current.targetY);
            ctx.scale(zoomScale, zoomScale);
            ctx.translate(-zoomState.current.targetX, -zoomState.current.targetY);
            ctx.globalAlpha = opacity;
            
            // Continue zoom animation
            if (zoomState.current.progress < 1) {
              requestAnimationFrame(zoomDraw);
            } else {
              // Zoom complete - fade to black
              ctx.restore();
              
              // Draw solid black background for transition
              ctx.fillStyle = 'rgb(0, 0, 0)';
              ctx.fillRect(0, 0, width, height);
              
              console.log(`🎬 Zoom animation completed for grid ${getGridId(gridCol, gridRow)}`);
              
              // Reset zoom state
              zoomState.current = { active: false, targetX: 0, targetY: 0, progress: 0, gridCol: 0, gridRow: 0 };
              
              // Resolve the Promise after a brief pause
              setTimeout(() => {
                resolve();
              }, 200);
            }
          }
        };
        
        // Start zoom animation
        requestAnimationFrame(zoomDraw);
      } else {
        // Animation not complete, resolve immediately
        resolve();
      }
    });
  };

  // Cursor-based zoom function
  const performCursorZoom = async (zoomParams) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve();
        return;
      }
      
      const { centerX, centerY, zoomLevel, duration = 1200, easing = 'ease-in-out', precision } = zoomParams;
      
      console.log(`🎯 Cursor zoom triggered:`, {
        center: `(${centerX.toFixed(3)}, ${centerY.toFixed(3)})`,
        zoomLevel: zoomLevel.toFixed(2),
        precision: precision.toFixed(3),
        duration
      });
      
      // Convert normalized coordinates to canvas coordinates
      const targetX = centerX * canvas.width;
      const targetY = centerY * canvas.height;
      
      // Set zoom state with cursor-based parameters
      zoomState.current = {
        active: true,
        targetX,
        targetY,
        progress: 0,
        zoomLevel,
        precision,
        duration,
        easing
      };
      
      // Calculate animation steps
      const steps = Math.floor(duration / 16); // 60fps
      let currentStep = 0;
      
      // Start cursor-based zoom animation
      const animateCursorZoom = () => {
        if (currentStep < steps) {
          // Apply easing
          let easedProgress;
          if (easing === 'ease-in-out') {
            const t = currentStep / steps;
            easedProgress = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          } else {
            easedProgress = currentStep / steps;
          }
          
          zoomState.current.progress = easedProgress;
          currentStep++;
          
          draw();
          requestAnimationFrame(animateCursorZoom);
        } else {
          // Zoom complete
          zoomState.current.active = false;
          console.log(`✅ Cursor zoom completed: ${zoomLevel.toFixed(2)}x at (${centerX.toFixed(3)}, ${centerY.toFixed(3)})`);
          resolve();
        }
      };
      
      animateCursorZoom();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Clear static spiral cache when canvas size changes
      staticSpiralRef.current = null;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Initialize light character stream
    if (characterStream.current.length === 0) {
      for (let i = 0; i < 500; i++) { // Reduced from 1000
        characterStream.current.push(getRandomMatrixChar());
      }
    }

    const draw = () => {
      // Store the draw function in ref for external access
      drawRef.current = draw;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      
      // Note: Zoom animation is handled separately in handleGridZoom function
      // This ensures static background after intro completion
      const maxRadius = Math.max(width, height) * 0.5; // Reduced coverage
      const fillDuration = 900; // 15 seconds
      const totalDuration = 480; // 8 seconds total (5s build-up + 3s reveal)
      const sentenceRevealDuration = 300; // 5 seconds - when sentence starts revealing

      // Handle different animation states based on matrixState
      if (matrixState === 'static') {
        // Scene 1.2: Draw static final state - CACHE THE SPIRAL
        if (!staticSpiralRef.current) {
          staticSpiralRef.current = generateSpiralPoints(350, centerX, centerY, totalDuration, maxRadius, totalDuration);
        }
        const spiral = staticSpiralRef.current;
        
        // Pre-calculate static values to avoid repeated calculations
        const totalSpiralChars = spiral.length;
        const phraseStartIndex = totalSpiralChars - phrase.length;
        const phraseLength = phrase.length;
        
        // Draw static spiral background with fully revealed phrase
        spiral.forEach(({ x, y, index, radius }) => {
          const charIndex = index % characterStream.current.length;
          const char = characterStream.current[charIndex];
          
          const distanceFromCenter = radius / maxRadius;
          const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
          const fontSize = Math.max(8, 16 - distanceFromCenter * 8);
          
          ctx.font = `${fontSize}px monospace`;
          
          // Use pre-calculated values
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
        
        // Draw ALL letters of the phrase (fully spelled out)
        for (let i = 0; i < phraseLength; i++) {
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

      // Only log frame changes, not every frame
      if (lastFrameRef.current !== frameRef.current) {
        lastFrameRef.current = frameRef.current;
      }

      // Check if sentence reveal should start
      if (frameRef.current >= sentenceRevealDuration && !sentenceRevealActive.current) {
        sentenceRevealStart.current = frameRef.current;
        sentenceRevealActive.current = true;
      }

      // Check if animation is complete
      if (frameRef.current >= totalDuration && !animationComplete.current) {
        animationComplete.current = true;
        // Notify parent that intro is complete
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }

      // Check if fill phase is complete
      if (frameRef.current >= fillDuration && !fillComplete.current) {
        fillComplete.current = true;
      }

      // Generate spiral points - only if frame changed
      const spiral = generateSpiralPoints(350, centerX, centerY, frameRef.current, maxRadius, fillDuration);

      // Pre-calculate common values to avoid repeated calculations
      const totalSpiralChars = spiral.length;
      const phraseStartIndex = totalSpiralChars - phrase.length;
      const phraseLength = phrase.length;

      // Draw spiral characters
      spiral.forEach(({ x, y, index, radius }) => {
        const charIndex = index % characterStream.current.length;
        const char = characterStream.current[charIndex];
        
        const distanceFromCenter = radius / maxRadius;
        const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
        const fontSize = Math.max(8, 16 - distanceFromCenter * 8);
        
        ctx.font = `${fontSize}px monospace`;
        
        // Use pre-calculated values
        const isPhraseChar = index >= phraseStartIndex;
        const phraseCharIndex = index - phraseStartIndex;
        
        if (isPhraseChar && phraseCharIndex < phraseLength) {
          // This is part of the phrase
          const phraseChar = phrase[phraseCharIndex];
          
          // Check if sentence should be revealed
          if (sentenceRevealActive.current) {
            const sentenceProgress = (frameRef.current - sentenceRevealStart.current) / 180; // 3 seconds for sentence reveal (5s to 8s)
            const shouldReveal = phraseCharIndex <= sentenceProgress * phraseLength;
            
            if (shouldReveal) {
              // Bright green for revealed phrase characters
              ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
              ctx.shadowColor = '#00ffcc';
              ctx.shadowBlur = 5;
              ctx.fillText(phraseChar, x, y);
            } else {
              // Not revealed yet - show as random character with reduced opacity
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
          // Regular spiral character - fade to background
          if (sentenceRevealActive.current) {
            // Fade spiral to background when sentence is revealing
            const fadeProgress = (frameRef.current - sentenceRevealStart.current) / 180;
            const fadeOpacity = Math.max(0.05, baseOpacity * 0.2 * (1 - fadeProgress * 0.5));
            ctx.fillStyle = `rgba(0,255,0,${fadeOpacity})`;
            ctx.shadowBlur = 0;
          } else if (!fillComplete.current) {
            ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.8})`;
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 1;
          } else {
            ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.2})`;
            ctx.shadowBlur = 0;
          }
          ctx.fillText(char, x, y);
        }
      });

      // Draw horizontal sentence
      if (sentenceRevealActive.current) {
        const sentenceProgress = (frameRef.current - sentenceRevealStart.current) / 180;
        const sentenceWidth = phraseLength * 20;
        const startX = centerX - sentenceWidth / 2;
        const sentenceY = centerY;
        
        ctx.font = '20px monospace';
        ctx.fillStyle = 'rgba(0,255,180,0.9)';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 8;
        
        for (let i = 0; i < phraseLength; i++) {
          if (i <= sentenceProgress * phraseLength) {
            ctx.fillText(phrase[i], startX + (i * 20), sentenceY);
          }
        }
      }

      // Continue animation loop only if running and not complete
      if (matrixState === 'running' && !animationComplete.current) {
        frameRef.current++;
        animationIdRef.current = requestAnimationFrame(draw);
      } else {
        // Animation is complete or paused - static background, no more animation frames
        // Zoom animations are handled separately for optimal performance
      }
    };

    // Start animation if running
    if (matrixState === 'running') {
      draw();
    } else if (matrixState === 'static') {
      // Draw static state immediately
      draw();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [phrase, matrixState, onAnimationComplete]);

  // Log character count and string length
  useEffect(() => {
    const alphanumericCount = countAlphanumeric(phrase);
  }, [phrase]);

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
    fillComplete.current = false;
    animationComplete.current = false;
    sentenceRevealStart.current = 0;
    sentenceRevealActive.current = false;
    zoomState.current = { active: false, targetX: 0, targetY: 0, progress: 0, gridCol: 0, gridRow: 0 };
    
    // Cancel any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    // Restart the animation loop using the stored draw function
    if (drawRef.current) {
      const animate = () => {
        if (animationComplete.current) return;
        
        frameRef.current++;
        drawRef.current();
        requestAnimationFrame(animate);
      };
      
      animate();
    }
  };

  // Expose functions through ref
  useImperativeHandle(ref, () => ({
    handleGridZoom,
    fastForwardToEnd,
    restartAnimation,
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
          const fontSize = Math.max(8, 16 - distanceFromCenter * 8);
          
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
      handleGridZoom: (colIndex, rowIndex) => handleGridZoom(colIndex, rowIndex),
      performCursorZoom: (zoomParams) => performCursorZoom(zoomParams)
    });
    
    return () => {
      setMatrixCanvasRef(null);
    };
  }, []);

  return (
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
        background: 'black',
        pointerEvents: 'none'
      }} 
    />
  );
});

export default MatrixSpiralCanvas; 