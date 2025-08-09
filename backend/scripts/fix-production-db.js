#!/usr/bin/env node

/**
 * Fix Production Database Script
 * Creates missing tables for the current schema
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function fixProductionDatabase() {
  console.log('🔧 FIXING PRODUCTION DATABASE...');
  
  try {
    // Step 1: Generate Prisma client
    console.log('1. Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Step 2: Push the current schema to create missing tables
    console.log('2. Pushing current schema to create missing tables...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Schema pushed successfully');
    
    // Step 3: Verify Scenario table exists
    console.log('3. Verifying Scenario table exists...');
    try {
      const scenarios = await prisma.scenario.findMany({ take: 1 });
      console.log('✅ Scenario table exists and accessible');
    } catch (error) {
      console.error('❌ Scenario table error:', error.message);
      throw new Error('Scenario table is still missing');
    }
    
    // Step 4: Verify Session table exists
    console.log('4. Verifying Session table exists...');
    try {
      const sessions = await prisma.session.findMany({ take: 1 });
      console.log('✅ Session table exists and accessible');
    } catch (error) {
      console.error('❌ Session table error:', error.message);
      throw new Error('Session table is missing');
    }
    
    // Step 5: Verify Interaction table exists
    console.log('5. Verifying Interaction table exists...');
    try {
      const interactions = await prisma.interaction.findMany({ take: 1 });
      console.log('✅ Interaction table exists and accessible');
    } catch (error) {
      console.error('❌ Interaction table error:', error.message);
      throw new Error('Interaction table is missing');
    }
    
    console.log('🎉 PRODUCTION DATABASE FIXED SUCCESSFULLY!');
    console.log('✅ All required tables exist and are accessible');
    console.log('✅ Ready for production use');
    
  } catch (error) {
    console.error('❌ DATABASE FIX FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the database fix
fixProductionDatabase(); 