import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🎭 SEED SCRIPT FOR CLEAN ARCHITECTURE
 * 
 * Populates the database with initial scenarios for testing
 */

const seedScenarios = async () => {
  console.log('🌱 Starting database seed...');
  
  try {
    // Scene 1.1 - Matrix Awakening
    const scenario1_1 = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 1
        }
      },
      update: {},
      create: {
        sceneId: 1,
        subsceneId: 1,
        title: 'Matrix Awakening',
        description: 'The spiral begins to spin...',
        gridConfig: {
          rows: 1,
          cols: 1,
          gap: '2px',
          padding: '20px',
          debug: false,
          invisibleMode: false,
          matrixAnimationMode: true,
          triggerTile: 'A1',
          excelRange: 'A1:A1'
        },
        animationConfig: {
          type: 'matrix_spiral',
          speed: 'normal',
          colors: {
            primary: '#00ff00',
            secondary: '#00ffcc',
            background: '#000000'
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
      }
    });
    
    console.log('✅ Scene 1.1 seeded:', scenario1_1.title);
    
    // Scene 1.2 - Matrix Complete
    const scenario1_2 = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 1,
          subsceneId: 2
        }
      },
      update: {},
      create: {
        sceneId: 1,
        subsceneId: 2,
        title: 'Matrix Complete',
        description: 'The spiral has finished its dance...',
        gridConfig: {
          rows: 7,
          cols: 11,
          gap: '2px',
          padding: '20px',
          debug: false,
          invisibleMode: false,
          matrixAnimationMode: false,
          triggerTile: 'F1',
          excelRange: 'A1:G7'
        },
        animationConfig: {
          type: 'matrix_static',
          speed: 'normal',
          colors: {
            primary: '#00ff00',
            secondary: '#00ffcc',
            background: '#000000'
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
      }
    });
    
    console.log('✅ Scene 1.2 seeded:', scenario1_2.title);
    
    console.log('🎭 Database seeding completed successfully!');
    console.log('📊 Scenarios created:');
    console.log('  - Scene 1.1: Matrix Awakening');
    console.log('  - Scene 1.2: Matrix Complete');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Run the seed function
seedScenarios()
  .then(() => {
    console.log('🌱 Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  }); 