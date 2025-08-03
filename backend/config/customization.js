// 🎨 CUSTOMIZATION CONFIGURATION
// Edit this file to customize your interactive grid experience

module.exports = {
  // 👤 Admin User Configuration
  admin: {
    email: 'Marc.R.T.Dache@gmail.com',    // Your email
    username: 'thoradin_piferon',         // Your username
    password: 'ThoradinAdmin2024!'        // Your password
  },

  // 🎭 Character & Theme Configuration
  character: {
    name: 'GridGuide',                    // AI character name
    personality: 'mystical',              // Character personality
    role: 'AI guide'                      // Character role
  },

  // 🌟 Project Configuration
  project: {
    name: 'Interactive Grid',             // Project name
    theme: 'consciousness',               // Main theme (consciousness, creativity, wisdom, etc.)
    vaultName: 'Digital Vault',           // Vault/portal name
    welcomeMessage: 'Welcome to the interactive grid experience'  // Welcome message
  },

  // 🌍 Language Configuration
  languages: {
    default: 'en',                        // Default language
    supported: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']  // Supported languages
  },

  // 🎨 Visual Configuration
  visual: {
    gridSize: 10,                         // Grid size (10x10)
    animationSpeed: 'medium',             // Animation speed (slow, medium, fast)
    colorScheme: 'mystical'               // Color scheme (mystical, modern, classic)
  },

  // 🤖 AI Configuration
  ai: {
    model: 'gpt-4',                       // OpenAI model to use
    maxTokens: 150,                       // Maximum response length
    temperature: 0.8,                     // Creativity level (0.0-1.0)
    systemPrompt: 'You are a mystical AI guide that responds to user interactions with a symbolic grid.'
  },

  // 🔒 Security Configuration
  security: {
    jwtExpiry: '24h',                     // JWT token expiry
    rateLimitWindow: 900000,              // Rate limiting window (15 minutes)
    rateLimitMax: 100                     // Max requests per window
  }
};

// 📝 CUSTOMIZATION EXAMPLES:

// Example 1: Creative Writing Theme
/*
module.exports = {
  admin: {
    email: 'writer@example.com',
    username: 'CreativeWriter',
    password: 'WriterPass2024!'
  },
  character: {
    name: 'StoryWeaver',
    personality: 'creative',
    role: 'storytelling guide'
  },
  project: {
    name: 'Creative Writing Grid',
    theme: 'creativity',
    vaultName: 'Story Vault',
    welcomeMessage: 'Enter the realm of infinite stories'
  }
};
*/

// Example 2: Meditation Theme
/*
module.exports = {
  admin: {
    email: 'meditation@example.com',
    username: 'ZenMaster',
    password: 'ZenPass2024!'
  },
  character: {
    name: 'MindGuide',
    personality: 'peaceful',
    role: 'meditation guide'
  },
  project: {
    name: 'Meditation Grid',
    theme: 'mindfulness',
    vaultName: 'Mind Temple',
    welcomeMessage: 'Enter the temple of inner peace'
  }
};
*/

// Example 3: Learning Theme
/*
module.exports = {
  admin: {
    email: 'teacher@example.com',
    username: 'KnowledgeKeeper',
    password: 'LearnPass2024!'
  },
  character: {
    name: 'WisdomGuide',
    personality: 'educational',
    role: 'learning guide'
  },
  project: {
    name: 'Learning Grid',
    theme: 'knowledge',
    vaultName: 'Knowledge Library',
    welcomeMessage: 'Enter the library of infinite knowledge'
  }
};
*/ 