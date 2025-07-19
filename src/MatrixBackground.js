import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Alphanumeric characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charArray = chars.split('');
    
    // Fibonacci sequence generator
    const generateFibonacci = (max) => {
      const fib = [0, 1];
      while (fib[fib.length - 1] + fib[fib.length - 2] <= max) {
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
      }
      return fib;
    };
    
    // Generate Fibonacci sequence up to character array length
    const fibonacci = generateFibonacci(charArray.length);
    
    // Animation parameters
    let rotationAngle = 0;
    let direction = 1; // 1 for clockwise, -1 for counter-clockwise
    let lastDirectionChange = Date.now();
    const directionChangeInterval = 30000; // 30 seconds
    const rotationSpeed = 0.001; // Doubled rotation speed (increased from 0.0005)
    
    // Spiral parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.max(canvas.width, canvas.height) / 2;
    const minRadius = 10;
    
    // Draw animated spiral
    const drawSpiral = () => {
      // Check if it's time to change direction
      const currentTime = Date.now();
      if (currentTime - lastDirectionChange > directionChangeInterval) {
        direction *= -1; // Reverse direction
        lastDirectionChange = currentTime;
      }
      
      // Update rotation angle
      rotationAngle += rotationSpeed * direction;
      
      let currentRadius = maxRadius;
      let currentAngle = rotationAngle;
      const angleStep = 0.08; // Closer spacing between spiral turns
      const radiusDecay = 0.998; // Slower decay for closer spacing
      let charIndex = 0; // Track position in character array
      
      while (currentRadius > minRadius) {
        const x = centerX + Math.cos(currentAngle) * currentRadius;
        const y = centerY + Math.sin(currentAngle) * currentRadius;
        
        // Only draw if within canvas bounds
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          // Use Fibonacci pattern to select character
          const fibIndex = charIndex % fibonacci.length;
          const char = charArray[fibonacci[fibIndex] % charArray.length];
          
          // Calculate size based on radius - bigger on outside, smaller on inside
          const sizeRatio = currentRadius / maxRadius; // 1.0 at outside, 0.0 at center
          const minSize = 8; // Smallest size at center
          const maxSize = 32; // Largest size at outside
          const size = minSize + (maxSize - minSize) * sizeRatio;
          
          const opacity = Math.random() * 0.08 + 0.8; // Doubled opacity variation (increased from 0.04 to 0.08)
          
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = `rgb(0, ${Math.floor(255 * opacity)}, 0)`;
          ctx.font = `bold ${size}px monospace`;
          ctx.fillText(char, x, y);
          ctx.restore();
          
          charIndex++;
        }
        
        currentAngle += angleStep;
        currentRadius *= radiusDecay;
      }
    };
    
    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw spiral
      drawSpiral();
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'black'
      }}
    />
  );
};

export default MatrixBackground; 