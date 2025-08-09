#!/usr/bin/env node

/**
 * Test Database Connection Script
 * Shows the current state of the production database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 TESTING PRODUCTION DATABASE CONNECTION...');
  
  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test if Scenario table exists
    console.log('2. Testing Scenario table...');
    try {
      const scenarios = await prisma.scenario.findMany({ take: 1 });
      console.log('✅ Scenario table exists and accessible');
      console.log(`📊 Found ${scenarios.length} scenarios`);
    } catch (error) {
      console.error('❌ Scenario table error:', error.message);
      console.log('💡 The Scenario table does not exist. Running database fix...');
      
      // Try to run the database fix
      const { execSync } = await import('child_process');
      try {
        execSync('npm run fix:db', { stdio: 'inherit' });
        console.log('✅ Database fix completed');
      } catch (fixError) {
        console.error('❌ Database fix failed:', fixError.message);
      }
    }
    
    // Test if Session table exists
    console.log('3. Testing Session table...');
    try {
      const sessions = await prisma.session.findMany({ take: 1 });
      console.log('✅ Session table exists and accessible');
      console.log(`📊 Found ${sessions.length} sessions`);
    } catch (error) {
      console.error('❌ Session table error:', error.message);
    }
    
    // Test if Interaction table exists
    console.log('4. Testing Interaction table...');
    try {
      const interactions = await prisma.interaction.findMany({ take: 1 });
      console.log('✅ Interaction table exists and accessible');
      console.log(`📊 Found ${interactions.length} interactions`);
    } catch (error) {
      console.error('❌ Interaction table error:', error.message);
    }
    
    console.log('🎉 DATABASE CONNECTION TEST COMPLETED!');
    
  } catch (error) {
    console.error('❌ DATABASE CONNECTION FAILED:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection(); 