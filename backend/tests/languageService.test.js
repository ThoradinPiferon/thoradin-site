const languageService = require('../services/languageService');

describe('LanguageService', () => {
  describe('detectLanguage', () => {
    test('should detect language from Accept-Language header', () => {
      const req = {
        headers: {
          'accept-language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      };
      expect(languageService.detectLanguage(req)).toBe('es');
    });

    test('should detect language from x-language header', () => {
      const req = {
        headers: {
          'x-language': 'fr'
        }
      };
      expect(languageService.detectLanguage(req)).toBe('fr');
    });

    test('should fallback to English for unsupported language', () => {
      const req = {
        headers: {
          'accept-language': 'xx-XX,xx;q=0.9'
        }
      };
      expect(languageService.detectLanguage(req)).toBe('en');
    });

    test('should handle missing headers gracefully', () => {
      const req = { headers: {} };
      expect(languageService.detectLanguage(req)).toBe('en');
    });
  });

  describe('isSupported', () => {
    test('should return true for supported languages', () => {
      expect(languageService.isSupported('en')).toBe(true);
      expect(languageService.isSupported('ES')).toBe(true);
      expect(languageService.isSupported('  fr  ')).toBe(true);
    });

    test('should return false for unsupported languages', () => {
      expect(languageService.isSupported('xx')).toBe(false);
      expect(languageService.isSupported('')).toBe(false);
      expect(languageService.isSupported(null)).toBe(false);
      expect(languageService.isSupported(undefined)).toBe(false);
    });
  });

  describe('validateLanguageCode', () => {
    test('should validate correct language codes', () => {
      expect(languageService.validateLanguageCode('en')).toBe(true);
      expect(languageService.validateLanguageCode('en-US')).toBe(true);
      expect(languageService.validateLanguageCode('es')).toBe(true);
    });

    test('should reject invalid language codes', () => {
      expect(languageService.validateLanguageCode('english')).toBe(false);
      expect(languageService.validateLanguageCode('EN')).toBe(false);
      expect(languageService.validateLanguageCode('')).toBe(false);
      expect(languageService.validateLanguageCode(null)).toBe(false);
    });
  });
}); 