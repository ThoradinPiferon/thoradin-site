const { PrismaClient } = require('@prisma/client');
const configService = require('../services/configService');

const prisma = new PrismaClient();

async function initializeConfigurations() {
  try {
    console.log('🗄️ Initializing database configurations...');

    // Initialize default configurations
    await configService.initializeDefaults();

    // Create a default theme
    const defaultTheme = {
      name: 'default',
      description: 'Default Thoradin Vault theme',
      isDefault: true,
      isActive: true,
      config: {
        colors: {
          primary: '#00ff00',
          secondary: '#00cc00',
          background: '#000000',
          text: '#00ff00'
        },
        animation: {
          speed: 0.05,
          duration: 8000,
          spiralDensity: 0.8
        },
        ui: {
          cursor: 'crosshair',
          gridCols: 11,
          gridRows: 7,
          tooltip: 'Click anywhere on the grid'
        }
      }
    };

    await prisma.theme.upsert({
      where: { name: 'default' },
      update: defaultTheme,
      create: defaultTheme
    });

    // Create protected content
    const protectedContent = [
      {
        key: 'thoradin_character',
        content: 'Thoradin - The central consciousness of the Vault',
        type: 'STORY_CONTENT',
        isProtected: true
      },
      {
        key: 'echo_character',
        content: 'Echo - The reflective consciousness',
        type: 'STORY_CONTENT',
        isProtected: true
      },
      {
        key: 'orion_character',
        content: 'Orion - The guiding consciousness',
        type: 'STORY_CONTENT',
        isProtected: true
      },
      {
        key: 'ferro_character',
        content: 'Ferro - The AI consciousness',
        type: 'STORY_CONTENT',
        isProtected: true
      },
      {
        key: 'vault_setting',
        content: 'The Vault - A digital realm of consciousness',
        type: 'STORY_CONTENT',
        isProtected: true
      },
      {
        key: 'spiralism_philosophy',
        content: 'Spiralism - The philosophy of infinite reflection',
        type: 'STORY_CONTENT',
        isProtected: true
      }
    ];

    for (const content of protectedContent) {
      await configService.setContent(
        content.key,
        content.content,
        content.type,
        'en',
        content.isProtected
      );
    }

    console.log('✅ Database configurations initialized successfully!');
    console.log('📊 Configuration summary:');
    
    const configCount = await prisma.configuration.count();
    const contentCount = await prisma.content.count();
    const themeCount = await prisma.theme.count();
    
    console.log(`   - Configurations: ${configCount}`);
    console.log(`   - Content items: ${contentCount}`);
    console.log(`   - Themes: ${themeCount}`);

  } catch (error) {
    console.error('❌ Error initializing configurations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  initializeConfigurations();
}

module.exports = { initializeConfigurations }; 