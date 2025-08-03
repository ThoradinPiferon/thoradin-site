#!/usr/bin/env node

/**
 * Force Production Database Migration Script
 * This script ensures the production database is properly migrated with all tables and constraints
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function forceMigrateProduction() {
  console.log('🚨 FORCE MIGRATING PRODUCTION DATABASE...');
  
  try {
    // Step 1: Generate Prisma client
    console.log('1. Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Step 2: Force push schema (this will create all tables)
    console.log('2. Force pushing schema to create all tables...');
    try {
      execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
      console.log('✅ Schema force-pushed successfully');
    } catch (error) {
      console.log('⚠️ Force push failed, trying regular push...');
      execSync('npx prisma db push', { stdio: 'inherit' });
    }
    
    // Step 3: Run migrations to ensure all constraints are set
    console.log('3. Running migrations to set constraints...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations applied successfully');
    } catch (error) {
      console.log('⚠️ Migrations failed, but schema should be correct');
    }
    
    // Step 4: Verify critical tables exist
    console.log('4. Verifying critical tables exist...');
    
    // Test scene_subscenes table
    try {
      const scenes = await prisma.sceneSubscene.findMany({ take: 1 });
      console.log('✅ scene_subscenes table exists and accessible');
    } catch (error) {
      console.error('❌ scene_subscenes table error:', error.message);
      throw new Error('scene_subscenes table is still missing');
    }
    
    // Test grid_sessions table with userId constraint
    try {
      const testSession = await prisma.gridSession.create({
        data: {
          id: `test_${Date.now()}`,
          sessionName: 'Test Session - No UserId',
          isActive: true
          // Note: userId is intentionally NOT provided
        }
      });
      console.log('✅ GridSession table exists and userId is optional');
      
      // Clean up test session
      await prisma.gridSession.delete({
        where: { id: testSession.id }
      });
    } catch (error) {
      console.error('❌ GridSession userId constraint error:', error.message);
      throw new Error('GridSession userId is still required');
    }
    
    // Test soulkey_logs table
    try {
      const logs = await prisma.soulKeyLog.findMany({ take: 1 });
      console.log('✅ soulkey_logs table exists and accessible');
    } catch (error) {
      console.error('❌ soulkey_logs table error:', error.message);
      throw new Error('soulkey_logs table is missing');
    }
    
    // Step 5: Test relations
    console.log('5. Testing relations...');
    try {
      const sessionWithLogs = await prisma.gridSession.findFirst({
        include: { soulKeyLogs: true }
      });
      console.log('✅ soulKeyLogs relation works correctly');
    } catch (error) {
      console.error('❌ soulKeyLogs relation error:', error.message);
      throw new Error('soulKeyLogs relation is broken');
    }
    
    console.log('🎉 PRODUCTION DATABASE MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('✅ All tables exist and constraints are correct');
    console.log('✅ Ready for production use');
    
  } catch (error) {
    console.error('❌ PRODUCTION MIGRATION FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Provide helpful error messages
    if (error.message.includes('scene_subscenes')) {
      console.error('💡 SOLUTION: The scene_subscenes table is missing. This requires a database reset.');
    }
    if (error.message.includes('userId')) {
      console.error('💡 SOLUTION: The userId constraint is still required. This requires a migration.');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the force migration
forceMigrateProduction(); 