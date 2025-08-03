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
          triggerTile: 'A1'
        },
        metadata: {
          backgroundType: 'matrix_static',
          backgroundImage: null,
          effects: {
            autoAdvanceAfter: null,
            nextScene: null
          }
        },
        tiles: [
          {
            id: 'A1',
            handler: 'frontend',
            actions: {
              frontend: ['cursor_zoom'],
              backend: null
            },
            effects: {
              animationSpeed: 'normal'
            }
          }
        ],
        nextScenes: []
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