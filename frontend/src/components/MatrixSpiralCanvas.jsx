import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getGridId } from '../utils/gridHelpers';

const MatrixSpiralCanvas = forwardRef(({ 
  phrase = "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS", 
  onGridZoom, 
  onIntroComplete,
  matrixState = 'running',
  animationConfig = null,
  backgroundPath = null,
  onAnimationComplete,
  transitionToScenario // Add this prop for direct scenario transitions
}, ref) => {

  const defaultAnimationConfig = {
    type: 'matrix_spiral',
    speed: 'normal',
    colors: { primary: '#00ff00', secondary: '#00ffcc', background: '#000000' },
    text: phrase,
    duration: 8000,
    effects: { glow: true, fade: true, spiral: true },
    interactiveParams: { zoomSpeed: 1.2, cursorSensitivity: 0.8, animationPause: false }
  };

  const config = animationConfig || defaultAnimationConfig;

  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const characterStream = useRef([]);
  const animationComplete = useRef(false);
  const animationIdRef = useRef(null);
  const drawRef = useRef(null);
 
  const staticSpiralRef = useRef(null);
  const lastMatrixStateRef = useRef(null);
  const handoffDoneRef = useRef(false);
  const staticLoopActiveRef = useRef(false);
  const zoomRef = useRef({
    isZooming: false,
    startTime: 0,
    target: { x: 0, y: 0 },
    duration: 2500,
    isCompleted: false
  });

  const sentenceRevealStart = useRef(0);
  const sentenceRevealActive = useRef(false);

  // Now stores target click point
  const backgroundRef = useRef(null);

  // Constants
  const totalDuration = 480;
  const fillDuration = totalDuration; // match durations to avoid mismatch
  const sentenceRevealDuration = 300;

  function getRandomMatrixChar() {
    const lightChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return lightChars[Math.floor(Math.random() * lightChars.length)];
  }

  function getResponsiveFontSize(width, height, distanceFromCenter) {
    const screenSize = Math.min(width, height);
    const baseFontSize = Math.max(8, Math.min(24, screenSize * 0.02));
    return Math.max(6, baseFontSize * (0.6 + distanceFromCenter * 0.168)); // Reduced by 30% from 0.24 to 0.168 (70% of 0.24)
  }

  function generateSpiralPoints(total, centerX, centerY, frame, maxRadius, fillDur) {
    const points = [];
    const progress = Math.min(frame / fillDur, 1);
    for (let i = 0; i < total; i++) {
      const t = i * 0.1 + frame * 0.05;
      const radius = maxRadius * progress * (i / total);
      const angle = t;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y, index: i, radius });
    }
    return points;
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.48; // Increased by 20% from 0.4 to 0.48

    if (matrixState === 'static' || animationComplete.current) {
      if (!staticSpiralRef.current) {
        staticSpiralRef.current = generateSpiralPoints(350, centerX, centerY, totalDuration, maxRadius, fillDuration);
      }
      const spiral = staticSpiralRef.current;

      let zoomScale = 1;
      let zoomOffsetX = 0;
      let zoomOffsetY = 0;

      if (zoomRef.current.isZooming) {
        const elapsed = Date.now() - zoomRef.current.startTime;
        const progress = Math.min(elapsed / zoomRef.current.duration, 1);
        
        // Accelerate after 1 second (40% of 2.5s duration)
        let easeProgress;
        if (progress < 0.4) {
          // First 40%: normal quadratic easing
          easeProgress = (progress / 0.4) * (progress / 0.4);
        } else {
          // After 40%: accelerated cubic easing
          const acceleratedProgress = (progress - 0.4) / 0.6;
          easeProgress = 0.16 + (0.84 * acceleratedProgress * acceleratedProgress * acceleratedProgress);
        }
        
        zoomScale = 1 + (8 * easeProgress); // Increased to 800% zoom (1 + 8 = 9x)

        const { x: zx, y: zy } = zoomRef.current.target;
        zoomOffsetX = zx * (1 - zoomScale);
        zoomOffsetY = zy * (1 - zoomScale);

        if (progress >= 1) {
          console.log('🎬 Zoom animation completed - progress:', progress);
          console.log('🎬 Zoom state before completion:', { isZooming: zoomRef.current.isZooming, isCompleted: zoomRef.current.isCompleted });
          console.log('🎬 Handoff guard status:', { handoffDone: handoffDoneRef.current });
          zoomRef.current.isZooming = false;
          zoomRef.current.isCompleted = true;
          console.log('🎬 Zoom state after completion:', { isZooming: zoomRef.current.isZooming, isCompleted: zoomRef.current.isCompleted });
          if (!handoffDoneRef.current) {
            handoffDoneRef.current = true;
            console.log('🎬 Handoff guard set - executing single transition');
            setTimeout(() => {
              if (transitionToScenario) {
                console.log('🎬 Calling transitionToScenario(2, 1)');
                transitionToScenario(2, 1);
              } else if (onAnimationComplete) {
                console.log('🎬 Calling onAnimationComplete (fallback)');
                onAnimationComplete();
              }
            }, 100);
          } else {
            console.log('🎬 Handoff already done - skipping transition');
          }
        }
      } else if (zoomRef.current.isCompleted) {
        // Maintain final zoom state
        zoomScale = 9; // Final zoom level (800% = 9x)
        const { x: zx, y: zy } = zoomRef.current.target;
        zoomOffsetX = zx * (1 - zoomScale);
        zoomOffsetY = zy * (1 - zoomScale);
      }

      if (zoomRef.current.isZooming || zoomRef.current.isCompleted) {
        ctx.save();
        ctx.translate(zoomOffsetX, zoomOffsetY);
        ctx.scale(zoomScale, zoomScale);
      }

      spiral.forEach(({ x, y, index, radius }) => {
        const charIndex = index % (characterStream.current?.length || 1);
        const char = characterStream.current?.[charIndex] || 'A';
        const distanceFromCenter = radius / maxRadius;
        const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
        const fontSize = getResponsiveFontSize(width, height, distanceFromCenter);

        ctx.font = `${fontSize}px monospace`;
        const totalSpiralChars = spiral.length;
        const phraseStartIndex = totalSpiralChars - phrase.length;
        const isPhraseChar = index >= phraseStartIndex;
        const phraseCharIndex = index - phraseStartIndex;

        if (isPhraseChar && phraseCharIndex < phrase.length) {
          const phraseChar = phrase[phraseCharIndex];
          ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
          ctx.shadowColor = '#00ffcc';
          ctx.shadowBlur = 5;
          ctx.fillText(phraseChar, x, y);
        } else {
          ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.05})`; // Reduced from 0.1 to 0.05 for much more dimmed effect
          ctx.shadowBlur = 0;
          ctx.fillText(char, x, y);
        }
      });

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

      if (zoomRef.current.isZooming || zoomRef.current.isCompleted) {
        ctx.restore();
      }
    }

    if (matrixState === 'running') {
      if (frameRef.current >= sentenceRevealDuration && !sentenceRevealActive.current) {
        sentenceRevealStart.current = frameRef.current;
        sentenceRevealActive.current = true;
      }
      if (frameRef.current >= totalDuration && !animationComplete.current) {
        animationComplete.current = true;
        if (onAnimationComplete) onAnimationComplete();
        return;
      }
      const spiralPoints = generateSpiralPoints(350, centerX, centerY, frameRef.current, maxRadius, fillDuration);
      spiralPoints.forEach(({ x, y, index, radius }) => {
        const charIndex = index % (characterStream.current?.length || 1);
        const char = characterStream.current?.[charIndex] || 'A';
        const distanceFromCenter = radius / maxRadius;
        const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
        const fontSize = getResponsiveFontSize(width, height, distanceFromCenter);
        ctx.font = `${fontSize}px monospace`;
        const totalSpiralChars = spiralPoints.length;
        const phraseStartIndex = totalSpiralChars - phrase.length;
        const isPhraseChar = index >= phraseStartIndex;
        const phraseCharIndex = index - phraseStartIndex;
        if (isPhraseChar && phraseCharIndex < phrase.length) {
          if (sentenceRevealActive.current) {
            const sentenceProgress = (frameRef.current - sentenceRevealStart.current) / 180;
            const shouldReveal = phraseCharIndex <= sentenceProgress * phrase.length;
            if (shouldReveal) {
              const phraseChar = phrase[phraseCharIndex];
              ctx.fillStyle = `rgba(0,255,180,${baseOpacity * 0.9})`;
              ctx.shadowColor = '#00ffcc';
              ctx.shadowBlur = 5;
              ctx.fillText(phraseChar, x, y);
            } else {
              ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.3})`;
              ctx.shadowColor = '#00ff00';
              ctx.shadowBlur = 1;
              ctx.fillText(char, x, y);
            }
          } else {
            ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.8})`;
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 1;
            ctx.fillText(char, x, y);
          }
        } else {
          if (sentenceRevealActive.current) {
            const fadeProgress = (frameRef.current - sentenceRevealStart.current) / 180;
            const fadeOpacity = Math.max(0.05, baseOpacity * 0.05 * (1 - fadeProgress * 0.5)); // Reduced from 0.1 to 0.05
            ctx.fillStyle = `rgba(0,255,0,${fadeOpacity})`;
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = `rgba(0,255,0,${baseOpacity * 0.2})`; // Reduced from 0.4 to 0.2 for much more dimmed effect
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

    drawRef.current = draw;
  }

  function startMatrixAnimation() {
    frameRef.current = 0;
    animationComplete.current = false;
    sentenceRevealStart.current = 0;
    sentenceRevealActive.current = false;
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    if (!drawRef.current) draw();
    const animate = () => {
      if (animationComplete.current) return;
      frameRef.current++;
      if (drawRef.current) drawRef.current();
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();
  }

  function drawStaticState() {
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    if (staticLoopActiveRef.current) return;
    draw();
    const animate = () => {
      draw();
      animationIdRef.current = requestAnimationFrame(animate);
    };
    staticLoopActiveRef.current = true;
    animationIdRef.current = requestAnimationFrame(animate);
  }

  function fastForwardToEnd() {
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    animationComplete.current = true;
    draw();
  }

  useEffect(() => {
    if (lastMatrixStateRef.current !== matrixState) {
      lastMatrixStateRef.current = matrixState;
      if (matrixState !== 'static') {
        zoomRef.current.isZooming = false;
        zoomRef.current.isCompleted = false;
        handoffDoneRef.current = false;
        staticLoopActiveRef.current = false;
        console.log('🎬 Left static state - reset zoom guards');
      } else {
        handoffDoneRef.current = false;
        staticLoopActiveRef.current = false;
        console.log('🎬 Entered static state - reset handoff guard');
      }
      console.log('🎬 Matrix state changed to:', matrixState);
    }
  }, [matrixState]);

  const handleMatrixClick = (event) => {
    if (matrixState === 'running' && config?.type === 'matrix_spiral') {
      console.log('🎬 Matrix clicked - triggering fast-forward');
      fastForwardToEnd();
      if (onAnimationComplete) onAnimationComplete();
    } else if (matrixState === 'static') {
      if (zoomRef.current.isZooming || zoomRef.current.isCompleted || handoffDoneRef.current) {
        console.log('🎬 Matrix click blocked - zoom in progress or handoff done');
        return;
      }
      console.log('🎬 Matrix clicked - triggering zoom effect');
      console.log('🎬 Zoom state before:', { isZooming: zoomRef.current.isZooming, isCompleted: zoomRef.current.isCompleted });
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      zoomRef.current.isZooming = true;
      zoomRef.current.startTime = Date.now();
      zoomRef.current.target = { x: clickX, y: clickY };
      console.log('🎬 Zoom triggered with target:', { x: clickX, y: clickY });
      console.log('🎬 Zoom state after:', { isZooming: zoomRef.current.isZooming, isCompleted: zoomRef.current.isCompleted });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      staticSpiralRef.current = null;
    };
    window.addEventListener('resize', resize);
    resize();
    if (characterStream.current.length === 0) {
      for (let i = 0; i < 500; i++) characterStream.current.push(getRandomMatrixChar());
    }
    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      staticLoopActiveRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (backgroundPath) {
      if (backgroundRef.current) {
        backgroundRef.current.src = backgroundPath;
        backgroundRef.current.style.display = 'block';
        if (canvasRef.current) canvasRef.current.style.display = 'none';
      }
    } else {
      if (backgroundRef.current) backgroundRef.current.style.display = 'none';
      if (canvasRef.current) canvasRef.current.style.display = 'block';
      if (config?.type === 'matrix_spiral' && matrixState === 'running') {
        startMatrixAnimation();
      } else if (config?.type === 'matrix_static' && matrixState === 'static') {
        drawStaticState();
      }
    }
    
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      staticLoopActiveRef.current = false;
    };
  }, [config, backgroundPath, matrixState]);

  useImperativeHandle(ref, () => ({
    canvasRef,
    fastForwardToEnd,
    drawStaticState
  }));

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      staticLoopActiveRef.current = false;
      handoffDoneRef.current = false;
      zoomRef.current.isZooming = false;
      zoomRef.current.isCompleted = false;
    };
  }, []);

  return (
    <>
      <video ref={backgroundRef} style={{ display: backgroundPath ? 'block' : 'none' }} autoPlay muted loop playsInline />
      <canvas
        id="spiral-bg"
        ref={canvasRef}
        style={{ width: '100vw', height: '100vh', background: 'black' }}
        onClick={handleMatrixClick}
      />
    </>
  );
});

export default MatrixSpiralCanvas;