#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎭 CREATE SCENARIO 1.2
 * 
 * Creates scenario 1.2 for fast-forward transition testing
 */

async function createScenario12() {
  try {
    console.log('🎭 Creating scenario 1.2 for fast-forward transition...');
    
    const scenario = await prisma.scenario.create({
      data: {
        sceneId: 1,
        subsceneId: 2,
        title: "Fast-Forward Matrix Complete",
        description: "The matrix animation has been fast-forwarded to completion",
        gridConfig: {
          rows: 3,
          cols: 3,
          gap: "2px",
          padding: "20px",
          debug: false,
          excelRange: "A1:C3",
          triggerTile: "B2",
          invisibleMode: false,
          matrixAnimationMode: false
        },
        animationConfig: {
          type: 'static',
          speed: 'none',
          colors: {
            primary: '#00ff00',
            secondary: '#00ffcc',
            background: '#000000'
          },
          text: "FAST-FORWARD COMPLETE: WELCOME TO SCENARIO 1.2",
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
        },
        backgroundPath: null
      }
    });
    
    console.log('✅ Scenario 1.2 created successfully!');
    console.log(`📊 Scenario: ${scenario.sceneId}.${scenario.subsceneId}`);
    console.log(`🎬 Animation type: ${scenario.animationConfig.type}`);
    console.log(`📋 Grid: ${scenario.gridConfig.rows}x${scenario.gridConfig.cols}`);
    console.log(`🎯 Excel range: ${scenario.gridConfig.excelRange}`);
    console.log(`📝 Text: ${scenario.animationConfig.text}`);
    
    // Test API response
    console.log('\n🧪 Testing API response for scenario 1.2...');
    const response = await fetch('http://localhost:3001/api/scenario?sceneId=1&subsceneId=2');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API returns correct data for scenario 1.2:');
      console.log(`   - Title: ${data.title}`);
      console.log(`   - Animation type: ${data.animationConfig.type}`);
      console.log(`   - Grid: ${data.gridConfig.rows}x${data.gridConfig.cols}`);
      console.log(`   - Excel range: ${data.gridConfig.excelRange}`);
    }
    
    console.log('\n🎉 Fast-forward transition ready!');
    console.log('💡 How it works:');
    console.log('   1. Click on matrix during animation');
    console.log('   2. Animation fast-forwards to end');
    console.log('   3. Automatically transitions to scenario 1.2');
    console.log('   4. New grid and animation config loaded');
    
  } catch (error) {
    console.error('❌ Error creating scenario 1.2:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createScenario12(); 