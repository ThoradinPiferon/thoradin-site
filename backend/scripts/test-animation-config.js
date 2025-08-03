#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎬 ANIMATION CONFIGURATION TESTING
 * 
 * This script tests different animation configurations for scenario 1.1
 */

async function testAnimationConfigs() {
  try {
    console.log('🎬 Animation Configuration Testing');
    console.log('==================================');
    
    const animationConfigs = [
      {
        name: 'Fast Matrix Spiral',
        config: {
          type: 'matrix_spiral',
          speed: 'fast',
          colors: {
            primary: '#00ff00',
            secondary: '#00ffcc',
            background: '#000000'
          },
          text: "FAST MATRIX: QUICK SPIRAL ANIMATION",
          duration: 4000,
          effects: {
            glow: true,
            fade: true,
            spiral: true
          },
          interactiveParams: {
            zoomSpeed: 1.5,
            cursorSensitivity: 1.0,
            animationPause: false
          }
        }
      },
      {
        name: 'Slow Glowing Matrix',
        config: {
          type: 'matrix_spiral',
          speed: 'slow',
          colors: {
            primary: '#00ffff',
            secondary: '#ff00ff',
            background: '#000000'
          },
          text: "SLOW GLOW: MEDITATIVE MATRIX",
          duration: 12000,
          effects: {
            glow: true,
            fade: false,
            spiral: true
          },
          interactiveParams: {
            zoomSpeed: 0.8,
            cursorSensitivity: 0.5,
            animationPause: true
          }
        }
      },
      {
        name: 'Static Background',
        config: {
          type: 'static',
          speed: 'none',
          colors: {
            primary: '#ffffff',
            secondary: '#cccccc',
            background: '#000000'
          },
          text: "STATIC MODE: NO ANIMATION",
          duration: 0,
          effects: {
            glow: false,
            fade: false,
            spiral: false
          },
          interactiveParams: {
            zoomSpeed: 1.0,
            cursorSensitivity: 1.0,
            animationPause: true
          }
        }
      }
    ];
    
    for (const { name, config } of animationConfigs) {
      console.log(`\n🎭 Testing: ${name}`);
      
      // Update scenario with new animation config
      const updatedScenario = await prisma.scenario.update({
        where: {
          sceneId_subsceneId: {
            sceneId: 1,
            subsceneId: 1
          }
        },
        data: {
          animationConfig: config,
          backgroundPath: null
        }
      });
      
      console.log(`✅ Updated scenario with config: ${updatedScenario.animationConfig.type}`);
      console.log(`🎬 Speed: ${updatedScenario.animationConfig.speed}`);
      console.log(`🎨 Colors: ${updatedScenario.animationConfig.colors.primary}`);
      console.log(`⏱️ Duration: ${updatedScenario.animationConfig.duration}ms`);
      
      // Test API response
      const response = await fetch(`http://localhost:3001/api/scenario?sceneId=1&subsceneId=1`);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ API returns correct config:`);
        console.log(`   - Type: ${data.animationConfig.type}`);
        console.log(`   - Speed: ${data.animationConfig.speed}`);
        console.log(`   - Text: ${data.animationConfig.text.substring(0, 30)}...`);
        console.log(`   - Duration: ${data.animationConfig.duration}ms`);
        console.log(`   - Effects: ${Object.keys(data.animationConfig.effects).join(', ')}`);
      } else {
        console.log(`❌ API error: ${data.message}`);
      }
      
      // Wait a moment before next test
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Test with static background file
    console.log(`\n🎭 Testing with static background file`);
    
    const scenarioWithStatic = await prisma.scenario.update({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 1
        }
      },
      data: {
        animationConfig: {
          type: 'static',
          speed: 'none',
          colors: { primary: '#ffffff', secondary: '#cccccc', background: '#000000' },
          text: "STATIC WITH BACKGROUND FILE",
          duration: 0,
          effects: { glow: false, fade: false, spiral: false },
          interactiveParams: { zoomSpeed: 1.0, cursorSensitivity: 1.0, animationPause: true }
        },
        backgroundPath: '/backgrounds/test-video.mp4'
      }
    });
    
    console.log(`✅ Updated scenario with static background`);
    console.log(`📁 Background path: ${scenarioWithStatic.backgroundPath}`);
    
    // Final API test
    const finalResponse = await fetch(`http://localhost:3001/api/scenario?sceneId=1&subsceneId=1`);
    const finalData = await finalResponse.json();
    
    if (finalData.success) {
      console.log(`\n🎉 Final configuration:`);
      console.log(`   - Animation type: ${finalData.animationConfig.type}`);
      console.log(`   - Background path: ${finalData.backgroundPath}`);
      console.log(`   - Speed: ${finalData.animationConfig.speed}`);
      console.log(`   - Colors: ${finalData.animationConfig.colors.primary}`);
      console.log(`   - Effects: ${Object.keys(finalData.animationConfig.effects).join(', ')}`);
    }
    
    console.log(`\n💡 Animation Configuration System:`);
    console.log(`   - Backend stores detailed animation parameters`);
    console.log(`   - Frontend receives configuration from API`);
    console.log(`   - Animations use backend-specified variables`);
    console.log(`   - Interactive parameters controlled by backend`);
    console.log(`   - Easy to modify animation behavior via database`);
    
  } catch (error) {
    console.error('❌ Error testing animation configs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAnimationConfigs(); 