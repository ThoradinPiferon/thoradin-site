class ConfigService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
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
      const response = await fetch(`${this.baseURL}/config/${key}`);
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      const value = data.data?.value;
      
      if (useCache && value !== null) {
        this.cache.set(key, {
          value,
          timestamp: Date.now()
        });
      }
      
      return value;
    } catch (error) {
      console.error(`Error fetching config for key ${key}:`, error);
      return null;
    }
  }

  // Get multiple configurations by category
  async getConfigsByCategory(category) {
    try {
      const response = await fetch(`${this.baseURL}/config?category=${category}`);
      if (!response.ok) {
        return {};
      }
      
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error(`Error fetching configs for category ${category}:`, error);
      return {};
    }
  }

  // Get content by type
  async getContentByType(type) {
    try {
      const response = await fetch(`${this.baseURL}/config/content/${type}`);
      if (!response.ok) {
        return {};
      }
      
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error(`Error fetching content for type ${type}:`, error);
      return {};
    }
  }

  // Get animation configuration
  async getAnimationConfig() {
    return await this.getConfigsByCategory('animation');
  }

  // Get UI configuration
  async getUIConfig() {
    return await this.getConfigsByCategory('ui');
  }

  // Get AI configuration
  async getAIConfig() {
    return await this.getConfigsByCategory('ai');
  }

  // Get theme configuration
  async getTheme(themeName = 'default') {
    try {
      const response = await fetch(`${this.baseURL}/config/theme/${themeName}`);
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching theme ${themeName}:`, error);
      return null;
    }
  }

  // Set configuration (requires authentication)
  async setConfig(key, value, type = 'STRING', category = 'general') {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseURL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key,
          value,
          type,
          category
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set configuration');
      }

      // Clear cache for this key
      this.cache.delete(key);

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error setting config for key ${key}:`, error);
      throw error;
    }
  }

  // Set content (requires authentication)
  async setContent(key, content, type, language = 'en', isProtected = false) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseURL}/config/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key,
          content,
          type,
          language,
          isProtected
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set content');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error setting content for key ${key}:`, error);
      throw error;
    }
  }

  // Initialize defaults (admin only)
  async initializeDefaults() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseURL}/config/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to initialize defaults');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initializing defaults:', error);
      throw error;
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

  // Load all configurations for the app
  async loadAppConfig() {
    try {
      const [animationConfig, uiConfig, aiConfig, theme] = await Promise.all([
        this.getAnimationConfig(),
        this.getUIConfig(),
        this.getAIConfig(),
        this.getTheme()
      ]);

      return {
        animation: animationConfig,
        ui: uiConfig,
        ai: aiConfig,
        theme
      };
    } catch (error) {
      console.error('Error loading app config:', error);
      return {
        animation: {},
        ui: {},
        ai: {},
        theme: null
      };
    }
  }
}

export default new ConfigService(); 