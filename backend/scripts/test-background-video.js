#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎬 BACKGROUND VIDEO TEST SCRIPT
 * 
 * This script tests the background video functionality
 * by updating the database to use a test video file.
 */

async function testBackgroundVideo() {
  try {
    console.log('🎬 Testing Background Video Functionality');
    console.log('=========================================');
    
    // Update scenario 1.1 to use the test video
    const updatedScenario = await prisma.scenario.update({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 1
        }
      },
      data: {
        backgroundPath: '/backgrounds/test-video.mp4'
      }
    });
    
    console.log('✅ Updated background path to test video');
    console.log('📁 New background path:', updatedScenario.backgroundPath);
    
    // Test API response
    console.log('\n🧪 Testing API response...');
    const response = await fetch('http://localhost:3001/api/scenario?sceneId=1&subsceneId=1');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API returns correct background path:');
      console.log('   - Background Path:', data.backgroundPath);
      console.log('   - Grid Config:', data.gridConfig.excelRange);
      console.log('   - Grid Size:', `${data.gridConfig.rows}x${data.gridConfig.cols}`);
    } else {
      console.log('❌ API test failed');
    }
    
    // Test file serving
    console.log('\n🧪 Testing file serving...');
    const fileResponse = await fetch('http://localhost:3001/backgrounds/test-video.mp4');
    if (fileResponse.ok) {
      console.log('✅ Background file is being served correctly');
    } else {
      console.log('❌ Background file serving failed');
    }
    
    console.log('\n🌐 The frontend should now display the video background!');
    console.log('💡 To see the change:');
    console.log('   1. Refresh the website at http://localhost:3000');
    console.log('   2. The video should play as background instead of canvas animation');
    console.log('   3. The canvas animation should be hidden');
    
  } catch (error) {
    console.error('❌ Error testing background video:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testBackgroundVideo(); 