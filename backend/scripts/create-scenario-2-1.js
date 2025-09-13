import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createScenario21() {
  try {
    console.log('🎭 Creating scenario 2.1...');
    
    const scenarioData = {
      sceneId: 2,
      subsceneId: 1,
      title: "The Mystery of the Tree of Wisdom (Intro)",
      description: "A rainy, dark forest night. At the center stands the Tree of Wisdom, massive, with gnarled roots and faint glowing spirals etched into its bark. A cloaked gardener stands on the right side, holding a lantern that casts a warm glow and a shovel planted in the wet ground.",
      gridConfig: { 
        rows: 7, 
        cols: 11,
        gap: '2px',
        padding: '20px',
        debug: false,
        invisibleMode: true,
        matrixAnimationMode: false,
        triggerTile: null,
        backgroundType: "tree_of_wisdom"
      },
      animationConfig: {
        type: "tree_of_wisdom",
        speed: "normal",
        colors: {
          primary: "#2d5016",
          secondary: "#4a7c59",
          background: "#0a1a0a"
        },
        text: "THE MYSTERY OF THE TREE OF WISDOM: RAINY FOREST NIGHT",
        duration: 0,
        effects: { 
          glow: true, 
          fade: false, 
          spiral: false,
          rainEffect: true,
          thunderEffect: true,
          lanternGlow: true
        },
        interactiveParams: { 
          zoomSpeed: 1.2, 
          cursorSensitivity: 0.8, 
          animationPause: false,
          rainIntensity: 0.7,
          thunderFrequency: 0.3
        }
      },
      backgroundPath: "tree-wisdom-rainy-night.jpg"
    };
    
    await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 2,
          subsceneId: 1
        }
      },
      update: scenarioData,
      create: scenarioData
    });
    
    console.log('✅ Scenario 2.1 created successfully!');
    
    // Test the scenario
    const testScenario = await prisma.scenario.findUnique({
      where: {
        sceneId_subsceneId: {
          sceneId: 2,
          subsceneId: 1
        }
      }
    });
    
    console.log('📋 Scenario 2.1 details:');
    console.log(`  Title: ${testScenario.title}`);
    console.log(`  Grid: ${JSON.stringify(testScenario.gridConfig)}`);
    console.log(`  Animation: ${JSON.stringify(testScenario.animationConfig)}`);
    
  } catch (error) {
    console.error('❌ Error creating scenario 2.1:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createScenario21(); 