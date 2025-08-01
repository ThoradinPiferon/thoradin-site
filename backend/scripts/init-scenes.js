const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Scene/Subscene data for the homepage experience
const sceneData = [
  // Scene 1: Homepage Matrix Experience
  {
    sceneId: 1,
    subsceneId: 1,
    title: "Matrix Spiral Running",
    description: "The Matrix spiral animation is actively running, creating the initial immersive experience. Any grid click will fast-forward to the end.",
    backgroundType: "matrix_spiral",
    animationUrl: null // Uses MatrixSpiralCanvas component
  },
  {
    sceneId: 1,
    subsceneId: 2,
    title: "Matrix Spiral Static",
    description: "The Matrix spiral has completed its animation and is now in a static state. Grid buttons are visible and G11.7 leads to Vault.",
    backgroundType: "static_spiral",
    animationUrl: null // Uses static Matrix background
  },
  
  // Scene 2: Vault Experience
  {
    sceneId: 2,
    subsceneId: 1,
    title: "Vault Interface",
    description: "The mystical Vault interface with AI chat capabilities and Dune aesthetic.",
    backgroundType: "vault",
    animationUrl: null // Uses Vault background
  }
];

async function seedSceneSubscenes() {
  console.log('🌱 Seeding scene/subscene system...');
  
  for (const scene of sceneData) {
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
          animationUrl: scene.animationUrl,
          isActive: true
        },
        create: {
          sceneId: scene.sceneId,
          subsceneId: scene.subsceneId,
          title: scene.title,
          description: scene.description,
          backgroundType: scene.backgroundType,
          animationUrl: scene.animationUrl,
          isActive: true
        }
      });
      console.log(`✅ Scene ${scene.sceneId}.${scene.subsceneId}: ${scene.title}`);
    } catch (error) {
      console.log(`⚠️  Scene ${scene.sceneId}.${scene.subsceneId} already exists, skipping...`);
    }
  }
  
  console.log('🎉 Scene/Subscene seeding completed!');
}

async function main() {
  try {
    await seedSceneSubscenes();
    console.log('✅ Scene initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding scenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 