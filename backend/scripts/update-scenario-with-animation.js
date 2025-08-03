#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎬 UPDATE SCENARIO WITH ANIMATION TYPE
 * 
 * Updates scenario 1.1 with proper animation type and grid config
 */

async function updateScenarioWithAnimation() {
  try {
    console.log('🎬 Updating scenario 1.1 with animation type...');
    
    const updatedScenario = await prisma.scenario.update({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 1
        }
      },
      data: {
        title: "Thoradin's Web of Consciousness",
        description: "Enter the vault and explore the matrix of possibilities",
        gridConfig: {
          rows: 1,
          cols: 1,
          gap: "2px",
          padding: "20px",
          debug: false,
          excelRange: "A1:A1",
          triggerTile: "A1",
          invisibleMode: false,
          matrixAnimationMode: true
        },
        animationConfig: {
          type: 'matrix_spiral',
          speed: 'normal',
          colors: {
            primary: '#00ff00',
            secondary: '#00ffcc',
            background: '#000000'
          },
          text: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS",
          duration: 8000,
          effects: {
            glow: true,
            fade: true,
            spiral: true
          },
          interactiveParams: {
            zoomSpeed: 1.2,
            cursorSensitivity: 0.8,
            animationPause: false
          }
        },
        backgroundPath: null // No static file, use frontend animation
      }
    });
    
    console.log('✅ Scenario updated successfully!');
    console.log(`📊 Scenario: ${updatedScenario.sceneId}.${updatedScenario.subsceneId}`);
    console.log(`🎬 Animation type: ${updatedScenario.animationConfig.type}`);
    console.log(`📁 Background path: ${updatedScenario.backgroundPath}`);
    console.log(`📋 Grid: ${updatedScenario.gridConfig.rows}x${updatedScenario.gridConfig.cols}`);
    console.log(`🎯 Excel range: ${updatedScenario.gridConfig.excelRange}`);
    
    // Test API response
    console.log('\n🧪 Testing API response...');
    const response = await fetch('http://localhost:3001/api/scenario?sceneId=1&subsceneId=1');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API returns correct data:');
      console.log(`   - Animation type: ${data.animationConfig.type}`);
      console.log(`   - Background path: ${data.backgroundPath}`);
      console.log(`   - Grid: ${data.gridConfig.rows}x${data.gridConfig.cols}`);
      console.log(`   - Excel range: ${data.gridConfig.excelRange}`);
    }
    
    console.log('\n🎉 Animation Type System Ready!');
    console.log('💡 How it works:');
    console.log('   1. Backend specifies animation type in database');
    console.log('   2. Frontend loads animation type from API');
    console.log('   3. Frontend generates appropriate animation');
    console.log('   4. Interactive animations remain frontend-driven');
    
  } catch (error) {
    console.error('❌ Error updating scenario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateScenarioWithAnimation(); 