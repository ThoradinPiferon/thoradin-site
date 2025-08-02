import express from 'express';
import { prisma } from '../config/database.js';

const router = express.Router();

// GET /api/admin/db-health - Database health check endpoint
router.get('/db-health', async (req, res) => {
  try {
    console.log('🔍 Admin: Running database health check...');
    
    const healthCheck = {
      status: 'checking',
      timestamp: new Date().toISOString(),
      checks: {},
      errors: []
    };

    // Check 1: scene_subscenes table
    try {
      const scenes = await prisma.sceneSubscene.findMany({ take: 1 });
      healthCheck.checks.sceneSubsceneTable = {
        status: 'ok',
        message: 'scene_subscenes table exists and accessible',
        count: scenes.length
      };
    } catch (error) {
      healthCheck.checks.sceneSubsceneTable = {
        status: 'error',
        message: 'scene_subscenes table missing or inaccessible',
        error: error.message
      };
      healthCheck.errors.push('scene_subscenes table issue');
    }

    // Check 2: GridSession table with userId constraint
    try {
      const testSession = await prisma.gridSession.create({
        data: {
          id: `health_check_${Date.now()}`,
          sessionName: 'Health Check Session',
          isActive: true
          // Note: userId is intentionally NOT provided
        }
      });
      
      healthCheck.checks.gridSessionUserId = {
        status: 'ok',
        message: 'GridSession table exists and userId is optional',
        testSessionId: testSession.id
      };
      
      // Clean up test session
      await prisma.gridSession.delete({
        where: { id: testSession.id }
      });
    } catch (error) {
      healthCheck.checks.gridSessionUserId = {
        status: 'error',
        message: 'GridSession userId constraint violation',
        error: error.message
      };
      healthCheck.errors.push('GridSession userId constraint issue');
    }

    // Check 3: soulkey_logs table
    try {
      const logs = await prisma.soulKeyLog.findMany({ take: 1 });
      healthCheck.checks.soulKeyLogsTable = {
        status: 'ok',
        message: 'soulkey_logs table exists and accessible',
        count: logs.length
      };
    } catch (error) {
      healthCheck.checks.soulKeyLogsTable = {
        status: 'error',
        message: 'soulkey_logs table missing or inaccessible',
        error: error.message
      };
      healthCheck.errors.push('soulkey_logs table issue');
    }

    // Check 4: soulKeyLogs relation
    try {
      const sessionWithLogs = await prisma.gridSession.findFirst({
        include: { soulKeyLogs: true }
      });
      healthCheck.checks.soulKeyLogsRelation = {
        status: 'ok',
        message: 'soulKeyLogs relation works correctly',
        hasRelation: !!sessionWithLogs
      };
    } catch (error) {
      healthCheck.checks.soulKeyLogsRelation = {
        status: 'error',
        message: 'soulKeyLogs relation broken',
        error: error.message
      };
      healthCheck.errors.push('soulKeyLogs relation issue');
    }

    // Determine overall status
    if (healthCheck.errors.length === 0) {
      healthCheck.status = 'ok';
      healthCheck.message = 'All database checks passed';
    } else {
      healthCheck.status = 'error';
      healthCheck.message = `${healthCheck.errors.length} database issues found`;
    }

    console.log(`🔍 Admin: Database health check completed - Status: ${healthCheck.status}`);
    
    res.json(healthCheck);

  } catch (error) {
    console.error('❌ Admin: Database health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 