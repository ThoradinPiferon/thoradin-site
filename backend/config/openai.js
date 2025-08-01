import OpenAI from 'openai';
import languageService from '../services/languageService.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-development',
});

// Generate AI response for grid interaction
const generateGridResponse = async (interaction, language = 'en') => {
  const startTime = Date.now();
  
  try {
    // Get language-specific AI prompt
    const systemPrompt = await languageService.getAIPrompt(language);
    
    // Check if we have a valid system prompt
    if (!systemPrompt) {
      console.error('Error getting content for key ai_system_prompt in language en: No system prompt found');
      // Return a fallback response instead of throwing
      return {
        response: "The grid responds to your touch, revealing patterns in the digital consciousness.",
        model: "fallback",
        tokensUsed: 0,
        responseTime: Date.now() - startTime,
        prompt: "Fallback response due to missing system prompt"
      };
    }
    
    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-development' || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Return language-specific mock response for development
      const mockResponses = await languageService.getMockResponses(language);
      const responseKeys = Object.keys(mockResponses);
      
      if (responseKeys.length > 0) {
        const randomKey = responseKeys[Math.floor(Math.random() * responseKeys.length)];
        const randomResponse = mockResponses[randomKey];

        return {
          response: randomResponse,
          model: "mock-gpt-4",
          tokensUsed: 50,
          responseTime: Date.now() - startTime,
          prompt: `Mock response for development (${language})`,
          language: language
        };
      }
      
      // Fallback to English if no responses in requested language
      const fallbackResponses = await languageService.getMockResponses('en');
      const fallbackKeys = Object.keys(fallbackResponses);
      
      if (fallbackKeys.length > 0) {
        const randomKey = fallbackKeys[Math.floor(Math.random() * responseKeys.length)];
        const randomResponse = fallbackResponses[randomKey];

        return {
          response: randomResponse,
          model: "mock-gpt-4",
          tokensUsed: 50,
          responseTime: Date.now() - startTime,
          prompt: `Mock response for development (fallback to en)`,
          language: 'en'
        };
      }
      
      // Ultimate fallback
      return {
        response: "The grid responds to your touch, revealing patterns in the digital consciousness.",
        model: "mock-gpt-4",
        tokensUsed: 50,
        responseTime: Date.now() - startTime,
        prompt: "Mock response for development (ultimate fallback)",
        language: 'en'
      };
    }

    const prompt = `User clicked grid position (${interaction.gridRow}, ${interaction.gridCol})
Emotional state: ${interaction.emotionalState || 'neutral'}
Symbolic context: ${interaction.symbolicContext || 'exploring'}
Interaction type: ${interaction.interactionType}

Please provide a reflective, symbolic response in ${language}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const responseTime = Date.now() - startTime;
    const response = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens;

    return {
      response,
      model: "gpt-4",
      tokensUsed,
      responseTime,
      prompt,
      language: language
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Return a fallback response instead of throwing
    return {
      response: "The grid responds to your touch, revealing patterns in the digital consciousness.",
      model: "fallback",
      tokensUsed: 0,
      responseTime: Date.now() - startTime,
      prompt: "Fallback response due to API error"
    };
  }
};

// Generate AI response for direct chat interaction
const generateChatResponse = async (message, language = 'en') => {
  const startTime = Date.now();
  
  try {
    // Get language-specific AI prompt
    const systemPrompt = await languageService.getAIPrompt(language);
    
    // Check if we have a valid system prompt
    if (!systemPrompt) {
      console.error('Error getting content for key ai_system_prompt in language en: No system prompt found');
      return {
        response: "I am here to guide you through the digital realm. What would you like to explore?",
        model: "fallback",
        tokensUsed: 0,
        responseTime: Date.now() - startTime,
        prompt: "Fallback response due to missing system prompt"
      };
    }
    
    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-development' || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Return language-specific mock response for development
      const mockResponses = await languageService.getMockResponses(language);
      const responseKeys = Object.keys(mockResponses);
      
      if (responseKeys.length > 0) {
        const randomKey = responseKeys[Math.floor(Math.random() * responseKeys.length)];
        const randomResponse = mockResponses[randomKey];

        return {
          response: randomResponse,
          model: "mock-gpt-4",
          tokensUsed: 50,
          responseTime: Date.now() - startTime,
          prompt: `Mock response for development (${language})`,
          language: language
        };
      }
      
      // Fallback to English if no responses in requested language
      const fallbackResponses = await languageService.getMockResponses('en');
      const fallbackKeys = Object.keys(fallbackResponses);
      
      if (fallbackKeys.length > 0) {
        const randomKey = fallbackKeys[Math.floor(Math.random() * fallbackKeys.length)];
        const randomResponse = fallbackResponses[randomKey];

        return {
          response: randomResponse,
          model: "mock-gpt-4",
          tokensUsed: 50,
          responseTime: Date.now() - startTime,
          prompt: `Mock response for development (fallback to en)`,
          language: 'en'
        };
      }
      
      // Ultimate fallback
      return {
        response: "I am here to guide you through the digital realm. What would you like to explore?",
        model: "mock-gpt-4",
        tokensUsed: 50,
        responseTime: Date.now() - startTime,
        prompt: "Mock response for development (ultimate fallback)",
        language: 'en'
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const responseTime = Date.now() - startTime;
    const response = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens;

    return {
      response,
      model: "gpt-4",
      tokensUsed,
      responseTime,
      prompt: message,
      language: language
    };
  } catch (error) {
    console.error('OpenAI Chat API Error:', error);
    // Return a fallback response instead of throwing
    return {
      response: "I am here to guide you through the digital realm. What would you like to explore?",
      model: "fallback",
      tokensUsed: 0,
      responseTime: Date.now() - startTime,
      prompt: "Fallback response due to API error"
    };
  }
};

export {
  openai,
  generateGridResponse,
  generateChatResponse
}; 