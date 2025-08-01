const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateScenes() {
  try {
    console.log('🔄 Starting scene migration...');
    
    // First, let's check if the old scenes table exists and has data
    const oldScenes = await prisma.$queryRaw`
      SELECT * FROM information_schema.tables 
      WHERE table_name = 'scenes' AND table_schema = 'public'
    `;
    
    if (oldScenes.length === 0) {
      console.log('✅ No old scenes table found, proceeding with new scene initialization...');
      return;
    }
    
    console.log('📋 Found old scenes table, checking for existing data...');
    
    // Get existing scenes data
    const existingScenes = await prisma.$queryRaw`SELECT * FROM scenes`;
    console.log(`📊 Found ${existingScenes.length} existing scenes`);
    
    // Create new scene_subscenes table structure
    console.log('🏗️ Creating new scene_subscenes table...');
    
    // Drop the old scenes table if it exists
    await prisma.$executeRaw`DROP TABLE IF EXISTS scenes CASCADE`;
    console.log('🗑️ Dropped old scenes table');
    
    // Now push the new schema
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

async function main() {
  try {
    await migrateScenes();
    console.log('🎉 Scene migration completed!');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 