import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateScenario21WithBackground() {
  try {
    console.log('🔗 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');

    console.log('🖼️ Updating scenario 2.1 with background image...');

    const updatedScenario = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId: 2,
          subsceneId: 1
        }
      },
      update: {
        backgroundPath: '/assets/thoradin-vault-bg.png?v=' + Date.now(),
        gridConfig: {
          columns: 11,
          rows: 7,
          tiles: []
        },
        animationConfig: {
          type: 'static_background', // Changed from 'dungeon_vault' to 'static_background'
          speed: 'normal',
          colors: { primary: '#ffd700', secondary: '#8b4513', background: '#1a1a2e' },
          text: "Welcome to Thoradin's Vault",
          duration: 5000,
          effects: { glow: true, mist: true, roots: true },
          interactiveParams: { chatEnabled: true, zoomSpeed: 1.5, cursorSensitivity: 0.9 }
        }
      },
      create: {
        sceneId: 2,
        subsceneId: 1,
        title: "Thoradin's Vault",
        description: "Ancient mystical chamber with glowing symbols and stone pedestals",
        backgroundPath: '/assets/thoradin-vault-bg.png?v=' + Date.now(),
        gridConfig: {
          columns: 11,
          rows: 7,
          tiles: []
        },
        animationConfig: {
          type: 'dungeon_vault',
          speed: 'normal',
          colors: { primary: '#ffd700', secondary: '#8b4513', background: '#1a1a2e' },
          text: "Welcome to Thoradin's Vault",
          duration: 5000,
          effects: { glow: true, mist: true, roots: true },
          interactiveParams: { chatEnabled: true, zoomSpeed: 1.5, cursorSensitivity: 0.9 }
        }
      }
    });

    console.log('✅ Scenario 2.1 updated successfully!');
    console.log('📋 Updated scenario details:');
    console.log(`   - Scene ID: ${updatedScenario.sceneId}`);
    console.log(`   - Subscene ID: ${updatedScenario.subsceneId}`);
    console.log(`   - Title: ${updatedScenario.title}`);
    console.log(`   - Background: ${updatedScenario.backgroundPath}`);
    console.log(`   - Animation Type: ${updatedScenario.animationConfig.type}`);

  } catch (error) {
    console.error('❌ Error updating scenario 2.1:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

updateScenario21WithBackground();
