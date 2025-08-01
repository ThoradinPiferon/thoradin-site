const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const exampleScenes = [
  {
    gridId: 'G1.1',
    title: 'The Desert Gateway',
    description: 'A vast expanse of golden sand stretches before you. The wind carries whispers of ancient wisdom, and the horizon seems to hold secrets of civilizations long past. This is where your journey begins.',
    animationUrl: null
  },
  {
    gridId: 'G2.3',
    title: 'The Spice Vault',
    description: 'Deep within the digital dunes, a chamber glows with the essence of knowledge. Here, the spice of information flows freely, connecting minds across the vast expanse of consciousness.',
    animationUrl: null
  },
  {
    gridId: 'G5.5',
    title: 'The Oracle\'s Chamber',
    description: 'In the heart of the grid, an ancient consciousness awakens. This sacred space holds the answers to questions you haven\'t yet asked, and wisdom that transcends the boundaries of time.',
    animationUrl: null
  },
  {
    gridId: 'G8.2',
    title: 'The Memory Archive',
    description: 'Floating fragments of forgotten dreams and lost knowledge drift through this ethereal space. Each piece holds a story, a lesson, a moment of human experience preserved in digital amber.',
    animationUrl: null
  },
  {
    gridId: 'G11.7',
    title: 'The Vault Entrance',
    description: 'A portal to deeper understanding stands before you. This is the gateway to Thoradin\'s wisdom, where questions become journeys and answers become new beginnings.',
    animationUrl: null
  }
];

async function seedScenes() {
  try {
    console.log('🌱 Seeding scenes...');

    for (const scene of exampleScenes) {
      // Check if scene already exists
      const existingScene = await prisma.scene.findUnique({
        where: { gridId: scene.gridId }
      });

      if (existingScene) {
        console.log(`⚠️  Scene ${scene.gridId} already exists, skipping...`);
        continue;
      }

      // Create new scene
      const newScene = await prisma.scene.create({
        data: scene
      });

      console.log(`✅ Created scene: ${newScene.gridId} - "${newScene.title}"`);
    }

    console.log('🎉 Scene seeding completed!');
    
    // Display all scenes
    const allScenes = await prisma.scene.findMany({
      where: { isActive: true },
      orderBy: { gridId: 'asc' }
    });

    console.log('\n📋 All active scenes:');
    allScenes.forEach(scene => {
      console.log(`  ${scene.gridId}: ${scene.title}`);
    });

  } catch (error) {
    console.error('❌ Error seeding scenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedScenes(); 