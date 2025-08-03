#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎭 CREATE TEST SCENARIO
 * 
 * Creates scenario 1.1 with animation type support
 */

async function createTestScenario() {
  try {
    console.log('🎭 Creating test scenario 1.1...');
    
    const scenario = await prisma.scenario.create({
      data: {
        sceneId: 1,
        subsceneId: 1,
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
        animationType: 'matrix_spiral',
        backgroundPath: null
      }
    });
    
    console.log('✅ Test scenario created successfully!');
    console.log(`📊 Scenario: ${scenario.sceneId}.${scenario.subsceneId}`);
    console.log(`🎬 Animation type: ${scenario.animationType}`);
    console.log(`📁 Background path: ${scenario.backgroundPath}`);
    console.log(`📋 Grid: ${scenario.gridConfig.rows}x${scenario.gridConfig.cols}`);
    
  } catch (error) {
    console.error('❌ Error creating test scenario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestScenario(); 