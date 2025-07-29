# 🎨 Customization Guide

## 🚀 Quick Start for New Users

If you've copied this repository and want to customize it for your own project, follow these steps:

### 1. **Edit Configuration File**
Open `backend/config/customization.js` and update the settings:

```javascript
module.exports = {
  // 👤 Change these to your credentials
  admin: {
    email: 'your-email@gmail.com',        // Your email
    username: 'YourUsername',             // Your username
    password: 'YourSecurePassword2024!'   // Your password
  },

  // 🎭 Customize your AI character
  character: {
    name: 'YourCharacterName',            // AI character name
    personality: 'your-personality',      // Character personality
    role: 'your-role'                     // Character role
  },

  // 🌟 Customize your project
  project: {
    name: 'Your Project Name',            // Project name
    theme: 'your-theme',                  // Main theme
    vaultName: 'Your Vault Name',         // Vault/portal name
    welcomeMessage: 'Your welcome message' // Welcome message
  }
};
```

### 2. **Deploy to Render**
Set these environment variables in Render:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | Your secure JWT secret |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NODE_ENV` | `production` |

### 3. **Login with Your Credentials**
After deployment, log in with:
- **Email**: Your email from the config
- **Password**: Your password from the config

## 🎭 **Theme Examples**

### **Creative Writing Theme**
```javascript
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
```

### **Meditation Theme**
```javascript
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
```

### **Learning Theme**
```javascript
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
```

## 🌍 **Multilingual Support**

The system automatically supports 10 languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)

All content is automatically translated and customized based on your configuration.

## 🔧 **Advanced Customization**

### **Custom AI Prompts**
You can customize the AI system prompts by editing the content in the database or modifying the initialization scripts.

### **Custom Visual Elements**
- Grid size: Modify `visual.gridSize` in the config
- Animation speed: Change `visual.animationSpeed`
- Color scheme: Update `visual.colorScheme`

### **Custom AI Settings**
- Model: Change `ai.model` (gpt-4, gpt-3.5-turbo)
- Response length: Adjust `ai.maxTokens`
- Creativity: Modify `ai.temperature`

## 📋 **Deployment Checklist**

Before deploying, ensure you have:

- ✅ [ ] Updated admin credentials in `customization.js`
- ✅ [ ] Set your OpenAI API key
- ✅ [ ] Created a PostgreSQL database
- ✅ [ ] Set all environment variables in Render
- ✅ [ ] Tested locally (optional but recommended)

## 🔍 **Testing Your Customization**

After deployment, test:

1. **Admin Login**: Use your custom credentials
2. **Content Display**: Check if your custom messages appear
3. **AI Responses**: Verify AI uses your character name
4. **Multilingual**: Test different languages
5. **Grid Interaction**: Ensure grid responds properly

## 🚨 **Important Notes**

- **Never commit sensitive credentials** to GitHub
- **Use strong passwords** for admin accounts
- **Keep your OpenAI API key secure**
- **Test thoroughly** before going live
- **Monitor usage** to avoid unexpected costs

## 📞 **Support**

If you need help:
1. Check the main README.md
2. Review the RENDER_DEPLOYMENT.md guide
3. Check the API documentation
4. Test the health endpoint: `/api/health`

## 🎉 **Success!**

Once customized and deployed, you'll have your own:
- ✅ Custom admin user
- ✅ Personalized AI character
- ✅ Themed content and messages
- ✅ Multilingual support
- ✅ Interactive grid experience
- ✅ Professional deployment

Your interactive grid is now ready to inspire and engage users with your unique vision! 🌟 