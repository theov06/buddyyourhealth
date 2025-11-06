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
    const { message, context } = req.body;
    
    // Build chat prompt for health-related queries
    const chatPrompt = `
You are a helpful health AI assistant. The user asked: "${message}"

Context: ${context || 'General health inquiry'}

Provide a helpful, accurate, and encouraging response. Keep it concise but informative.
Focus on general wellness advice and remind users to consult healthcare professionals for medical concerns.
`;

    const payload = {
      messages: [
        {
          role: 'user',
          content: [{ text: chatPrompt }]
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    };

    const response = await aiService.client.send(
      new aiService.client.constructor.InvokeModelCommand({
        modelId: aiService.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload)
      })
    );

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