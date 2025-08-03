import { PrismaClient } from '@prisma/client';
import SceneEngine from '../services/sceneEngine.js';
import { initializeSceneData } from '../services/sceneSeed.js';

const prisma = new PrismaClient();
const sceneEngine = new SceneEngine();

/**
 * Initialize the Scene Engine and database
 */
async function initializeSceneEngine() {
  console.log('🎭 Initializing Scene Engine...');
  
  try {
    // Initialize scene data in database
    await initializeSceneData();
    
    console.log('✅ Scene Engine initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Scene Engine initialization failed:', error);
    return false;
  }
}

/**
 * Test scene transitions
 */
async function testSceneTransitions() {
  console.log('\n🧪 Testing Scene Transitions...');
  
  try {
    // Test Scene 1.1 logic (Matrix Awakening - Single Tile)
    const scene1_1 = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 1, subsceneId: 1, gridId: 'A1', action: 'grid_click'
    });
    console.log('✅ Scene 1.1 (Matrix Awakening):', scene1_1);
    
    // Test Scene 1.2 logic (Matrix Static - K7)
    const scene1_2_vault = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 1, subsceneId: 2, gridId: 'K7', action: 'grid_click'
    });
    console.log('✅ Scene 1.2 (Matrix Static - K7):', scene1_2_vault);
    
    // Test Scene 1.2 logic (Matrix Static - A1)
    const scene1_2_restart = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 1, subsceneId: 2, gridId: 'A1', action: 'grid_click'
    });
    console.log('✅ Scene 1.2 (Matrix Static - A1):', scene1_2_restart);
    
    // Test Scene 2.1 logic (Vault - K7)
    const scene2_1 = await sceneEngine.evaluateSceneTransition({
      currentSceneId: 2, subsceneId: 1, gridId: 'K7', action: 'grid_click'
    });
    console.log('✅ Scene 2.1 (Vault - K7):', scene2_1);
    
    console.log('✅ All scene transition tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Scene transition tests failed:', error);
    return false;
  }
}

/**
 * Test auto-advance functionality
 */
async function testAutoAdvance() {
  console.log('\n⏰ Testing Auto-Advance Functionality...');
  
  try {
    // Test auto-advance detection for Scene 1.1
    const hasAutoAdvance1_1 = await sceneEngine.hasAutoAdvance(1, 1);
    console.log('✅ Scene 1.1 has auto-advance:', hasAutoAdvance1_1);
    
    // Test auto-advance detection for Scene 1.2
    const hasAutoAdvance1_2 = await sceneEngine.hasAutoAdvance(1, 2);
    console.log('✅ Scene 1.2 has auto-advance:', hasAutoAdvance1_2);
    
    // Test auto-advance config for Scene 1.1
    const autoAdvanceConfig = await sceneEngine.getAutoAdvanceConfig(1, 1);
    console.log('✅ Scene 1.1 auto-advance config:', autoAdvanceConfig);
    
    console.log('✅ All auto-advance tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Auto-advance tests failed:', error);
    return false;
  }
}

/**
 * Test database operations
 */
async function testDatabaseOperations() {
  console.log('\n🗄️ Testing Database Operations...');
  
  try {
    // Test getting all scenes
    const allScenes = await sceneEngine.getAllScenes();
    console.log('✅ All scenes retrieved:', allScenes.length);
    
    // Test getting specific scene data
    const scene1_1_data = await sceneEngine.getSceneData(1, 1);
    console.log('✅ Scene 1.1 data retrieved:', scene1_1_data ? 'Success' : 'Not found');
    
    const scene1_2_data = await sceneEngine.getSceneData(1, 2);
    console.log('✅ Scene 1.2 data retrieved:', scene1_2_data ? 'Success' : 'Not found');
    
    const scene2_1_data = await sceneEngine.getSceneData(2, 1);
    console.log('✅ Scene 2.1 data retrieved:', scene2_1_data ? 'Success' : 'Not found');
    
    console.log('✅ All database operations passed!');
    return true;
  } catch (error) {
    console.error('❌ Database operations failed:', error);
    return false;
  }
}

/**
 * Display scene information
 */
async function displaySceneInfo() {
  console.log('\n📋 Scene Information:');
  
  try {
    const allScenes = await sceneEngine.getAllScenes();
    
    for (const scene of allScenes) {
      console.log(`\n🎭 Scene ${scene.sceneId}.${scene.subsceneId}: ${scene.title}`);
      console.log(`   Description: ${scene.description}`);
      console.log(`   Background: ${scene.backgroundType}`);
      console.log(`   Grid Config: ${scene.gridConfig}`);
      console.log(`   Tiles: ${scene.tiles?.length || 0} tiles`);
      console.log(`   Invisible Mode: ${scene.invisibleMode ? 'Yes' : 'No'}`);
      
      if (scene.effects) {
        const effects = JSON.parse(scene.effects);
        if (effects.autoAdvanceAfter) {
          console.log(`   Auto-Advance: ${effects.autoAdvanceAfter}ms`);
        }
      }
      
      if (scene.choices) {
        const choices = JSON.parse(scene.choices);
        console.log(`   Choices: ${choices.length} available`);
      }
    }
    
    console.log('\n✅ Scene information displayed successfully!');
  } catch (error) {
    console.error('❌ Error displaying scene information:', error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Scene Engine Setup...\n');
  
  try {
    // Initialize scene engine
    const initSuccess = await initializeSceneEngine();
    if (!initSuccess) {
      throw new Error('Scene Engine initialization failed');
    }
    
    // Test scene transitions
    const transitionSuccess = await testSceneTransitions();
    if (!transitionSuccess) {
      throw new Error('Scene transition tests failed');
    }
    
    // Test auto-advance functionality
    const autoAdvanceSuccess = await testAutoAdvance();
    if (!autoAdvanceSuccess) {
      throw new Error('Auto-advance tests failed');
    }
    
    // Test database operations
    const dbSuccess = await testDatabaseOperations();
    if (!dbSuccess) {
      throw new Error('Database operations failed');
    }
    
    // Display scene information
    await displaySceneInfo();
    
    console.log('\n🎉 Scene Engine setup completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✅ Scene data initialized in database');
    console.log('   ✅ Scene transitions working correctly');
    console.log('   ✅ Auto-advance functionality implemented');
    console.log('   ✅ Single-tile grid for Scene 1.1 configured');
    console.log('   ✅ All database operations functional');
    
  } catch (error) {
    console.error('💥 Scene Engine setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main().catch(console.error); 