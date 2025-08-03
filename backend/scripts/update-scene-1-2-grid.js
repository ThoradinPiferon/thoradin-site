import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateScenarios() {
  try {
    console.log('🔄 Updating scenarios...');

    // Update scene 1.2 with 11x7 grid
    const updatedScenario1_2 = await prisma.scenario.update({
      where: { sceneId_subsceneId: { sceneId: 1, subsceneId: 2 } },
      data: {
        title: "Fast-Forward Matrix Complete",
        description: "The matrix animation has been fast-forwarded to completion",
        gridConfig: {
          rows: 7,
          cols: 11,
          gap: '2px',
          padding: '20px',
          debug: false,
          excelRange: 'A1:K7',
          triggerTile: 'A2',
          invisibleMode: false,
          matrixAnimationMode: false
        },
        animationConfig: {
          type: 'static',
          speed: 'none',
          colors: { primary: '#00ff00', secondary: '#00ffcc', background: '#000000' },
          text: "FAST-FORWARD COMPLETE: WELCOME TO SCENARIO 1.2",
          duration: 0,
          effects: { glow: false, fade: false, spiral: false },
          interactiveParams: { zoomSpeed: 1, cursorSensitivity: 1, animationPause: true }
        },
        backgroundPath: null
      }
    });

    console.log('✅ Updated scene 1.2:', updatedScenario1_2);

    console.log('✅ Scene 1.2 updated successfully!');
    console.log('📝 Note: A2 click handler will be implemented in frontend');

    console.log('🎉 All scenarios updated successfully!');
  } catch (error) {
    console.error('❌ Error updating scenarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateScenarios(); 