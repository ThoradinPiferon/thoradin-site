#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎬 ANIMATION TYPE TESTING
 * 
 * This script tests different animation types for scenario 1.1
 */

async function testAnimationTypes() {
  try {
    console.log('🎬 Animation Type Testing');
    console.log('==========================');
    
    const animationTypes = [
      'matrix_spiral',
      'static',
      'custom'
    ];
    
    for (const animationType of animationTypes) {
      console.log(`\n🎭 Testing animation type: ${animationType}`);
      
      // Update scenario with new animation type
      const updatedScenario = await prisma.scenario.update({
        where: {
          sceneId_subsceneId: {
            sceneId: 1,
            subsceneId: 1
          }
        },
        data: {
          animationType: animationType,
          backgroundPath: null // No static file for frontend animations
        }
      });
      
      console.log(`✅ Updated scenario with animation type: ${updatedScenario.animationType}`);
      
      // Test API response
      const response = await fetch(`http://localhost:3001/api/scenario?sceneId=1&subsceneId=1`);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ API returns animation type: ${data.animationType}`);
        console.log(`📊 Grid config: ${data.gridConfig.rows}x${data.gridConfig.cols}`);
        console.log(`🎯 Excel range: ${data.gridConfig.excelRange}`);
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
        animationType: 'static',
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
      console.log(`   - Animation type: ${finalData.animationType}`);
      console.log(`   - Background path: ${finalData.backgroundPath}`);
      console.log(`   - Grid: ${finalData.gridConfig.rows}x${finalData.gridConfig.cols}`);
      console.log(`   - Excel range: ${finalData.gridConfig.excelRange}`);
    }
    
    console.log(`\n💡 Animation Type System:`);
    console.log(`   - Backend specifies animation type`);
    console.log(`   - Frontend generates animations based on type`);
    console.log(`   - Interactive animations remain frontend-driven`);
    console.log(`   - Static files can override animations`);
    
  } catch (error) {
    console.error('❌ Error testing animation types:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAnimationTypes(); 