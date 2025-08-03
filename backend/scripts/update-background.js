#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎬 BACKGROUND UPDATE SCRIPT
 * 
 * This script demonstrates how to update background paths in the database
 * to change backgrounds dynamically without code deployments.
 */

async function updateBackground() {
  try {
    console.log('🎬 Updating background for scenario 1.1...');
    
    // Update the background path in the database
    const updatedScenario = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 1
        }
      },
      update: {
        backgroundPath: '/backgrounds/matrix-spiral.mp4' // Change this to any background file
      },
      create: {
        sceneId: 1,
        subsceneId: 1,
        title: 'Matrix Awakening',
        description: 'The spiral begins to spin...',
        backgroundPath: '/backgrounds/matrix-spiral.mp4',
        gridConfig: {
          rows: 7,
          cols: 11,
          gap: '2px',
          padding: '20px',
          debug: false,
          invisibleMode: false,
          matrixAnimationMode: true,
          triggerTile: 'A1'
        },
        metadata: {
          backgroundType: 'matrix_spiral',
          backgroundImage: null,
          effects: {
            autoAdvanceAfter: 8000,
            nextScene: { sceneId: 1, subsceneId: 2 }
          }
        },
        tiles: [
          {
            id: 'A1',
            handler: 'frontend',
            actions: {
              frontend: ['cursor_zoom', 'matrix_trigger'],
              backend: null
            },
            effects: {
              animationSpeed: 'fast'
            }
          }
        ],
        nextScenes: [
          {
            sceneId: 1,
            subsceneId: 2,
            triggerTile: 'A1',
            label: 'Fast-forward Matrix Animation'
          }
        ]
      }
    });
    
    console.log('✅ Background updated successfully!');
    console.log('📁 New background path:', updatedScenario.backgroundPath);
    console.log('🌐 The website will now use this background file');
    console.log('💡 To change backgrounds:');
    console.log('   1. Upload new file to backend/public/backgrounds/');
    console.log('   2. Update backgroundPath in database');
    console.log('   3. Refresh the website');
    
  } catch (error) {
    console.error('❌ Error updating background:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateBackground(); 