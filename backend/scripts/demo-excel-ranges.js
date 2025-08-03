#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 📊 EXCEL RANGE DEMONSTRATION
 * 
 * This script demonstrates different Excel range configurations
 * for various grid sizes and layouts.
 */

const excelRangeExamples = [
  {
    name: 'Single Cell',
    range: 'A1:A1',
    rows: 1,
    cols: 1,
    description: 'A single cell grid for focused interaction'
  },
  {
    name: 'Small Grid',
    range: 'A1:C3',
    rows: 3,
    cols: 3,
    description: 'A 3x3 grid for basic interactions'
  },
  {
    name: 'Wide Grid',
    range: 'A1:K7',
    rows: 7,
    cols: 11,
    description: 'A wide grid for complex layouts'
  },
  {
    name: 'Tall Grid',
    range: 'A1:D10',
    rows: 10,
    cols: 4,
    description: 'A tall grid for vertical layouts'
  },
  {
    name: 'Large Grid',
    range: 'A1:Z26',
    rows: 26,
    cols: 26,
    description: 'A large grid for extensive layouts'
  }
];

async function demoExcelRanges() {
  try {
    console.log('📊 Excel Range Demonstration');
    console.log('=============================');
    
    for (const example of excelRangeExamples) {
      console.log(`\n🎯 ${example.name}:`);
      console.log(`   Range: ${example.range}`);
      console.log(`   Size: ${example.rows}x${example.cols}`);
      console.log(`   Description: ${example.description}`);
      
      // Update scenario 1.1 with this configuration
      const updatedScenario = await prisma.scenario.update({
        where: {
          sceneId_subsceneId: {
            sceneId: 1,
            subsceneId: 1
          }
        },
        data: {
          title: `Matrix Awakening - ${example.name}`,
          description: example.description,
          gridConfig: {
            rows: example.rows,
            cols: example.cols,
            gap: "2px",
            padding: "20px",
            debug: false,
            invisibleMode: false,
            matrixAnimationMode: true,
            triggerTile: "A1",
            excelRange: example.range
          }
        }
      });
      
      console.log(`   ✅ Updated to ${example.range}`);
      
      // Test API response
      const response = await fetch('http://localhost:3001/api/scenario?sceneId=1&subsceneId=1');
      const data = await response.json();
      
      if (data.success) {
        console.log(`   📊 API confirms: ${data.gridConfig.excelRange} (${data.gridConfig.rows}x${data.gridConfig.cols})`);
      }
      
      // Wait a moment between updates
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Excel range demonstration complete!');
    console.log('💡 To use different ranges:');
    console.log('   1. Update the excelRange in the database');
    console.log('   2. Refresh the website');
    console.log('   3. The grid will automatically adjust');
    
  } catch (error) {
    console.error('❌ Error in Excel range demo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the demonstration
demoExcelRanges(); 