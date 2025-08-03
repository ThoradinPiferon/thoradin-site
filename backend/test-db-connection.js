import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test query
    const sceneCount = await prisma.sceneSubscene.count();
    console.log(`📊 Found ${sceneCount} scenes in database`);
    
    // List all scenes
    const scenes = await prisma.sceneSubscene.findMany({
      orderBy: [
        { sceneId: 'asc' },
        { subsceneId: 'asc' }
      ]
    });
    
    console.log('\n📋 All scenes in database:');
    scenes.forEach(scene => {
      console.log(`  Scene ${scene.sceneId}.${scene.subsceneId}: ${scene.title}`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 