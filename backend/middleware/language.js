import languageService from '../services/languageService.js';

// Language detection middleware
const languageMiddleware = (req, res, next) => {
  try {
    // Detect language from request
    const detectedLanguage = languageService.detectLanguage(req);
    
    // Set language in request object for use in routes
    req.language = detectedLanguage;
    
    // Add language info to response headers
    res.set('X-Detected-Language', detectedLanguage);
    
    next();
  } catch (error) {
    console.error('Language middleware error:', error);
    // Fallback to default language
    req.language = 'en';
    next();
  }
};

export { languageMiddleware }; 