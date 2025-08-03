#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 📊 EXCEL GRID UPDATE SCRIPT
 * 
 * This script updates scenario 1.1 to use Excel-style ranges
 * and configures it as a 1x1 grid (A1:A1)
 */

async function updateExcelGrid() {
  try {
    console.log('📊 Updating scenario 1.1 with Excel range support...');
    
    // Update the scenario with Excel range configuration
    const updatedScenario = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 1
        }
      },
      update: {
        gridConfig: {
          rows: 1,
          cols: 1,
          gap: "2px",
          padding: "20px",
          debug: false,
          invisibleMode: false,
          matrixAnimationMode: true,
          triggerTile: "A1",
          excelRange: "A1:A1" // Excel-style range notation
        }
      },
      create: {
        sceneId: 1,
        subsceneId: 1,
        title: 'Matrix Awakening - Single Cell',
        description: 'A single cell grid for focused interaction...',
        backgroundPath: '/backgrounds/dynamic-background.mp4',
        gridConfig: {
          rows: 1,
          cols: 1,
          gap: "2px",
          padding: "20px",
          debug: false,
          invisibleMode: false,
          matrixAnimationMode: true,
          triggerTile: "A1",
          excelRange: "A1:A1" // Excel-style range notation
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
            label: 'Expand to Full Grid'
          }
        ]
      }
    });
    
    console.log('✅ Excel grid updated successfully!');
    console.log('📊 Grid configuration:', updatedScenario.gridConfig);
    console.log('📋 Excel range: A1:A1 (1x1 grid)');
    console.log('🎯 Single tile: A1');
    
    // Test the API response
    console.log('\n🧪 Testing API response...');
    const response = await fetch('http://localhost:3001/api/scenario?sceneId=1&subsceneId=1');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API returns correct grid config:');
      console.log('   - Rows:', data.gridConfig.rows);
      console.log('   - Cols:', data.gridConfig.cols);
      console.log('   - Excel Range:', data.gridConfig.excelRange);
      console.log('   - Trigger Tile:', data.gridConfig.triggerTile);
    } else {
      console.log('❌ API test failed');
    }
    
  } catch (error) {
    console.error('❌ Error updating Excel grid:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateExcelGrid(); 