const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const customization = require('../config/customization');

const prisma = new PrismaClient();

async function initializeAdminUser() {
  try {
    console.log('👑 Initializing admin user...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { username: customization.admin.username },
          { email: customization.admin.email }
        ]
      }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(customization.admin.password, 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: customization.admin.email,
        username: customization.admin.username,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   ID: ${adminUser.id}`);

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  initializeAdminUser();
}

module.exports = { initializeAdminUser }; 