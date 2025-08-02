import { PrismaClient } from '@prisma/client';
import { sceneSeedData } from '../services/sceneSeed.js';

const prisma = new PrismaClient();

async function seedSceneSubscenes() {
  console.log('🌱 Seeding scene/subscene system...');
  
  for (const scene of sceneSeedData) {
    try {
      await prisma.sceneSubscene.upsert({
        where: {
          sceneId_subsceneId: {
            sceneId: scene.sceneId,
            subsceneId: scene.subsceneId
          }
        },
        update: {
          title: scene.title,
          description: scene.description,
          backgroundType: scene.backgroundType,
          gridConfig: JSON.stringify(scene.gridConfig || {}),
          effects: JSON.stringify(scene.effects || {}),
          choices: JSON.stringify(scene.choices || []),
          isActive: true
        },
        create: {
          sceneId: scene.sceneId,
          subsceneId: scene.subsceneId,
          title: scene.title,
          description: scene.description,
          backgroundType: scene.backgroundType,
          gridConfig: JSON.stringify(scene.gridConfig || {}),
          effects: JSON.stringify(scene.effects || {}),
          choices: JSON.stringify(scene.choices || []),
          isActive: true
        }
      });
      console.log(`✅ Scene ${scene.sceneId}.${scene.subsceneId}: ${scene.title}`);
    } catch (error) {
      console.log(`⚠️  Scene ${scene.sceneId}.${scene.subsceneId} already exists, skipping...`);
    }
  }
  
  console.log('🎉 Scene/Subscene seeding completed!');
  
  // Display all active scenes
  const activeScenes = await prisma.sceneSubscene.findMany({
    where: { isActive: true },
    orderBy: [
      { sceneId: 'asc' },
      { subsceneId: 'asc' }
    ]
  });
  
  console.log('\n📋 All active scenes:');
  activeScenes.forEach(scene => {
    console.log(`  Scene ${scene.sceneId}.${scene.subsceneId}: ${scene.title} (${scene.backgroundType})`);
  });
}

async function main() {
  try {
    await seedSceneSubscenes();
  } catch (error) {
    console.error('❌ Error seeding scenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 