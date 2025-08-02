import { prisma } from '../config/database.js';

class ConfigService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get configuration by key with caching
  async getConfig(key, useCache = true) {
    if (useCache && this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
      this.cache.delete(key);
    }

    try {
      const config = await prisma.configuration.findFirst({
        where: {
          key,
          isActive: true
        },
        orderBy: {
          version: 'desc'
        }
      });

      if (!config) {
        return null;
      }

      const value = this.parseConfigValue(config.value, config.type);
      
      if (useCache) {
        this.cache.set(key, {
          value,
          timestamp: Date.now()
        });
      }

      return value;
    } catch (error) {
      console.error(`Error getting config for key ${key}:`, error);
      return null;
    }
  }

  // Get multiple configurations by category
  async getConfigsByCategory(category) {
    try {
      const configs = await prisma.configuration.findMany({
        where: {
          category,
          isActive: true
        },
        orderBy: {
          key: 'asc'
        }
      });

      const result = {};
      for (const config of configs) {
        result[config.key] = this.parseConfigValue(config.value, config.type);
      }

      return result;
    } catch (error) {
      console.error(`Error getting configs for category ${category}:`, error);
      return {};
    }
  }

  // Get all content by type
  async getContentByType(type) {
    try {
      const contents = await prisma.content.findMany({
        where: {
          type,
          isActive: true
        },
        orderBy: {
          key: 'asc'
        }
      });

      const result = {};
      for (const content of contents) {
        result[content.key] = content.content;
      }

      return result;
    } catch (error) {
      console.error(`Error getting content for type ${type}:`, error);
      return {};
    }
  }

  // Get theme configuration
  async getTheme(themeName = 'default') {
    try {
      const theme = await prisma.theme.findFirst({
        where: {
          OR: [
            { name: themeName },
            { isDefault: true }
          ],
          isActive: true
        }
      });

      return theme ? theme.config : null;
    } catch (error) {
      console.error(`Error getting theme ${themeName}:`, error);
      return null;
    }
  }

  // Set configuration
  async setConfig(key, value, type = 'STRING', category = 'general', userId = null) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      const config = await prisma.configuration.upsert({
        where: { key },
        update: {
          value: stringValue,
          type,
          category,
          version: {
            increment: 1
          },
          updatedAt: new Date()
        },
        create: {
          key,
          value: stringValue,
          type,
          category,
          createdBy: userId
        }
      });

      // Clear cache for this key
      this.cache.delete(key);

      return config;
    } catch (error) {
      console.error(`Error setting config for key ${key}:`, error);
      throw error;
    }
  }

  // Set content
  async setContent(key, content, type, language = 'en', isProtected = false, userId = null) {
    try {
      const contentRecord = await prisma.content.upsert({
        where: { key },
        update: {
          content,
          type,
          language,
          isProtected,
          version: {
            increment: 1
          },
          updatedAt: new Date()
        },
        create: {
          key,
          content,
          type,
          language,
          isProtected,
          createdBy: userId
        }
      });

      return contentRecord;
    } catch (error) {
      console.error(`Error setting content for key ${key}:`, error);
      throw error;
    }
  }

  // Initialize default configurations
  async initializeDefaults() {
    const defaults = [
      // Animation configurations
      { key: 'animation.phrase', value: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS", type: 'STRING', category: 'animation' },
      { key: 'animation.duration', value: '8000', type: 'NUMBER', category: 'animation' },
      { key: 'animation.speed', value: '0.05', type: 'NUMBER', category: 'animation' },
      
      // UI configurations
      { key: 'ui.cursor', value: 'crosshair', type: 'STRING', category: 'ui' },
      { key: 'ui.tooltip', value: 'Click anywhere on the grid', type: 'STRING', category: 'ui' },
      { key: 'ui.gridCols', value: '11', type: 'NUMBER', category: 'ui' },
      { key: 'ui.gridRows', value: '7', type: 'NUMBER', category: 'ui' },
      
      // AI configurations
      { key: 'ai.systemPrompt', value: 'You are GridGuide, a mystical AI guide...', type: 'STRING', category: 'ai' },
      { key: 'ai.maxTokens', value: '150', type: 'NUMBER', category: 'ai' },
      { key: 'ai.temperature', value: '0.8', type: 'NUMBER', category: 'ai' },
      
      // Content configurations
      { key: 'content.projectName', value: 'Thoradin Vault', type: 'STRING', category: 'content' },
      { key: 'content.description', value: 'An interactive storytelling grid exploring consciousness...', type: 'STRING', category: 'content' }
    ];

    for (const config of defaults) {
      await this.setConfig(config.key, config.value, config.type, config.category);
    }

    // Initialize default content
    const defaultContent = [
      { key: 'animation_phrase', content: "ENTER THE VAULT: WELCOME TO THORADIN'S WEB OF CONSCIOUSNESS", type: 'ANIMATION_TEXT' },
      { key: 'ui_tooltip', content: 'Click anywhere on the grid', type: 'UI_TEXT' },
      { key: 'ai_system_prompt', content: 'You are GridGuide, a mystical AI guide that responds to user interactions with a symbolic grid...', type: 'AI_PROMPT' },
      { key: 'mock_response_1', content: 'In the depths of the digital realm, your touch reveals patterns that echo through the chambers of consciousness.', type: 'MOCK_RESPONSE' },
      { key: 'mock_response_2', content: 'The grid responds to your intention, each click a ripple in the matrix of possibilities.', type: 'MOCK_RESPONSE' }
    ];

    for (const content of defaultContent) {
      await this.setContent(content.key, content.content, content.type);
    }

    console.log('✅ Default configurations initialized');
  }

  // Parse configuration value based on type
  parseConfigValue(value, type) {
    switch (type) {
      case 'JSON':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      case 'NUMBER':
        return parseFloat(value) || 0;
      case 'BOOLEAN':
        return value === 'true' || value === '1';
      case 'ARRAY':
        try {
          return JSON.parse(value);
        } catch {
          return value.split(',').map(item => item.trim());
        }
      default:
        return value;
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default new ConfigService(); 