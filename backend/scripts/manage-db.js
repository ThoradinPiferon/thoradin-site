import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function viewScenarios() {
  console.log('\n📋 Current Scenarios:');
  console.log('====================');
  
  const scenarios = await prisma.scenario.findMany({
    orderBy: [
      { sceneId: 'asc' },
      { subsceneId: 'asc' }
    ]
  });
  
  if (scenarios.length === 0) {
    console.log('No scenarios found in database.');
    return;
  }
  
  scenarios.forEach(s => {
    console.log(`${s.sceneId}.${s.subsceneId}: ${s.title}`);
    console.log(`  Type: ${s.animationConfig.type}`);
    console.log(`  Grid: ${s.gridConfig.rows}x${s.gridConfig.cols} (${s.gridConfig.excelRange})`);
    console.log(`  Description: ${s.description}`);
    console.log('');
  });
}

async function addScenario() {
  console.log('\n➕ Adding New Scenario');
  console.log('====================');
  
  const sceneId = parseInt(await question('Scene ID: '));
  const subsceneId = parseInt(await question('Subscene ID: '));
  const title = await question('Title: ');
  const description = await question('Description: ');
  const animationType = await question('Animation Type (matrix_spiral/matrix_static/dungeon_vault): ');
  
  const gridRows = parseInt(await question('Grid Rows: '));
  const gridCols = parseInt(await question('Grid Columns: '));
  
  const scenario = {
    sceneId,
    subsceneId,
    title,
    description,
    gridConfig: {
      rows: gridRows,
      cols: gridCols,
      gap: "2px",
      padding: "20px",
      debug: false,
      invisibleMode: false,
      matrixAnimationMode: animationType.includes('matrix'),
      triggerTile: "A1",
      excelRange: `A1:${String.fromCharCode(65 + gridCols - 1)}${gridRows}`
    },
    animationConfig: {
      type: animationType,
      speed: "normal",
      colors: {
        primary: "#00ff00",
        secondary: "#00ffcc",
        background: "#000000"
      },
      text: "Default text...",
      duration: 8000,
      effects: {
        glow: true,
        fade: true,
        spiral: animationType === 'matrix_spiral'
      },
      interactiveParams: {
        zoomSpeed: 1.2,
        cursorSensitivity: 0.8,
        animationPause: false
      }
    },
    backgroundPath: null
  };
  
  try {
    const created = await prisma.scenario.upsert({
      where: {
        sceneId_subsceneId: {
          sceneId,
          subsceneId
        }
      },
      update: scenario,
      create: scenario
    });
    console.log(`✅ Scenario ${sceneId}.${subsceneId} created/updated successfully!`);
  } catch (error) {
    console.error('❌ Failed to create scenario:', error.message);
  }
}

async function deleteScenario() {
  console.log('\n🗑️  Delete Scenario');
  console.log('==================');
  
  const sceneId = parseInt(await question('Scene ID: '));
  const subsceneId = parseInt(await question('Subscene ID: '));
  
  try {
    await prisma.scenario.delete({
      where: {
        sceneId_subsceneId: {
          sceneId,
          subsceneId
        }
      }
    });
    console.log(`✅ Scenario ${sceneId}.${subsceneId} deleted successfully!`);
  } catch (error) {
    console.error('❌ Failed to delete scenario:', error.message);
  }
}

async function showMenu() {
  console.log('\n🗄️  Database Management Tool');
  console.log('============================');
  console.log('1. View all scenarios');
  console.log('2. Add/Update scenario');
  console.log('3. Delete scenario');
  console.log('4. Seed production database');
  console.log('5. Exit');
  
  const choice = await question('\nSelect an option (1-5): ');
  
  switch (choice) {
    case '1':
      await viewScenarios();
      break;
    case '2':
      await addScenario();
      break;
    case '3':
      await deleteScenario();
      break;
    case '4':
      console.log('\n🌱 Running production seeding...');
      const { execSync } = await import('child_process');
      try {
        execSync('npm run seed:prod', { stdio: 'inherit' });
        console.log('✅ Production seeding completed!');
      } catch (error) {
        console.error('❌ Seeding failed:', error.message);
      }
      break;
    case '5':
      console.log('👋 Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('❌ Invalid option. Please try again.');
  }
  
  // Show menu again
  await showMenu();
}

async function main() {
  try {
    console.log('🔗 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');
    
    await showMenu();
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main();
