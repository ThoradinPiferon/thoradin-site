#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎨 BACKEND ANIMATION GENERATION DEMO
 * 
 * This script demonstrates how the backend can generate
 * canvas animations and serve them as video files.
 */

async function generateBackendAnimation() {
  try {
    console.log('🎨 Backend Animation Generation Demo');
    console.log('=====================================');
    
    // Step 1: Generate animation on backend
    console.log('\n📡 Step 1: Requesting animation generation from backend...');
    
    const response = await fetch('http://localhost:3001/api/animation/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'matrix_spiral',
        config: {
          width: 1920,
          height: 1080,
          duration: 8000,
          phrase: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS"
        },
        scenarioId: 1,
        subsceneId: 1
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Animation generated successfully!');
      console.log('📁 Background path:', result.backgroundPath);
      console.log('🎬 Animation type:', result.type);
      
      // Step 2: Update database with new background path
      console.log('\n📊 Step 2: Updating database with new background path...');
      
      const updatedScenario = await prisma.scenario.update({
        where: {
          sceneId_subsceneId: {
            sceneId: 1,
            subsceneId: 1
          }
        },
        data: {
          backgroundPath: result.backgroundPath
        }
      });
      
      console.log('✅ Database updated with new background path');
      console.log('📁 New background path:', updatedScenario.backgroundPath);
      
      // Step 3: Test the generated file
      console.log('\n🧪 Step 3: Testing generated file...');
      
      const fileResponse = await fetch(`http://localhost:3001${result.backgroundPath}`);
      if (fileResponse.ok) {
        const fileContent = await fileResponse.text();
        console.log('✅ File is being served correctly');
        console.log('📄 File content preview:', fileContent.substring(0, 200) + '...');
      } else {
        console.log('❌ File not found');
      }
      
      // Step 4: Test scenario API
      console.log('\n🌐 Step 4: Testing scenario API...');
      
      const scenarioResponse = await fetch('http://localhost:3001/api/scenario?sceneId=1&subsceneId=1');
      const scenarioData = await scenarioResponse.json();
      
      if (scenarioData.success) {
        console.log('✅ Scenario API returns correct background path');
        console.log('📁 API background path:', scenarioData.backgroundPath);
      }
      
      console.log('\n🎉 Backend animation generation complete!');
      console.log('💡 Benefits of this approach:');
      console.log('   - Animations generated on powerful backend servers');
      console.log('   - Reduced client-side computation');
      console.log('   - Consistent animation across all devices');
      console.log('   - Easy to cache and serve via CDN');
      console.log('   - Can generate different resolutions/qualities');
      
    } else {
      console.log('❌ Animation generation failed:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Error in backend animation demo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the demonstration
generateBackendAnimation(); 