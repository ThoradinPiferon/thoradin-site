import { prisma } from '../config/database.js';

class LanguageService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    this.supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
    this.defaultLanguage = 'en';
  }

  // Detect language from request headers
  detectLanguage(req) {
    try {
      // Check for explicit language header
      const explicitLang = req.headers['x-language'] || req.headers['accept-language'];
      if (explicitLang) {
        const lang = this.parseLanguageHeader(explicitLang);
        if (this.isSupported(lang)) {
          return lang;
        }
      }

      // Check for Accept-Language header
      const acceptLanguage = req.headers['accept-language'];
      if (acceptLanguage) {
        const lang = this.parseLanguageHeader(acceptLanguage);
        if (this.isSupported(lang)) {
          return lang;
        }
      }

      // Check query parameter
      const queryLang = req.query.lang || req.query.language;
      if (queryLang && this.isSupported(queryLang)) {
        return queryLang;
      }

      // Check body parameter
      const bodyLang = req.body?.language;
      if (bodyLang && this.isSupported(bodyLang)) {
        return bodyLang;
      }

      return this.defaultLanguage;
    } catch (error) {
      console.error('Error detecting language:', error);
      return this.defaultLanguage;
    }
  }

  // Parse Accept-Language header
  parseLanguageHeader(header) {
    if (!header) return this.defaultLanguage;

    // Parse "en-US,en;q=0.9,es;q=0.8" format
    const languages = header.split(',')
      .map(lang => {
        const [code, quality = '1'] = lang.trim().split(';q=');
        return {
          code: code.split('-')[0].toLowerCase(), // Get primary language code
          quality: parseFloat(quality)
        };
      })
      .sort((a, b) => b.quality - a.quality);

    // Find first supported language
    for (const lang of languages) {
      if (this.isSupported(lang.code)) {
        return lang.code;
      }
    }

    return this.defaultLanguage;
  }

  // Check if language is supported
  isSupported(language) {
    if (!language) return false;
    const normalizedLang = language.toLowerCase().trim();
    return this.supportedLanguages.includes(normalizedLang);
  }

  // Validate language code format
  validateLanguageCode(language) {
    if (!language) return false;
    const langRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
    return langRegex.test(language);
  }

  // Get content in specific language with fallback
  async getContent(key, language = 'en', type = null) {
    const cacheKey = `${key}_${language}_${type}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
      this.cache.delete(cacheKey);
    }

    try {
      // Try to get content in requested language
      let content = await prisma.content.findFirst({
        where: {
          key,
          language,
          isActive: true,
          ...(type && { type })
        }
      });

      // If not found, try default language
      if (!content && language !== this.defaultLanguage) {
        content = await prisma.content.findFirst({
          where: {
            key,
            language: this.defaultLanguage,
            isActive: true,
            ...(type && { type })
          }
        });
      }

      // If still not found, get any available version
      if (!content) {
        content = await prisma.content.findFirst({
          where: {
            key,
            isActive: true,
            ...(type && { type })
          }
        });
      }

      const result = content ? content.content : null;

      // Cache the result
      if (result) {
        this.cache.set(cacheKey, {
          value: result,
          timestamp: Date.now()
        });
      }

      return result;
    } catch (error) {
      console.error(`Error getting content for key ${key} in language ${language}:`, error);
      return null;
    }
  }

  // Get multiple content items in specific language
  async getContentByType(type, language = 'en') {
    try {
      // Get all content of this type in the requested language
      let contents = await prisma.content.findMany({
        where: {
          type,
          language,
          isActive: true
        },
        orderBy: { key: 'asc' }
      });

      // If not enough content in requested language, get from default language
      if (contents.length === 0 && language !== this.defaultLanguage) {
        contents = await prisma.content.findMany({
          where: {
            type,
            language: this.defaultLanguage,
            isActive: true
          },
          orderBy: { key: 'asc' }
        });
      }

      // If still not enough, get any available content
      if (contents.length === 0) {
        contents = await prisma.content.findMany({
          where: {
            type,
            isActive: true
          },
          orderBy: { key: 'asc' }
        });
      }

      const result = {};
      for (const content of contents) {
        result[content.key] = content.content;
      }

      return result;
    } catch (error) {
      console.error(`Error getting content for type ${type} in language ${language}:`, error);
      return {};
    }
  }

  // Get configuration in specific language
  async getConfig(key, language = 'en') {
    const cacheKey = `config_${key}_${language}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
      this.cache.delete(cacheKey);
    }

    try {
      // First try to get language-specific configuration
      let config = await prisma.configuration.findFirst({
        where: {
          key: `${key}_${language}`,
          isActive: true
        },
        orderBy: { version: 'desc' }
      });

      // If not found, try default language
      if (!config && language !== this.defaultLanguage) {
        config = await prisma.configuration.findFirst({
          where: {
            key: `${key}_${this.defaultLanguage}`,
            isActive: true
          },
          orderBy: { version: 'desc' }
        });
      }

      // If still not found, try base key
      if (!config) {
        config = await prisma.configuration.findFirst({
          where: {
            key,
            isActive: true
          },
          orderBy: { version: 'desc' }
        });
      }

      if (!config) {
        return null;
      }

      const value = this.parseConfigValue(config.value, config.type);
      
      // Cache the result
      this.cache.set(cacheKey, {
        value,
        timestamp: Date.now()
      });

      return value;
    } catch (error) {
      console.error(`Error getting config for key ${key} in language ${language}:`, error);
      return null;
    }
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

  // Get AI prompt in specific language
  async getAIPrompt(language = 'en') {
    const prompt = await this.getContent('ai_system_prompt', language, 'AI_PROMPT');
    return prompt || await this.getContent('ai_system_prompt', this.defaultLanguage, 'AI_PROMPT');
  }

  // Get mock responses in specific language
  async getMockResponses(language = 'en') {
    const responses = await this.getContentByType('MOCK_RESPONSE', language);
    if (Object.keys(responses).length === 0) {
      return await this.getContentByType('MOCK_RESPONSE', this.defaultLanguage);
    }
    return responses;
  }

  // Get animation text in specific language
  async getAnimationText(language = 'en') {
    const text = await this.getContent('animation_phrase', language, 'ANIMATION_TEXT');
    return text || await this.getContent('animation_phrase', this.defaultLanguage, 'ANIMATION_TEXT');
  }

  // Get UI text in specific language
  async getUIText(language = 'en') {
    const uiTexts = await this.getContentByType('UI_TEXT', language);
    if (Object.keys(uiTexts).length === 0) {
      return await this.getContentByType('UI_TEXT', this.defaultLanguage);
    }
    return uiTexts;
  }

  // Set content in specific language
  async setContent(key, content, type, language = 'en', isProtected = false, userId = null) {
    try {
      const contentRecord = await prisma.content.upsert({
        where: { 
          key_language: {
            key,
            language
          }
        },
        update: {
          content,
          type,
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

      // Clear cache for this key/language combination
      this.clearCacheForKey(key, language);

      return contentRecord;
    } catch (error) {
      console.error(`Error setting content for key ${key} in language ${language}:`, error);
      throw error;
    }
  }

  // Clear cache for specific key and language
  clearCacheForKey(key, language) {
    const patterns = [
      `${key}_${language}`,
      `config_${key}_${language}`
    ];
    
    for (const pattern of patterns) {
      for (const [cacheKey] of this.cache) {
        if (cacheKey.includes(pattern)) {
          this.cache.delete(cacheKey);
        }
      }
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear();
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Get language statistics
  async getLanguageStats() {
    try {
      const stats = await prisma.content.groupBy({
        by: ['language'],
        _count: {
          language: true
        },
        where: {
          isActive: true
        }
      });

      return stats.reduce((acc, stat) => {
        acc[stat.language] = stat._count.language;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error getting language stats:', error);
      return {};
    }
  }
}

export default new LanguageService(); 