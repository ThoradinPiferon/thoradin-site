const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);
    
    // Test content table
    const contentCount = await prisma.content.count();
    console.log('✅ Content table accessible, count:', contentCount);
    
    // Test AI prompt retrieval
    const aiPrompt = await prisma.content.findFirst({
      where: {
        key: 'ai_system_prompt',
        language: 'en'
      }
    });
    
    if (aiPrompt) {
      console.log('✅ AI system prompt found:', aiPrompt.content.substring(0, 50) + '...');
    } else {
      console.log('⚠️  AI system prompt not found - this will cause OpenAI API issues');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection(); 