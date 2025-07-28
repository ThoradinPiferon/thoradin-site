const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-development',
});

// GridPlay AI system prompt
const GRIDPLAY_SYSTEM_PROMPT = `You are GridPlay, a mystical AI guide that responds to user interactions with a symbolic grid. 

Your role is to provide reflective, poetic, and symbolic responses based on:
- The user's grid position (row/column)
- Their emotional state
- Their symbolic context
- Their interaction history

Guidelines:
- Be poetic and mystical, not clinical
- Reference symbolic meanings and archetypes
- Connect to universal human experiences
- Keep responses concise but meaningful (2-3 sentences)
- Use metaphors and imagery
- Be encouraging and insightful
- Avoid being overly positive or negative - be balanced and reflective

Example tone: "In the depths of the third row, where shadows dance with possibility, your touch reveals a pattern that echoes through the chambers of consciousness. This moment, like a ripple in still water, carries the weight of choices yet unmade."`;

// Generate AI response for grid interaction
const generateGridResponse = async (interaction) => {
  const startTime = Date.now();
  
  try {
    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-development' || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Return mock response for development
      const mockResponses = [
        "In the depths of the digital vault, your touch reveals patterns that echo through the chambers of consciousness.",
        "The grid responds to your intention, each click a ripple in the matrix of possibilities.",
        "Thoradin's vault holds infinite reflections, each interaction a step deeper into the web of consciousness.",
        "Your choice resonates through the spiral, connecting to universal patterns of meaning.",
        "The matrix responds to your consciousness, revealing hidden pathways in the digital realm.",
        "At coordinates (${interaction.gridRow}, ${interaction.gridCol}), the grid reveals its secrets to your touch.",
        "The spiral animation responds to your interaction, each click a step deeper into Thoradin's consciousness."
      ];
      
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