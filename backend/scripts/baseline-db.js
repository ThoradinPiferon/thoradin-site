import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function baselineDatabase() {
  try {
    console.log('🔧 Checking database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('Scenario', 'User', 'GridSession', 'SoulKeyLog')
    `;
    
    console.log('📊 Existing tables:', tables);
    
    if (tables.length > 0) {
      console.log('🔄 Database has existing tables, baselining...');
      
      // Mark all migrations as applied without running them
      execSync('npx prisma migrate resolve --applied 20250801235304_add_soulkey_logging', { stdio: 'inherit' });
      execSync('npx prisma migrate resolve --applied 20250802052941_make_userid_optional_in_gridsession', { stdio: 'inherit' });
      execSync('npx prisma migrate resolve --applied 20250802112624_add_next_scenes_field', { stdio: 'inherit' });
      execSync('npx prisma migrate resolve --applied 20250803071141_add_background_path', { stdio: 'inherit' });
      execSync('npx prisma migrate resolve --applied 20250803104604_add_animation_type', { stdio: 'inherit' });
      execSync('npx prisma migrate resolve --applied 20250803110909_add_animation_config', { stdio: 'inherit' });
      
      console.log('✅ Database baselined successfully');
    } else {
      console.log('🆕 Database is empty, running migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    }
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

baselineDatabase(); 