class LanguageService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.currentLanguage = this.detectBrowserLanguage();
  }

  // Detect browser language
  detectBrowserLanguage() {
    try {
      // Check localStorage first
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage) {
        return savedLanguage;
      }

      // Get browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        const primaryLang = browserLang.split('-')[0].toLowerCase();
        const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
        
        if (supportedLanguages.includes(primaryLang)) {
          return primaryLang;
        }
      }

      return 'en'; // Default fallback
    } catch (error) {
      console.error('Error detecting browser language:', error);
      return 'en';
    }
  }

  // Set preferred language
  setLanguage(language) {
    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
    this.clearCache(); // Clear cache when language changes
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'es', name: 'Spanish', native: 'Español' },
      { code: 'fr', name: 'French', native: 'Français' },
      { code: 'de', name: 'German', native: 'Deutsch' },
      { code: 'it', name: 'Italian', native: 'Italiano' },
      { code: 'pt', name: 'Portuguese', native: 'Português' },
      { code: 'ru', name: 'Russian', native: 'Русский' },
      { code: 'ja', name: 'Japanese', native: '日本語' },
      { code: 'ko', name: 'Korean', native: '한국어' },
      { code: 'zh', name: 'Chinese', native: '中文' }
    ];
  }

  // Get content in current language
  async getContent(key, type = null) {
    const cacheKey = `${key}_${this.currentLanguage}_${type}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/config/content/${type || 'METADATA'}?language=${this.currentLanguage}`);
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      const content = data.data?.[key];
      
      if (content) {
        this.cache.set(cacheKey, {
          value: content,
          timestamp: Date.now()
        });
        return content;
      }

      // Fallback to English if not found in current language
      if (this.currentLanguage !== 'en') {
        const fallbackResponse = await fetch(`${this.baseURL}/config/content/${type || 'METADATA'}?language=en`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackContent = fallbackData.data?.[key];
          
          if (fallbackContent) {
            this.cache.set(cacheKey, {
              value: fallbackContent,
              timestamp: Date.now()
            });
            return fallbackContent;
          }
        }
      }

      return null;
    } catch (error) {
      console.error(`Error fetching content for key ${key}:`, error);
      return null;
    }
  }

  // Get animation text in current language
  async getAnimationText() {
    return await this.getContent('animation_phrase', 'ANIMATION_TEXT');
  }

  // Get UI text in current language
  async getUIText(key) {
    return await this.getContent(key, 'UI_TEXT');
  }

  // Get all UI texts in current language
  async getAllUITexts() {
    try {
      const response = await fetch(`${this.baseURL}/config/content/UI_TEXT?language=${this.currentLanguage}`);
      if (!response.ok) {
        return {};
      }
      
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Error fetching UI texts:', error);
      return {};
    }
  }

  // Get AI prompt in current language
  async getAIPrompt() {
    return await this.getContent('ai_system_prompt', 'AI_PROMPT');
  }

  // Get mock responses in current language
  async getMockResponses() {
    try {
      const response = await fetch(`${this.baseURL}/config/content/MOCK_RESPONSE?language=${this.currentLanguage}`);
      if (!response.ok) {
        return {};
      }
      
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Error fetching mock responses:', error);
      return {};
    }
  }

  // Get configuration in current language
  async getConfig(key) {
    const cacheKey = `config_${key}_${this.currentLanguage}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/config/${key}?language=${this.currentLanguage}`);
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      const value = data.data?.value;
      
      if (value !== null) {
        this.cache.set(cacheKey, {
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

  // Get all configurations by category in current language
  async getConfigsByCategory(category) {
    try {
      const response = await fetch(`${this.baseURL}/config?category=${category}&language=${this.currentLanguage}`);
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

  // Load all app content in current language
  async loadAppContent() {
    try {
      const [animationText, uiTexts, aiPrompt, mockResponses] = await Promise.all([
        this.getAnimationText(),
        this.getAllUITexts(),
        this.getAIPrompt(),
        this.getMockResponses()
      ]);

      return {
        animation: {
          phrase: animationText
        },
        ui: uiTexts,
        ai: {
          systemPrompt: aiPrompt
        },
        mockResponses
      };
    } catch (error) {
      console.error('Error loading app content:', error);
      return {
        animation: {},
        ui: {},
        ai: {},
        mockResponses: {}
      };
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
      keys: Array.from(this.cache.keys()),
      currentLanguage: this.currentLanguage
    };
  }

  // Format date in current language
  formatDate(date, options = {}) {
    try {
      return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
    } catch (error) {
      // Fallback to English
      return new Intl.DateTimeFormat('en', options).format(date);
    }
  }

  // Format number in current language
  formatNumber(number, options = {}) {
    try {
      return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    } catch (error) {
      // Fallback to English
      return new Intl.NumberFormat('en', options).format(number);
    }
  }
}

export default new LanguageService(); 