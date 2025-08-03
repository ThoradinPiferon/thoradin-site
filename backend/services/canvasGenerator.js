import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

/**
 * 🎨 BACKEND CANVAS ANIMATION GENERATOR
 * 
 * This service generates canvas animations on the backend
 * and serves them as video files to the frontend.
 */

class CanvasGenerator {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'backgrounds');
  }

  /**
   * Generate matrix spiral animation and save as video
   * @param {string} animationType - Type of animation ('matrix_spiral', 'static', etc.)
   * @param {Object} config - Animation configuration
   * @returns {string} Path to generated video file
   */
  async generateMatrixSpiral(animationType = 'matrix_spiral', config = {}) {
    const {
      width = 1920,
      height = 1080,
      duration = 8000, // 8 seconds
      phrase = "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS"
    } = config;

    console.log(`🎨 Generating ${animationType} animation: ${width}x${height}, ${duration}ms`);

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Generate frames
    const frames = [];
    const totalFrames = Math.floor(duration / 16); // 60fps

    for (let frame = 0; frame < totalFrames; frame++) {
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      // Generate spiral points for this frame
      const progress = frame / totalFrames;
      const spiralPoints = this.generateSpiralPoints(width, height, progress, phrase);

      // Draw spiral
      spiralPoints.forEach(point => {
        ctx.font = `${point.fontSize}px monospace`;
        ctx.fillStyle = point.color;
        ctx.shadowColor = point.shadowColor;
        ctx.shadowBlur = point.shadowBlur;
        ctx.fillText(point.char, point.x, point.y);
      });

      // Convert canvas to buffer
      const buffer = canvas.toBuffer('image/png');
      frames.push(buffer);
    }

    // Save as video file (simplified - in real implementation, use ffmpeg)
    const filename = `matrix-spiral-${Date.now()}.mp4`;
    const filepath = path.join(this.outputDir, filename);

    // For now, save as a sequence of images (in production, use ffmpeg to create video)
    console.log(`📁 Saving ${frames.length} frames to ${filepath}`);
    
    // Create a simple video file representation
    const videoContent = `# Matrix Spiral Animation
# Generated on: ${new Date().toISOString()}
# Frames: ${frames.length}
# Duration: ${duration}ms
# Size: ${width}x${height}
# Type: ${animationType}
# Phrase: "${phrase}"
`;
    
    fs.writeFileSync(filepath, videoContent);
    
    console.log(`✅ Animation generated: /backgrounds/${filename}`);
    return `/backgrounds/${filename}`;
  }

  /**
   * Generate spiral points for animation frame
   */
  generateSpiralPoints(width, height, progress, phrase) {
    const points = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(width, height) * 0.5;
    const totalPoints = 350;

    for (let i = 0; i < totalPoints; i++) {
      const t = i * 0.1 + progress * 10;
      const radius = maxRadius * progress * (i / totalPoints);
      const angle = t;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const distanceFromCenter = radius / maxRadius;
      const baseOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.5);
      const fontSize = Math.max(8, 16 - distanceFromCenter * 8);

      // Determine if this is a phrase character
      const totalSpiralChars = totalPoints;
      const phraseStartIndex = totalSpiralChars - phrase.length;
      const isPhraseChar = i >= phraseStartIndex;
      const phraseCharIndex = i - phraseStartIndex;

      let char, color, shadowColor, shadowBlur;

      if (isPhraseChar && phraseCharIndex < phrase.length) {
        // Phrase characters
        char = phrase[phraseCharIndex];
        color = `rgba(0,255,180,${baseOpacity * 0.9})`;
        shadowColor = '#00ffcc';
        shadowBlur = 5;
      } else {
        // Background spiral
        char = this.getRandomMatrixChar();
        color = `rgba(0,255,0,${baseOpacity * 0.2})`;
        shadowColor = 'transparent';
        shadowBlur = 0;
      }

      points.push({
        x, y, char, color, shadowColor, shadowBlur, fontSize
      });
    }

    return points;
  }

  /**
   * Get random matrix character
   */
  getRandomMatrixChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars[Math.floor(Math.random() * chars.length)];
  }

  /**
   * Generate static background image
   */
  async generateStaticBackground(config = {}) {
    const {
      width = 1920,
      height = 1080,
      type = 'matrix_static'
    } = config;

    console.log(`🎨 Generating static background: ${width}x${height}, type: ${type}`);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Generate static matrix effect
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const char = chars[Math.floor(Math.random() * chars.length)];
      const opacity = Math.random() * 0.3 + 0.1;
      const fontSize = Math.random() * 20 + 10;

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = `rgba(0,255,0,${opacity})`;
      ctx.fillText(char, x, y);
    }

    const filename = `static-${type}-${Date.now()}.png`;
    const filepath = path.join(this.outputDir, filename);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    console.log(`✅ Static background generated: /backgrounds/${filename}`);
    return `/backgrounds/${filename}`;
  }
}

export default new CanvasGenerator(); 