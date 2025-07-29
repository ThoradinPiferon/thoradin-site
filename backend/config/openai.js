const OpenAI = require('openai');
const CONTENT_CONFIG = require('../../content-config');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-development',
});

// AI system prompt from content config
const GRIDPLAY_SYSTEM_PROMPT = CONTENT_CONFIG.aiSystemPrompt;

// Generate AI response for grid interaction
const generateGridResponse = async (interaction) => {
  const startTime = Date.now();
  
  try {
    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-development' || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Return mock response for development
      const mockResponses = CONTENT_CONFIG.mockResponses;
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return {
        response: randomResponse,
        model: "mock-gpt-4",
        tokensUsed: 50,
        responseTime: Date.now() - startTime,
        prompt: "Mock response for development"
      };
    }

    const prompt = `User clicked grid position (${interaction.gridRow}, ${interaction.gridCol})
Emotional state: ${interaction.emotionalState || 'neutral'}
Symbolic context: ${interaction.symbolicContext || 'exploring'}
Interaction type: ${interaction.interactionType}

Please provide a reflective, symbolic response.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: GRIDPLAY_SYSTEM_PROMPT },
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
      prompt
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

module.exports = {
  openai,
  generateGridResponse,
  GRIDPLAY_SYSTEM_PROMPT
}; 