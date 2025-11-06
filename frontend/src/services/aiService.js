import api from './api';

class AIService {
  // Generate AI Health Insights
  async generateHealthInsights(healthData = {}) {
    try {
      const response = await api.post('/ai/health-insights', {
        healthData: {
          activityLevel: healthData.activityLevel || 'moderate',
          sleepQuality: healthData.sleepQuality || 'good',
          stressLevel: healthData.stressLevel || 'low',
          nutritionScore: healthData.nutritionScore || 'fair',
          ...healthData
        },
        preferences: {
          focusAreas: ['general wellness', 'nutrition', 'exercise'],
          ...healthData.preferences
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error generating health insights:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate health insights');
    }
  }

  // Generate Smart Reminders
  async generateSmartReminders(preferences = {}) {
    try {
      const response = await api.post('/ai/smart-reminders', {
        preferences: {
          schedule: 'standard work hours',
          focusAreas: ['hydration', 'exercise', 'nutrition', 'sleep'],
          frequency: 'daily',
          preferredTimes: ['morning', 'afternoon', 'evening'],
          ...preferences
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error generating smart reminders:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate smart reminders');
    }
  }

  // AI Chat
  async sendChatMessage(message, context = '') {
    try {
      const response = await api.post('/ai/chat', {
        message,
        context
      });

      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error(error.response?.data?.message || 'Failed to get AI response');
    }
  }

  // Mock data for development/testing
  getMockHealthInsights() {
    return {
      success: true,
      insights: [
        {
          title: "Optimize Your Hydration",
          description: "Based on your activity level, aim for 10-12 glasses of water daily. Consider adding electrolytes after workouts to maintain optimal hydration balance.",
          priority: "high",
          category: "hydration"
        },
        {
          title: "Enhance Sleep Recovery",
          description: "Your sleep quality could benefit from a consistent bedtime routine. Try dimming lights 1 hour before bed and avoiding screens to improve deep sleep phases.",
          priority: "high",
          category: "sleep"
        },
        {
          title: "Boost Nutritional Variety",
          description: "Incorporate more colorful vegetables into your meals. Aim for 5 different colored fruits and vegetables daily to maximize nutrient diversity.",
          priority: "medium",
          category: "nutrition"
        }
      ],
      generatedAt: new Date().toISOString()
    };
  }

  getMockSmartReminders() {
    return {
      success: true,
      reminders: [
        {
          title: "Morning Energizer",
          description: "Start with 16oz of water and 5 minutes of stretching",
          time: "07:00",
          frequency: "daily",
          category: "hydration",
          priority: "high"
        },
        {
          title: "Midday Movement",
          description: "Take a 10-minute walk or do desk exercises",
          time: "12:30",
          frequency: "daily",
          category: "exercise",
          priority: "medium"
        },
        {
          title: "Afternoon Fuel",
          description: "Healthy snack time - nuts, fruits, or yogurt",
          time: "15:00",
          frequency: "daily",
          category: "nutrition",
          priority: "medium"
        },
        {
          title: "Evening Hydration Check",
          description: "Ensure you've met your daily water goal",
          time: "18:00",
          frequency: "daily",
          category: "hydration",
          priority: "medium"
        },
        {
          title: "Sleep Preparation",
          description: "Begin wind-down routine for optimal rest",
          time: "21:00",
          frequency: "daily",
          category: "sleep",
          priority: "high"
        }
      ],
      generatedAt: new Date().toISOString()
    };
  }
}

export default new AIService();