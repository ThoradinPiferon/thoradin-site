import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const TreeOfWisdomCanvas = forwardRef(({ 
  onAnimationComplete,
  backgroundPath = null,
  animationConfig = {}
}, ref) => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const rainDropsRef = useRef([]);
  const thunderTimerRef = useRef(null);
  const lanternFlickerRef = useRef(0);
  
  // Tree of Wisdom theme colors
  const forestColors = {
    background: '#0a1a0a',
    tree: {
      trunk: '#2d5016',
      bark: '#1a3d0a',
      spirals: '#4a7c59',
      glow: '#5a8c69'
    },
    gardener: {
      cloak: '#1a2b4a',
      hood: '#0f1a35',
      lantern: '#ffd700',
      lanternGlow: '#ffed4e',
      shovel: '#8b4513',
      skin: '#d4a574'
    },
    atmosphere: {
      rain: '#4a7c59',
      thunder: '#ffffff',
      mist: 'rgba(74, 124, 89, 0.1)',
      shadows: 'rgba(0, 0, 0, 0.3)'
    },
    lighting: {
      lantern: '#ffd700',
      treeGlow: '#4a7c59',
      ambient: '#1a2b1a'
    }
  };

  // Initialize rain drops
  const initializeRain = () => {
    rainDropsRef.current = [];
    const rainCount = 150;
    
    for (let i = 0; i < rainCount; i++) {
      rainDropsRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 2 + Math.random() * 3,
        length: 10 + Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
  };

  // Draw the Tree of Wisdom scene
  const drawTreeScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradient (dark forest night)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, forestColors.background);
    gradient.addColorStop(0.5, '#0d1f0d');
    gradient.addColorStop(1, '#051205');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw forest mist/atmosphere
    drawForestMist(ctx, width, height);
    
    // Draw the Tree of Wisdom
    drawTreeOfWisdom(ctx, width, height);
    
    // Draw the cloaked gardener
    drawGardener(ctx, width, height);
    
    // Draw rain effect
    drawRain(ctx, width, height);
    
    // Draw atmospheric lighting
    drawAtmosphericLighting(ctx, width, height);
    
    // Draw thunder flash effect
    drawThunderFlash(ctx, width, height);
  };

  const drawForestMist = (ctx, width, height) => {
    // Create misty atmosphere
    ctx.fillStyle = forestColors.atmosphere.mist;
    ctx.fillRect(0, 0, width, height);
    
    // Add some darker shadows for depth
    ctx.fillStyle = forestColors.atmosphere.shadows;
    ctx.fillRect(0, height * 0.8, width, height * 0.2);
  };

  const drawTreeOfWisdom = (ctx, width, height) => {
    const treeX = width * 0.5;
    const treeY = height * 0.4;
    const treeWidth = width * 0.3;
    const treeHeight = height * 0.6;
    
    // Tree trunk
    ctx.fillStyle = forestColors.tree.trunk;
    ctx.fillRect(treeX - treeWidth * 0.15, treeY, treeWidth * 0.3, treeHeight);
    
    // Tree bark texture
    ctx.strokeStyle = forestColors.tree.bark;
    ctx.lineWidth = 3;
    
    // Vertical bark lines
    for (let i = 0; i < 8; i++) {
      const x = treeX - treeWidth * 0.15 + (i * treeWidth * 0.3 / 8);
      ctx.beginPath();
      ctx.moveTo(x, treeY);
      ctx.lineTo(x, treeY + treeHeight);
      ctx.stroke();
    }
    
    // Gnarled roots extending from base
    ctx.strokeStyle = forestColors.tree.trunk;
    ctx.lineWidth = 8;
    
    // Left root
    ctx.beginPath();
    ctx.moveTo(treeX - treeWidth * 0.15, treeY + treeHeight);
    ctx.quadraticCurveTo(treeX - treeWidth * 0.4, treeY + treeHeight * 1.1, treeX - treeWidth * 0.5, treeY + treeHeight * 1.2);
    ctx.stroke();
    
    // Right root
    ctx.beginPath();
    ctx.moveTo(treeX + treeWidth * 0.15, treeY + treeHeight);
    ctx.quadraticCurveTo(treeX + treeWidth * 0.4, treeY + treeHeight * 1.1, treeX + treeWidth * 0.5, treeY + treeHeight * 1.2);
    ctx.stroke();
    
    // Center root
    ctx.beginPath();
    ctx.moveTo(treeX, treeY + treeHeight);
    ctx.quadraticCurveTo(treeX, treeY + treeHeight * 1.15, treeX, treeY + treeHeight * 1.3);
    ctx.stroke();
    
    // Glowing spirals etched into bark
    ctx.strokeStyle = forestColors.tree.spirals;
    ctx.lineWidth = 2;
    ctx.shadowColor = forestColors.tree.glow;
    ctx.shadowBlur = 8;
    
    // Spiral 1 (left side)
    drawSpiral(ctx, treeX - treeWidth * 0.1, treeY + treeHeight * 0.2, 15, 3);
    
    // Spiral 2 (right side)
    drawSpiral(ctx, treeX + treeWidth * 0.1, treeY + treeHeight * 0.4, 12, 2.5);
    
    // Spiral 3 (center)
    drawSpiral(ctx, treeX, treeY + treeHeight * 0.6, 18, 4);
    
    ctx.shadowBlur = 0;
  };

  const drawSpiral = (ctx, centerX, centerY, radius, turns) => {
    ctx.beginPath();
    const points = 100;
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * turns * Math.PI * 2;
      const currentRadius = (i / points) * radius;
      const x = centerX + Math.cos(angle) * currentRadius;
      const y = centerY + Math.sin(angle) * currentRadius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawGardener = (ctx, width, height) => {
    const gardenerX = width * 0.75;
    const gardenerY = height * 0.7;
    
    // Character shadow
    ctx.fillStyle = forestColors.atmosphere.shadows;
    ctx.beginPath();
    ctx.ellipse(gardenerX + 8, gardenerY + 60, 35, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloak
    ctx.fillStyle = forestColors.gardener.cloak;
    ctx.beginPath();
    ctx.ellipse(gardenerX, gardenerY + 15, 30, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloak hood
    ctx.fillStyle = forestColors.gardener.hood;
    ctx.beginPath();
    ctx.arc(gardenerX, gardenerY - 5, 22, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = forestColors.gardener.skin;
    ctx.beginPath();
    ctx.arc(gardenerX, gardenerY - 10, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Shovel in ground
    ctx.strokeStyle = forestColors.gardener.shovel;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(gardenerX + 20, gardenerY + 40);
    ctx.lineTo(gardenerX + 25, gardenerY + 80);
    ctx.stroke();
    
    // Shovel blade
    ctx.fillStyle = forestColors.gardener.shovel;
    ctx.beginPath();
    ctx.moveTo(gardenerX + 25, gardenerY + 80);
    ctx.lineTo(gardenerX + 35, gardenerY + 85);
    ctx.lineTo(gardenerX + 30, gardenerY + 90);
    ctx.closePath();
    ctx.fill();
    
    // Lantern (held in left hand)
    const lanternX = gardenerX - 15;
    const lanternY = gardenerY + 10;
    
    // Lantern glow effect
    const lanternGradient = ctx.createRadialGradient(lanternX, lanternY, 0, lanternX, lanternY, 40);
    lanternGradient.addColorStop(0, forestColors.gardener.lanternGlow);
    lanternGradient.addColorStop(0.7, forestColors.gardener.lantern);
    lanternGradient.addColorStop(1, 'transparent');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = lanternGradient;
    ctx.fillRect(lanternX - 40, lanternY - 40, 80, 80);
    ctx.globalCompositeOperation = 'source-over';
    
    // Lantern body
    ctx.fillStyle = forestColors.gardener.lantern;
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Lantern handle
    ctx.strokeStyle = forestColors.gardener.shovel;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lanternX, lanternY);
    ctx.lineTo(gardenerX - 8, gardenerY - 5);
    ctx.stroke();
    
    // Flickering lantern effect
    lanternFlickerRef.current += 0.1;
    const flicker = 0.8 + 0.2 * Math.sin(lanternFlickerRef.current);
    ctx.globalAlpha = flicker;
    ctx.fillStyle = forestColors.gardener.lanternGlow;
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const drawRain = (ctx, width, height) => {
    ctx.strokeStyle = forestColors.atmosphere.rain;
    ctx.lineWidth = 1;
    
    rainDropsRef.current.forEach((drop, index) => {
      ctx.globalAlpha = drop.opacity;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();
      
      // Update rain drop position
      drop.y += drop.speed;
      drop.x += Math.sin(drop.y * 0.01) * 0.5; // Slight wind effect
      
      // Reset rain drop when it goes off screen
      if (drop.y > height) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
      
      // Occasionally reset x position for variety
      if (Math.random() < 0.001) {
        drop.x = Math.random() * width;
      }
    });
    
    ctx.globalAlpha = 1;
  };

  const drawAtmosphericLighting = (ctx, width, height) => {
    // Tree glow effect
    const treeX = width * 0.5;
    const treeY = height * 0.4;
    
    const treeGlow = ctx.createRadialGradient(treeX, treeY, 0, treeX, treeY, width * 0.4);
    treeGlow.addColorStop(0, forestColors.lighting.treeGlow + '40');
    treeGlow.addColorStop(0.5, forestColors.lighting.treeGlow + '20');
    treeGlow.addColorStop(1, 'transparent');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = treeGlow;
    ctx.fillRect(treeX - width * 0.4, treeY - width * 0.4, width * 0.8, width * 0.8);
    ctx.globalCompositeOperation = 'source-over';
    
    // Ambient lighting
    ctx.fillStyle = forestColors.lighting.ambient + '30';
    ctx.fillRect(0, 0, width, height);
  };

  const drawThunderFlash = (ctx, width, height) => {
    // Random thunder flash effect
    if (Math.random() < 0.002) { // Very rare thunder
      ctx.fillStyle = forestColors.atmosphere.thunder + '20';
      ctx.fillRect(0, 0, width, height);
    }
  };

  // Animation loop
  const animate = () => {
    drawTreeScene();
    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Initialize canvas and effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Initialize rain
    initializeRain();
    
    // Start animation
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (thunderTimerRef.current) {
        clearTimeout(thunderTimerRef.current);
      }
    };
  }, []);

  // Expose functions through ref
  useImperativeHandle(ref, () => ({
    performCursorZoom: async (zoomParams) => {
      return new Promise((resolve) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve();
          return;
        }
        
        const { centerX, centerY, duration = 1200 } = zoomParams;
        
        console.log(`🌳 Starting tree zoom to (${centerX.toFixed(3)}, ${centerY.toFixed(3)})`);
        
        // Convert normalized coordinates to canvas coordinates
        const targetX = centerX * canvas.width;
        const targetY = centerY * canvas.height;
        
        // Create zoom effect
        const startTime = Date.now();
        const startScale = 1;
        const endScale = 6; // 6x zoom for dramatic effect
        
        const animateZoom = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Exponential easing for increasingly faster zoom
          const easeProgress = Math.pow(progress, 2);
          const currentScale = startScale + (endScale - startScale) * easeProgress;
          
          // Apply zoom transformation
          const ctx = canvas.getContext('2d');
          ctx.save();
          ctx.translate(targetX, targetY);
          ctx.scale(currentScale, currentScale);
          ctx.translate(-targetX, -targetY);
          
          // Redraw scene
          drawTreeScene();
          
          ctx.restore();
          
          if (progress < 1) {
            requestAnimationFrame(animateZoom);
          } else {
            console.log('✅ Tree zoom completed');
            resolve();
          }
        };
        
        requestAnimationFrame(animateZoom);
      });
    },
    
    fastForwardToEnd: () => {
      console.log('🌳 Tree of Wisdom scene fast-forward completed');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  }));

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer'
      }}
    />
  );
});

export default TreeOfWisdomCanvas;
