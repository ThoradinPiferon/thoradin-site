#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * 🎬 BACKGROUND CHANGE DEMONSTRATION
 * 
 * This script demonstrates how to change backgrounds dynamically
 * by updating the database and uploading new files.
 */

async function demoBackgroundChange() {
  try {
    console.log('🎬 Background Change Demonstration');
    console.log('=====================================');
    
    // Step 1: Create a new background file
    const newBackgroundContent = '# New Dynamic Background\n# This file was created programmatically\n# You can replace this with any video/image file';
    const newBackgroundPath = path.join('public', 'backgrounds', 'dynamic-background.mp4');
    
    fs.writeFileSync(newBackgroundPath, newBackgroundContent);
    console.log('✅ Step 1: Created new background file: /backgrounds/dynamic-background.mp4');
    
    // Step 2: Update the database to use the new background
    const updatedScenario = await prisma.scenario.update({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 1
        }
      },
      data: {
        backgroundPath: '/backgrounds/dynamic-background.mp4'
      }
    });
    
    console.log('✅ Step 2: Updated database background path');
    console.log('📁 New background path:', updatedScenario.backgroundPath);
    
    // Step 3: Verify the change
    console.log('\n🌐 The website will now use the new background!');
    console.log('💡 To see the change:');
    console.log('   1. Refresh the website at http://localhost:3000');
    console.log('   2. The background should now load from the database path');
    console.log('   3. No code deployment required!');
    
    console.log('\n🎯 How to change backgrounds in production:');
    console.log('   1. Upload new file to backend/public/backgrounds/');
    console.log('   2. Run: node scripts/update-background.js');
    console.log('   3. Or use the API: POST /api/scenario with new backgroundPath');
    console.log('   4. Refresh the website');
    
  } catch (error) {
    console.error('❌ Error in background change demo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the demonstration
demoBackgroundChange(); 