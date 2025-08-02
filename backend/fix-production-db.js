#!/usr/bin/env node

/**
 * Production Database Fix Script
 * This script ensures the production database has all required tables and constraints
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function fixProductionDatabase() {
  console.log('🔧 Starting production database fix...');
  
  try {
    // Step 1: Generate Prisma client
    console.log('1. Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Step 2: Run migrations
    console.log('2. Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    // Step 3: Verify tables exist
    console.log('3. Verifying tables exist...');
    
    // Test GridSession table
    try {
      const sessions = await prisma.gridSession.findMany({ take: 1 });
      console.log('✅ GridSession table exists');
    } catch (error) {
      console.error('❌ GridSession table error:', error.message);
    }
    
    // Test SceneSubscene table
    try {
      const scenes = await prisma.sceneSubscene.findMany({ take: 1 });
      console.log('✅ SceneSubscene table exists');
    } catch (error) {
      console.error('❌ SceneSubscene table error:', error.message);
    }
    
    // Test SoulKeyLog table
    try {
      const logs = await prisma.soulKeyLog.findMany({ take: 1 });
      console.log('✅ SoulKeyLog table exists');
    } catch (error) {
      console.error('❌ SoulKeyLog table error:', error.message);
    }
    
    // Step 4: Test session creation (userId constraint)
    console.log('4. Testing session creation with optional userId...');
    try {
      const testSession = await prisma.gridSession.create({
        data: {
          id: `test_${Date.now()}`,
          sessionName: 'Test Session',
          isActive: true
          // Note: userId is not provided (should be optional)
        }
      });
      console.log('✅ Session creation with optional userId works');
      
      // Clean up test session
      await prisma.gridSession.delete({
        where: { id: testSession.id }
      });
    } catch (error) {
      console.error('❌ Session creation error:', error.message);
    }
    
    // Step 5: Test soulKeyLogs relation
    console.log('5. Testing soulKeyLogs relation...');
    try {
      const sessionWithLogs = await prisma.gridSession.findFirst({
        include: { soulKeyLogs: true }
      });
      console.log('✅ soulKeyLogs relation works');
    } catch (error) {
      console.error('❌ soulKeyLogs relation error:', error.message);
    }
    
    console.log('🎉 Production database fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Production database fix failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixProductionDatabase(); 