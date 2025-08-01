import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In-memory session tracking for active sessions
const activeSessions = new Map();

/**
 * Create or retrieve a session for tracking SoulKey interactions
 */
export const getOrCreateSession = async (sessionId, userId = null) => {
  try {
    // Check if session exists in database
    let session = await prisma.gridSession.findUnique({
      where: { id: sessionId },
      include: { soulKeyLogs: true }
    });

    if (!session) {
      // Create new session
      session = await prisma.gridSession.create({
        data: {
          id: sessionId,
          userId: userId || 'anonymous',
          sessionName: `SoulKey Session ${new Date().toISOString().slice(0, 19)}`,
          isActive: true
        },
        include: { soulKeyLogs: true }
      });
    }

    // Store in memory for quick access
    activeSessions.set(sessionId, {
      id: session.id,
      userId: session.userId,
      logs: session.soulKeyLogs || [],
      lastActivity: new Date()
    });

    console.log(`🎭 SoulKey: Session ${sessionId} ready for tracking`);
    return session;
  } catch (error) {
    console.error('❌ SoulKey: Error creating/retrieving session:', error);
    throw error;
  }
};

/**
 * Log a tile interaction to the SoulKey system
 */
export const logTileInteraction = async (sessionId, {
  scene,
  subscene,
  gridTile,
  zoomTarget = null,
  nextScene = null
}) => {
  try {
    // Ensure session exists
    await getOrCreateSession(sessionId);

    // Create log entry
    const logEntry = await prisma.soulKeyLog.create({
      data: {
        sessionId,
        scene,
        subscene,
        gridTile,
        zoomTarget,
        nextScene: nextScene ? JSON.stringify(nextScene) : null
      }
    });

    // Update in-memory session
    const session = activeSessions.get(sessionId);
    if (session) {
      session.logs.push(logEntry);
      session.lastActivity = new Date();
    }

    console.log(`🎭 SoulKey: Logged interaction - Session: ${sessionId}, Tile: ${gridTile}, Scene: ${scene}.${subscene}`);
    
    return logEntry;
  } catch (error) {
    console.error('❌ SoulKey: Error logging tile interaction:', error);
    throw error;
  }
};

/**
 * Get session summary and SoulKey insights
 */
export const getSessionInsights = async (sessionId) => {
  try {
    const session = await prisma.gridSession.findUnique({
      where: { id: sessionId },
      include: {
        soulKeyLogs: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const logs = session.soulKeyLogs;
    
    // Calculate insights
    const insights = {
      sessionId,
      totalInteractions: logs.length,
      scenesVisited: [...new Set(logs.map(log => `${log.scene}.${log.subscene}`))],
      tilesClicked: logs.map(log => log.gridTile),
      zoomActions: logs.filter(log => log.zoomTarget).length,
      sceneTransitions: logs.filter(log => log.nextScene).length,
      journeyPattern: logs.map(log => ({
        tile: log.gridTile,
        scene: `${log.scene}.${log.subscene}`,
        timestamp: log.timestamp,
        zoomTarget: log.zoomTarget,
        nextScene: log.nextScene ? JSON.parse(log.nextScene) : null
      }))
    };

    console.log(`🎭 SoulKey: Session insights generated for ${sessionId}`);
    return insights;
  } catch (error) {
    console.error('❌ SoulKey: Error getting session insights:', error);
    throw error;
  }
};

/**
 * Get all active sessions
 */
export const getActiveSessions = () => {
  return Array.from(activeSessions.values());
};

/**
 * Clean up old sessions (optional maintenance)
 */
export const cleanupOldSessions = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const deletedSessions = await prisma.gridSession.deleteMany({
      where: {
        updatedAt: {
          lt: cutoffDate
        },
        isActive: false
      }
    });

    console.log(`🎭 SoulKey: Cleaned up ${deletedSessions.count} old sessions`);
    return deletedSessions.count;
  } catch (error) {
    console.error('❌ SoulKey: Error cleaning up old sessions:', error);
    throw error;
  }
};

export default {
  getOrCreateSession,
  logTileInteraction,
  getSessionInsights,
  getActiveSessions,
  cleanupOldSessions
}; 