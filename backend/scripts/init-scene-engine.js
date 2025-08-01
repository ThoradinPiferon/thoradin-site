const { PrismaClient } = require('@prisma/client');
const sceneEngine = require('../services/sceneEngine');
const sceneSeed = require('../services/sceneSeed');

const prisma = new PrismaClient();

/**
 * Initialize Scene Engine with default scenes
 * 
 * This script seeds the database with default scenes using the scene seed structure.
 * It validates each scene seed before creating the database entries.
 */

async function initializeSceneEngine() {
  console.log('🎭 Initializing Scene Engine...');

  try {
    // Get default scene seeds
    const defaultSeeds = sceneSeed.getDefaultSceneSeeds();
    console.log(`📋 Found ${defaultSeeds.length} default scene seeds`);

    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const seed of defaultSeeds) {
      try {
        // Validate the scene seed
        const validation = sceneSeed.validateSceneSeed(seed);
        
        if (!validation.isValid) {
          console.error(`❌ Scene ${seed.sceneId}.${seed.subsceneId} validation failed:`, validation.errors);
          errorCount++;
          continue;
        }

        console.log(`✅ Scene ${seed.sceneId}.${seed.subsceneId} validation passed`);

        // Convert seed to database format
        const dbScene = sceneSeed.seedToDatabase(seed);
        
        // Create or update the scene in database
        const result = await sceneEngine.upsertScene(dbScene);
        
        if (result) {
          console.log(`🎭 Scene ${seed.sceneId}.${seed.subsceneId}: ${seed.title} - ${result.id ? 'Updated' : 'Created'}`);
          if (result.id) {
            updatedCount++;
          } else {
            createdCount++;
          }
        }

      } catch (error) {
        console.error(`❌ Error processing scene ${seed.sceneId}.${seed.subsceneId}:`, error.message);
        errorCount++;
      }
    }

    // Summary
    console.log('\n📊 Scene Engine Initialization Summary:');
    console.log(`✅ Created: ${createdCount} scenes`);
    console.log(`🔄 Updated: ${updatedCount} scenes`);
    console.log(`❌ Errors: ${errorCount} scenes`);
    console.log(`📋 Total processed: ${defaultSeeds.length} scenes`);

    // Verify all scenes are in database
    const allScenes = await sceneEngine.getAllScenes();
    console.log(`🎭 Total scenes in database: ${allScenes.length}`);

    // Display scene information
    console.log('\n🎭 Available Scenes:');
    allScenes.forEach(scene => {
      console.log(`  - Scene ${scene.sceneId}.${scene.subsceneId}: ${scene.title} (${scene.backgroundType})`);
    });

    console.log('\n🎉 Scene Engine initialization completed!');

  } catch (error) {
    console.error('❌ Scene Engine initialization failed:', error);
    throw error;
  }
}

/**
 * Test scene engine functionality
 */
async function testSceneEngine() {
  console.log('\n🧪 Testing Scene Engine...');

  try {
    // Test Scene 1.1 logic
    console.log('\n🎭 Testing Scene 1.1 (Matrix Running):');
    const scene1_1 = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 1,
      subsceneId: 1,
      gridId: 'G1.1',
      action: 'grid_click'
    });
    console.log('Scene 1.1 Response:', scene1_1);

    // Test Scene 1.2 logic
    console.log('\n🎭 Testing Scene 1.2 (Matrix Static - G11.7):');
    const scene1_2_vault = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 1,
      subsceneId: 2,
      gridId: 'G11.7',
      action: 'grid_click'
    });
    console.log('Scene 1.2 (G11.7) Response:', scene1_2_vault);

    // Test Scene 1.2 logic (other grid)
    console.log('\n🎭 Testing Scene 1.2 (Matrix Static - G1.1):');
    const scene1_2_restart = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 1,
      subsceneId: 2,
      gridId: 'G1.1',
      action: 'grid_click'
    });
    console.log('Scene 1.2 (G1.1) Response:', scene1_2_restart);

    // Test Scene 2.1 logic
    console.log('\n🎭 Testing Scene 2.1 (Vault - G11.7):');
    const scene2_1 = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 2,
      subsceneId: 1,
      gridId: 'G11.7',
      action: 'grid_click'
    });
    console.log('Scene 2.1 Response:', scene2_1);

    console.log('\n✅ Scene Engine tests completed successfully!');

  } catch (error) {
    console.error('❌ Scene Engine test failed:', error);
    throw error;
  }
}

async function main() {
  try {
    await initializeSceneEngine();
    await testSceneEngine();
    console.log('\n🎉 Scene Engine setup and testing completed successfully!');
  } catch (error) {
    console.error('💥 Scene Engine setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  initializeSceneEngine,
  testSceneEngine
}; 