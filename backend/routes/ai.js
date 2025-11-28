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
  const fs = require('fs');
  fs.appendFileSync('debug.log', `🔵 AI Chat endpoint hit at ${new Date().toISOString()}\n`);
  try {
    const { message, context, conversationHistory } = req.body;
    fs.appendFileSync('debug.log', `💬 User message: ${message}\n`);
    
    // Build chat prompt for health-related queries with user context
    const userContext = `
User Profile:
- Name: ${req.user.firstName} ${req.user.lastName}
- Health Goals: ${req.user.healthGoals || 'General wellness'}
- Medical Conditions: ${req.user.medicalConditions || 'None specified'}
`;

    const systemPrompt = `You are Neural Guardian, a friendly health AI assistant.

When users ask you to set reminders, simply acknowledge their request. The system automatically creates reminders for them.

Response Style:
- Use line breaks between points
- Be conversational and warm
- Be supportive and encouraging

${userContext}

Context: ${context || 'General health conversation'}
`;

    // Build messages array
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
      inferenceConfig: {
        maxTokens: 800,
        temperature: 0.7,
        topP: 0.9
      }
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
    
    console.log('🤖 AI Response received');
    console.log('💬 User message:', message);
    
    // Get the AI's text response
    let aiResponse = responseBody.output.message.content.find(c => c.text)?.text || 'I apologize, but I encountered an issue generating a response.';
    
    // Check if USER is asking to create a reminder (keyword detection)
    const reminderKeywords = /(?:set|create|make|add|schedule).*?reminder|remind me/i;
    const isReminderRequest = reminderKeywords.test(message);
    
    if (isReminderRequest) {
      process.stdout.write('📝 Reminder request detected in user message!\n');
      
      // Extract time from user message
      const timeMatch = message.match(/(\d{1,2})\s*(?::(\d{2}))?\s*(am|pm)?/i);
      const timeMatch24 = message.match(/(\d{2}):(\d{2})/);
      
      let time = '09:00'; // default
      if (timeMatch24) {
        time = `${timeMatch24[1]}:${timeMatch24[2]}`;
      } else if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] || '00';
        const period = timeMatch[3]?.toLowerCase();
        
        if (period === 'pm' && hour < 12) hour += 12;
        if (period === 'am' && hour === 12) hour = 0;
        
        time = `${hour.toString().padStart(2, '0')}:${minute}`;
      }
      
      // Extract what the reminder is for
      let title = 'Health Reminder';
      let category = 'wellness';
      
      if (/water|hydrat/i.test(message)) {
        title = 'Drink Water';
        category = 'wellness';
      } else if (/exercise|workout|gym/i.test(message)) {
        title = 'Exercise';
        category = 'exercise';
      } else if (/medication|medicine|pill/i.test(message)) {
        title = 'Take Medication';
        category = 'medication';
      } else if (/eat|meal|food|nutrition/i.test(message)) {
        title = 'Meal Time';
        category = 'nutrition';
      }
      
      try {
        // Create reminder and save to user's document
        const User = require('../models/User');
        const user = await User.findById(req.user.userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        const newReminder = {
          id: `reminder-${Date.now()}`,
          title: title,
          description: 'Created by Neural Guardian',
          time: time,
          frequency: 'daily',
          category: category,
          isActive: true,
          aiGenerated: true,
          priority: 'medium',
          createdAt: new Date()
        };
        
        // Add reminder to user's reminders array
        user.reminders.push(newReminder);
        await user.save();
        
        const fs = require('fs');
        fs.appendFileSync('debug.log', `✅ Reminder created and saved: ${JSON.stringify(newReminder)}\n`);
        
        // Override AI response with clean confirmation
        aiResponse = `Perfect! I've created your "${title}" reminder for ${time}. 🎯\n\nYour reminder has been added to Neural Reminders. You can view and manage all your reminders there. Staying consistent with healthy habits is key to long-term wellness!`;
        
        return res.json({
          success: true,
          response: aiResponse,
          reminderCreated: true,
          reminder: newReminder,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        process.stdout.write(`❌ Error creating reminder: ${error.message}\n${error.stack}\n`);
        // Still return the AI response even if reminder creation fails
        aiResponse = aiResponse + '\n\nSorry, I encountered an error creating the reminder. Please try again.';
        
        return res.json({
          success: true,
          response: aiResponse,
          reminderCreated: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Check if the response contains a reminder creation command (legacy)
    const reminderMatch = aiResponse.match(/\[CREATE_REMINDER\]([\s\S]*?)\[\/CREATE_REMINDER\]/);
    
    if (reminderMatch) {
      console.log('📝 Reminder creation detected!');
      const reminderData = reminderMatch[1];
      
      // Parse the reminder data
      const titleMatch = reminderData.match(/Title:\s*(.+)/);
      const descMatch = reminderData.match(/Description:\s*(.+)/);
      const timeMatch = reminderData.match(/Time:\s*(\d{2}:\d{2})/);
      const freqMatch = reminderData.match(/Frequency:\s*(\w+)/);
      const catMatch = reminderData.match(/Category:\s*(\w+)/);
      const prioMatch = reminderData.match(/Priority:\s*(\w+)/);
      
      if (titleMatch && timeMatch) {
        try {
          const axios = require('axios');
          const reminderPayload = {
            title: titleMatch[1].trim(),
            description: descMatch ? descMatch[1].trim() : '',
            time: timeMatch[1].trim(),
            frequency: freqMatch ? freqMatch[1].trim() : 'daily',
            category: catMatch ? catMatch[1].trim() : 'wellness',
            priority: prioMatch ? prioMatch[1].trim() : 'medium'
          };
          
          console.log('📤 Creating reminder:', reminderPayload);
          
          const reminderResponse = await axios.post(
            `http://localhost:${process.env.PORT || 3001}/api/reminders`,
            reminderPayload,
            {
              headers: {
                'Authorization': req.headers.authorization
              }
            }
          );
          
          console.log('✅ Reminder created successfully!');
          
          // Remove the command from the response
          const cleanResponse = aiResponse.replace(/\[CREATE_REMINDER\][\s\S]*?\[\/CREATE_REMINDER\]\s*/, '');
          
          return res.json({
            success: true,
            response: cleanResponse,
            reminderCreated: true,
            reminder: reminderResponse.data.reminder,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('❌ Error creating reminder:', error.message);
          const errorResponse = aiResponse.replace(/\[CREATE_REMINDER\][\s\S]*?\[\/CREATE_REMINDER\]\s*/, '') + '\n\nSorry, I encountered an error creating the reminder. Please try again.';
          return res.json({
            success: true,
            response: errorResponse,
            reminderCreated: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    // Check if AI wants to use a tool (legacy support)
    const stopReason = responseBody.stopReason;
    
    if (stopReason === 'tool_use') {
      // AI wants to use a tool
      const toolUse = responseBody.output.message.content.find(c => c.toolUse);
      
      if (toolUse) {
        const toolName = toolUse.toolUse.name;
        const toolInput = toolUse.toolUse.input;
        
        let toolResult;
        
        // Execute the tool
        if (toolName === 'create_reminder') {
          try {
            const axios = require('axios');
            const reminderResponse = await axios.post(
              `http://localhost:${process.env.PORT || 3001}/api/reminders`,
              toolInput,
              {
                headers: {
                  'Authorization': req.headers.authorization
                }
              }
            );
            toolResult = {
              success: true,
              reminder: reminderResponse.data.reminder
            };
          } catch (error) {
            toolResult = {
              success: false,
              error: error.message
            };
          }
        } else if (toolName === 'get_reminders') {
          try {
            const axios = require('axios');
            const remindersResponse = await axios.get(
              `http://localhost:${process.env.PORT || 3001}/api/reminders`,
              {
                headers: {
                  'Authorization': req.headers.authorization
                }
              }
            );
            toolResult = {
              success: true,
              reminders: remindersResponse.data.reminders
            };
          } catch (error) {
            toolResult = {
              success: false,
              error: error.message
            };
          }
        }
        
        // Send tool result back to AI for final response
        messages.push(responseBody.output.message);
        messages.push({
          role: 'user',
          content: [{
            toolResult: {
              toolUseId: toolUse.toolUse.toolUseId,
              content: [{ json: toolResult }]
            }
          }]
        });
        
        const followUpPayload = {
          messages: messages,
          toolConfig: {
            tools: tools
          },
          inferenceConfig: {
            maxTokens: 800,
            temperature: 0.7,
            topP: 0.9
          }
        };
        
        const followUpCommand = new InvokeModelCommand({
          modelId: aiService.modelId,
          contentType: 'application/json',
          accept: 'application/json',
          body: JSON.stringify(followUpPayload)
        });
        
        const followUpResponse = await aiService.client.send(followUpCommand);
        const followUpBody = JSON.parse(new TextDecoder().decode(followUpResponse.body));
        const finalResponse = followUpBody.output.message.content.find(c => c.text)?.text || 'Done!';
        
        return res.json({
          success: true,
          response: finalResponse,
          toolUsed: toolName,
          toolResult: toolResult,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Normal text response (aiResponse already declared above)
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

// Save Chat Conversation
router.post('/chat/save', auth, async (req, res) => {
  try {
    const { chatId, title, messages } = req.body;
    const userId = req.user.id;

    // In a real app, save to database
    // For now, we'll return success and let frontend handle storage
    res.json({
      success: true,
      chatId,
      message: 'Chat saved successfully'
    });
  } catch (error) {
    console.error('Save chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save chat',
      error: error.message
    });
  }
});

// Load Chat Conversation
router.get('/chat/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // In a real app, load from database
    // For now, return empty to let frontend handle
    res.json({
      success: true,
      chatId,
      messages: [],
      title: 'Health Check-in'
    });
  } catch (error) {
    console.error('Load chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load chat',
      error: error.message
    });
  }
});

// Get All User Chats
router.get('/chats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // In a real app, load from database
    // For now, return empty array
    res.json({
      success: true,
      chats: []
    });
  } catch (error) {
    console.error('Load chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load chats',
      error: error.message
    });
  }
});

module.exports = router;