import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createScenario13() {
  try {
    console.log('🎭 Creating scenario 1.3...');
    
    const scenarioData = {
      sceneId: 1,
      subsceneId: 3,
      title: "Thoradin's Vault",
      description: "Deep underground, roots of an ancient tree hang from the ceiling. A massive vault door stands closed, with Thoradin waiting before it.",
      gridConfig: { 
        rows: 7, 
        cols: 11,
        gap: '2px',
        padding: '20px',
        debug: false,
        invisibleMode: true,
        matrixAnimationMode: false,
        triggerTile: null,
        backgroundType: "dungeon_vault"
      },
      animationConfig: {
        type: "dungeon_vault",
        speed: "normal",
        colors: {
          primary: "#1a0f0f",
          secondary: "#2a1a1a",
          background: "#000000"
        },
        text: "THORADIN'S VAULT: ENTER THE UNDERGROUND REALM",
        duration: 0,
        effects: { 
          glow: false, 
          fade: false, 
          spiral: false,
          dungeonTheme: true
        },
        interactiveParams: { 
          zoomSpeed: 1.2, 
          cursorSensitivity: 0.8, 
          animationPause: false 
        }
      }
    };
    
    await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 3
        }
      },
      update: scenarioData,
      create: scenarioData
    });
    
    console.log('✅ Scenario 1.3 created successfully!');
    
    // Test the scenario
    const testScenario = await prisma.scenario.findUnique({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 3
        }
      }
    });
    
    console.log('📋 Scenario 1.3 details:');
    console.log(`  Title: ${testScenario.title}`);
    console.log(`  Background: ${testScenario.backgroundType}`);
    console.log(`  Grid: ${testScenario.gridConfig}`);
    
  } catch (error) {
    console.error('❌ Error creating scenario 1.3:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createScenario13(); 