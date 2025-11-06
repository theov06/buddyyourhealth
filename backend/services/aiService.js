const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

class AIService {
  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    
    // Amazon Nova model ID
    this.modelId = 'amazon.nova-micro-v1:0'; // or 'amazon.nova-lite-v1:0' for more advanced features
  }

  async generateHealthInsights(userProfile, healthData) {
    try {
      const prompt = this.buildHealthInsightsPrompt(userProfile, healthData);
      
      const payload = {
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      };

      const command = new InvokeModelCommand({
        modelId: this.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload)
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return this.parseHealthInsights(responseBody.content[0].text);
    } catch (error) {
      console.error('Error generating health insights:', error);
      throw new Error('Failed to generate AI health insights');
    }
  }

  buildHealthInsightsPrompt(userProfile, healthData) {
    return `
You are a professional health AI assistant. Based on the following user profile and health data, provide 3 personalized health insights and recommendations.

User Profile:
- Name: ${userProfile.name || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Health Goals: ${userProfile.healthGoals || 'General wellness'}
- Medical Conditions: ${userProfile.conditions || 'None specified'}

Recent Health Data:
- Activity Level: ${healthData.activityLevel || 'Moderate'}
- Sleep Quality: ${healthData.sleepQuality || 'Good'}
- Stress Level: ${healthData.stressLevel || 'Low'}
- Nutrition Score: ${healthData.nutritionScore || 'Fair'}

Please provide exactly 3 health insights in the following JSON format:
{
  "insights": [
    {
      "title": "Brief insight title",
      "description": "Detailed explanation and actionable recommendation",
      "priority": "high|medium|low",
      "category": "nutrition|exercise|sleep|stress|general"
    }
  ]
}

Focus on:
1. Actionable, personalized recommendations
2. Evidence-based health advice
3. Realistic and achievable goals
4. Positive, encouraging tone

Ensure recommendations are safe, general wellness advice and not medical diagnoses.
`;
  }

  parseHealthInsights(aiResponse) {
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.insights || [];
      }
      
      // Fallback: parse manually if JSON extraction fails
      return this.createFallbackInsights();
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.createFallbackInsights();
    }
  }

  createFallbackInsights() {
    return [
      {
        title: "Stay Hydrated",
        description: "Aim for 8-10 glasses of water daily to support optimal body function and energy levels.",
        priority: "high",
        category: "general"
      },
      {
        title: "Regular Movement",
        description: "Incorporate 30 minutes of moderate exercise into your daily routine for better cardiovascular health.",
        priority: "medium",
        category: "exercise"
      },
      {
        title: "Quality Sleep",
        description: "Maintain a consistent sleep schedule of 7-9 hours to support recovery and mental clarity.",
        priority: "high",
        category: "sleep"
      }
    ];
  }

  async generateSmartReminders(userProfile, preferences) {
    try {
      const prompt = this.buildRemindersPrompt(userProfile, preferences);
      
      const payload = {
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.6,
        top_p: 0.8
      };

      const command = new InvokeModelCommand({
        modelId: this.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload)
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return this.parseReminders(responseBody.content[0].text);
    } catch (error) {
      console.error('Error generating smart reminders:', error);
      throw new Error('Failed to generate smart reminders');
    }
  }

  buildRemindersPrompt(userProfile, preferences) {
    return `
Generate personalized health reminders for a user based on their profile and preferences.

User Profile:
- Daily Schedule: ${preferences.schedule || 'Standard work hours'}
- Health Focus Areas: ${preferences.focusAreas || 'General wellness'}
- Reminder Frequency: ${preferences.frequency || 'Daily'}
- Preferred Times: ${preferences.preferredTimes || 'Morning and evening'}

Create 5 smart reminders in JSON format:
{
  "reminders": [
    {
      "title": "Reminder title",
      "description": "Brief description",
      "time": "HH:MM",
      "frequency": "daily|weekly|custom",
      "category": "medication|exercise|nutrition|hydration|sleep",
      "priority": "high|medium|low"
    }
  ]
}

Make reminders:
1. Specific and actionable
2. Timed appropriately for the user's schedule
3. Varied across different health categories
4. Motivating and positive in tone
`;
  }

  parseReminders(aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.reminders || [];
      }
      return this.createFallbackReminders();
    } catch (error) {
      console.error('Error parsing reminders:', error);
      return this.createFallbackReminders();
    }
  }

  createFallbackReminders() {
    return [
      {
        title: "Morning Hydration",
        description: "Start your day with a glass of water",
        time: "07:00",
        frequency: "daily",
        category: "hydration",
        priority: "high"
      },
      {
        title: "Midday Movement",
        description: "Take a 10-minute walk or stretch break",
        time: "12:30",
        frequency: "daily",
        category: "exercise",
        priority: "medium"
      },
      {
        title: "Evening Wind-down",
        description: "Begin your bedtime routine for better sleep",
        time: "21:00",
        frequency: "daily",
        category: "sleep",
        priority: "high"
      }
    ];
  }
}

module.exports = new AIService();