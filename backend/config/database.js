import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Add connection retry logic
const connectWithRetry = async (maxRetries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Database connection attempt ${attempt}/${maxRetries}...`);
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      return true;
    } catch (error) {
      console.error(`❌ Database connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('❌ All database connection attempts failed');
        throw error;
      }
      
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
};

// Initialize connection on startup
if (process.env.NODE_ENV === 'production') {
  connectWithRetry().catch(error => {
    console.error('Failed to connect to database on startup:', error);
    // Don't exit process, let it continue and retry on first request
  });
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma, connectWithRetry }; 