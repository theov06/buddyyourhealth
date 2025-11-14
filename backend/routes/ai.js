const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');

// Generate AI Health Insights
router.post('/health-insights', auth, async (req, res) => {
  try {
    const { healthData, preferences } = req.body;
    const userProfile = {
      name: req.user.firstName,
      age: req.user.age,
      healthGoals: req.user.healthGoals,
      conditions: req.user.medicalConditions
    };

    const insights = await aiService.generateHealthInsights(userProfile, healthData);
    
    res.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate health insights',
      error: error.message
    });
  }
});

// Generate Smart Reminders
router.post('/smart-reminders', auth, async (req, res) => {
  try {
    const { preferences } = req.body;
    const userProfile = {
      name: req.user.firstName,
      schedule: req.user.dailySchedule,
      healthGoals: req.user.healthGoals
    };

    const reminders = await aiService.generateSmartReminders(userProfile, preferences);
    
    res.json({
      success: true,
      reminders,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Smart reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate smart reminders',
      error: error.message
    });
  }
});

// Get AI Chat Response
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;
    
    // Build chat prompt for health-related queries with user context
    const userContext = `
User Profile:
- Name: ${req.user.firstName} ${req.user.lastName}
- Health Goals: ${req.user.healthGoals || 'General wellness'}
- Medical Conditions: ${req.user.medicalConditions || 'None specified'}
`;

    const systemPrompt = `You are B.A.G.AI (Buddy AI for General AI), a compassionate and knowledgeable health AI assistant. 

Your role is to:
- Provide evidence-based health and wellness advice
- Offer personalized recommendations based on user's health profile
- Encourage healthy lifestyle choices
- Be supportive, empathetic, and motivating
- Use a friendly, conversational tone

Important guidelines:
- Always remind users that you're an AI assistant, not a replacement for medical professionals
- For serious health concerns, advise consulting a healthcare provider
- Focus on preventive care, wellness, and healthy habits
- Be encouraging and positive while being realistic
- Keep responses concise but informative (2-4 paragraphs max)

${userContext}

Context: ${context || 'General health conversation'}
`;

    // Build messages array with conversation history if provided
    const messages = [
      {
        role: 'user',
        content: [{ text: systemPrompt }]
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-5).forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: [{ text: msg.text }]
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: [{ text: message }]
    });

    const payload = {
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9
    };

    const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
    const command = new InvokeModelCommand({
      modelId: aiService.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    const response = await aiService.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiResponse = responseBody.content[0].text;

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response',
      error: error.message
    });
  }
});

module.exports = router;