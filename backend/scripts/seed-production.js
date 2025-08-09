import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const scenarios = [
  {
    sceneId: 1,
    subsceneId: 1,
    title: "Matrix Awakening",
    description: "The spiral begins to spin...",
    gridConfig: {
      rows: 1,
      cols: 1,
      gap: "2px",
      padding: "20px",
      debug: false,
      invisibleMode: false,
      matrixAnimationMode: true,
      triggerTile: "A1",
      excelRange: "A1:A1"
    },
    animationConfig: {
      type: "matrix_spiral",
      speed: "normal",
      colors: {
        primary: "#00ff00",
        secondary: "#00ffcc",
        background: "#000000"
      },
      text: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS",
      duration: 8000,
      effects: {
        glow: true,
        fade: true,
        spiral: true
      },
      interactiveParams: {
        zoomSpeed: 1.2,
        cursorSensitivity: 0.8,
        animationPause: false
      }
    },
    backgroundPath: null
  },
  {
    sceneId: 1,
    subsceneId: 2,
    title: "Matrix Complete",
    description: "The spiral has finished its dance...",
    gridConfig: {
      rows: 7,
      cols: 11,
      gap: "2px",
      padding: "20px",
      debug: false,
      invisibleMode: false,
      matrixAnimationMode: false,
      triggerTile: "F1",
      excelRange: "A1:K7"
    },
    animationConfig: {
      type: "matrix_static",
      speed: "normal",
      colors: {
        primary: "#00ff00",
        secondary: "#00ffcc",
        background: "#000000"
      },
      text: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS",
      duration: 8000,
      effects: {
        glow: true,
        fade: true,
        spiral: false
      },
      interactiveParams: {
        zoomSpeed: 1.2,
        cursorSensitivity: 0.8,
        animationPause: false
      }
    },
    backgroundPath: null
  },
  {
    sceneId: 2,
    subsceneId: 1,
    title: "Thoradin's Vault",
    description: "Deep underground, roots hang from the ceiling...",
    gridConfig: {
      rows: 7,
      cols: 11,
      gap: "2px",
      padding: "20px",
      debug: false,
      invisibleMode: false,
      matrixAnimationMode: false,
      triggerTile: "F1",
      excelRange: "A1:K7"
    },
    animationConfig: {
      type: "dungeon_vault",
      speed: "normal",
      colors: {
        primary: "#8B4513",
        secondary: "#654321",
        background: "#1a1a1a",
        accent: "#DAA520"
      },
      text: "Welcome to my vault, traveler...",
      duration: 5000,
      effects: {
        glow: true,
        fade: true,
        spiral: false
      },
      interactiveParams: {
        zoomSpeed: 1.2,
        cursorSensitivity: 0.8,
        animationPause: false,
        chatEnabled: true
      }
    },
    backgroundPath: null
  }
];

async function seedProduction() {
  try {
    console.log('🌱 Starting production database seeding...');
    
    // Clear existing scenarios
    await prisma.scenario.deleteMany({});
    console.log('🗑️  Cleared existing scenarios');
    
    // Create new scenarios
    for (const scenario of scenarios) {
      const created = await prisma.scenario.upsert({
        where: {
          sceneId_subsceneId: {
            sceneId: scenario.sceneId,
            subsceneId: scenario.subsceneId
          }
        },
        update: scenario,
        create: scenario
      });
      console.log(`✅ Created/Updated scenario ${scenario.sceneId}.${scenario.subsceneId}: ${scenario.title}`);
    }
    
    console.log('🎉 Production database seeding completed successfully!');
    
    // Verify the data
    const count = await prisma.scenario.count();
    console.log(`📊 Total scenarios in database: ${count}`);
    
    const allScenarios = await prisma.scenario.findMany({
      orderBy: [
        { sceneId: 'asc' },
        { subsceneId: 'asc' }
      ]
    });
    
    console.log('\n📋 Current scenarios:');
    allScenarios.forEach(s => {
      console.log(`  ${s.sceneId}.${s.subsceneId}: ${s.title} (${s.animationConfig.type})`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedProduction()
  .then(() => {
    console.log('🚀 Seeding script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding script failed:', error);
    process.exit(1);
  });
