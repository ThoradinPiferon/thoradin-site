import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const DungeonVaultCanvas = forwardRef(({ 
  onAnimationComplete,
  backgroundPath = null
}, ref) => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  
  // Dungeon theme colors
  const dungeonColors = {
    background: '#1a0f0f',
    stone: '#2a1a1a',
    roots: '#3d2b1a',
    vault: '#4a3c2a',
    thoradin: {
      cloak: '#1a2b4a',
      gold: '#ffd700',
      skin: '#d4a574',
      eyes: '#00aaff'
    },
    lighting: {
      ambient: '#2a1a1a',
      torch: '#ff6b35',
      glow: '#ff8c42'
    }
  };

  // Draw the dungeon scene
  const drawDungeonScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradient (underground feel)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, dungeonColors.background);
    gradient.addColorStop(1, '#0a0505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw stone walls texture
    drawStoneWalls(ctx, width, height);
    
    // Draw ceiling with roots
    drawCeilingRoots(ctx, width, height);
    
    // Draw vault door
    drawVaultDoor(ctx, width, height);
    
    // Draw Thoradin character
    drawThoradin(ctx, width, height);
    
    // Draw atmospheric lighting
    drawAtmosphericLighting(ctx, width, height);
  };

  const drawStoneWalls = (ctx, width, height) => {
    // Stone wall texture
    ctx.fillStyle = dungeonColors.stone;
    ctx.fillRect(0, 0, width, height * 0.3); // Top wall
    ctx.fillRect(0, height * 0.7, width, height * 0.3); // Bottom wall
    
    // Stone blocks pattern
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    
    // Vertical lines
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height * 0.3);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, height * 0.7);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < height * 0.3; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    for (let y = height * 0.7; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCeilingRoots = (ctx, width, height) => {
    // Draw hanging roots from ceiling
    ctx.strokeStyle = dungeonColors.roots;
    ctx.lineWidth = 3;
    
    // Multiple root clusters
    const rootClusters = [
      { x: width * 0.2, count: 5 },
      { x: width * 0.4, count: 3 },
      { x: width * 0.6, count: 4 },
      { x: width * 0.8, count: 6 }
    ];
    
    rootClusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const startX = cluster.x + (i - cluster.count/2) * 20;
        const startY = 0;
        const endY = height * 0.2 + Math.random() * height * 0.1;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Curved root path
        const cp1x = startX + (Math.random() - 0.5) * 40;
        const cp1y = endY * 0.3;
        const cp2x = startX + (Math.random() - 0.5) * 40;
        const cp2y = endY * 0.7;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, startX, endY);
        ctx.stroke();
        
        // Root details
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#2a1a1a';
        ctx.beginPath();
        ctx.moveTo(startX, endY);
        ctx.lineTo(startX + 10, endY + 10);
        ctx.stroke();
      }
    });
  };

  const drawVaultDoor = (ctx, width, height) => {
    const doorWidth = width * 0.4;
    const doorHeight = height * 0.6;
    const doorX = width * 0.5 - doorWidth / 2;
    const doorY = height * 0.2;
    
    // Door frame
    ctx.fillStyle = dungeonColors.vault;
    ctx.fillRect(doorX - 20, doorY - 20, doorWidth + 40, doorHeight + 40);
    
    // Door itself
    ctx.fillStyle = '#3a2c1a';
    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
    
    // Door panels
    ctx.strokeStyle = '#2a1a1a';
    ctx.lineWidth = 3;
    ctx.strokeRect(doorX + 20, doorY + 20, doorWidth - 40, doorHeight - 40);
    
    // Door handle
    ctx.fillStyle = dungeonColors.thoradin.gold;
    ctx.beginPath();
    ctx.arc(doorX + doorWidth - 30, doorY + doorHeight / 2, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Door details
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    
    // Vertical panels
    for (let x = doorX + 40; x < doorX + doorWidth - 40; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, doorY + 20);
      ctx.lineTo(x, doorY + doorHeight - 20);
      ctx.stroke();
    }
    
    // Horizontal panels
    for (let y = doorY + 40; y < doorY + doorHeight - 40; y += 80) {
      ctx.beginPath();
      ctx.moveTo(doorX + 20, y);
      ctx.lineTo(doorX + doorWidth - 20, y);
      ctx.stroke();
    }
  };

  const drawThoradin = (ctx, width, height) => {
    const thoradinX = width * 0.5;
    const thoradinY = height * 0.7;
    const scale = 0.8;
    
    // Character shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(thoradinX + 10, thoradinY + 80, 40, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloak
    ctx.fillStyle = dungeonColors.thoradin.cloak;
    ctx.beginPath();
    ctx.ellipse(thoradinX, thoradinY + 20, 35, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloak hood
    ctx.beginPath();
    ctx.arc(thoradinX, thoradinY - 10, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = dungeonColors.thoradin.skin;
    ctx.beginPath();
    ctx.arc(thoradinX, thoradinY - 15, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Beard
    ctx.fillStyle = '#2a1a1a';
    ctx.beginPath();
    ctx.ellipse(thoradinX, thoradinY - 5, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes (glowing blue)
    ctx.fillStyle = dungeonColors.thoradin.eyes;
    ctx.shadowColor = dungeonColors.thoradin.eyes;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(thoradinX - 8, thoradinY - 20, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(thoradinX + 8, thoradinY - 20, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Golden circlet
    ctx.fillStyle = dungeonColors.thoradin.gold;
    ctx.beginPath();
    ctx.arc(thoradinX, thoradinY - 25, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // Golden brooch
    ctx.fillStyle = dungeonColors.thoradin.gold;
    ctx.beginPath();
    ctx.arc(thoradinX, thoradinY + 10, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Brooch spiral design
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(thoradinX, thoradinY + 10, 8, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawAtmosphericLighting = (ctx, width, height) => {
    // Torch lighting effect
    const torchX = width * 0.2;
    const torchY = height * 0.3;
    
    // Torch glow
    const radialGradient = ctx.createRadialGradient(torchX, torchY, 0, torchX, torchY, 200);
    radialGradient.addColorStop(0, dungeonColors.lighting.torch);
    radialGradient.addColorStop(0.3, dungeonColors.lighting.glow);
    radialGradient.addColorStop(1, 'transparent');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = radialGradient;
    ctx.fillRect(torchX - 200, torchY - 200, 400, 400);
    ctx.globalCompositeOperation = 'source-over';
    
    // Ambient lighting
    ctx.fillStyle = 'rgba(42, 26, 26, 0.1)';
    ctx.fillRect(0, 0, width, height);
  };

  // Animation loop
  const animate = () => {
    drawDungeonScene();
    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Start animation
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
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
        
        console.log(`🎯 Starting dungeon zoom to (${centerX.toFixed(3)}, ${centerY.toFixed(3)})`);
        
        // Convert normalized coordinates to canvas coordinates
        const targetX = centerX * canvas.width;
        const targetY = centerY * canvas.height;
        
        // Create zoom effect
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
          
          // Redraw scene
          drawDungeonScene();
          
          ctx.restore();
          
          if (progress < 1) {
            requestAnimationFrame(animateZoom);
          } else {
            console.log('✅ Dungeon zoom completed');
            resolve();
          }
        };
        
        requestAnimationFrame(animateZoom);
      });
    },
    
    fastForwardToEnd: () => {
      console.log('🎬 Dungeon scene fast-forward completed');
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

export default DungeonVaultCanvas; 