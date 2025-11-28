// Tool Executor Service
// Executes AI tool calls and returns results

const User = require('../models/User');

class ToolExecutor {
  
  async executeTool(toolName, toolInput, userId, authHeader) {
    console.log(`🔧 Executing tool: ${toolName}`);
    console.log(`📥 Input:`, JSON.stringify(toolInput, null, 2));
    
    try {
      switch (toolName) {
        case 'create_reminder':
          return await this.createReminder(toolInput, userId);
        
        case 'get_reminders':
          return await this.getReminders(toolInput, userId);
        
        case 'update_reminder':
          return await this.updateReminder(toolInput, userId);
        
        case 'delete_reminder':
          return await this.deleteReminder(toolInput, userId);
        
        case 'get_health_insights':
          return await this.getHealthInsights(toolInput, userId);
        
        case 'search_health_info':
          return await this.searchHealthInfo(toolInput);
        
        case 'calculate_health_metric':
          return await this.calculateHealthMetric(toolInput);
        
        case 'get_user_profile':
          return await this.getUserProfile(userId);
        
        default:
          return {
            success: false,
            error: `Unknown tool: ${toolName}`
          };
      }
    } catch (error) {
      console.error(`❌ Tool execution error:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async createReminder(input, userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const newReminder = {
      id: `reminder-${Date.now()}`,
      title: input.title,
      description: input.description || 'Created by Neural Guardian',
      time: input.time,
      frequency: input.frequency,
      category: input.category,
      isActive: true,
      aiGenerated: true,
      priority: input.priority || 'medium',
      createdAt: new Date()
    };
    
    user.reminders.push(newReminder);
    await user.save();
    
    console.log(`✅ Reminder created: ${newReminder.title}`);
    
    return {
      success: true,
      message: 'Reminder created successfully',
      reminder: newReminder
    };
  }
  
  async getReminders(input, userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    let reminders = user.reminders || [];
    
    // Apply filter
    if (input.filter) {
      switch (input.filter) {
        case 'active':
          reminders = reminders.filter(r => r.isActive);
          break;
        case 'inactive':
          reminders = reminders.filter(r => !r.isActive);
          break;
        case 'today':
          // Filter reminders for today
          const now = new Date();
          reminders = reminders.filter(r => {
            // Simple check - in production, you'd want more sophisticated date handling
            return r.isActive;
          });
          break;
      }
    }
    
    return {
      success: true,
      count: reminders.length,
      reminders: reminders.map(r => ({
        id: r.id,
        title: r.title,
        time: r.time,
        frequency: r.frequency,
        category: r.category,
        isActive: r.isActive,
        aiGenerated: r.aiGenerated
      }))
    };
  }
  
  async updateReminder(input, userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const reminderIndex = user.reminders.findIndex(r => r.id === input.reminderId);
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    // Update reminder fields
    Object.assign(user.reminders[reminderIndex], input.updates);
    await user.save();
    
    return {
      success: true,
      message: 'Reminder updated successfully',
      reminder: user.reminders[reminderIndex]
    };
  }
  
  async deleteReminder(input, userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const reminderIndex = user.reminders.findIndex(r => r.id === input.reminderId);
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    const deletedReminder = user.reminders[reminderIndex];
    user.reminders.splice(reminderIndex, 1);
    await user.save();
    
    return {
      success: true,
      message: 'Reminder deleted successfully',
      deletedReminder: {
        id: deletedReminder.id,
        title: deletedReminder.title
      }
    };
  }
  
  async getHealthInsights(input, userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const insights = {
      focusArea: input.focusArea || 'general',
      recommendations: [],
      userProfile: {
        healthGoals: user.healthGoals,
        conditions: user.medicalConditions
      }
    };
    
    // Generate basic insights based on focus area
    switch (input.focusArea) {
      case 'exercise':
        insights.recommendations.push('Aim for 150 minutes of moderate exercise per week');
        insights.recommendations.push('Include both cardio and strength training');
        break;
      case 'nutrition':
        insights.recommendations.push('Eat a balanced diet with plenty of fruits and vegetables');
        insights.recommendations.push('Stay hydrated with 8 glasses of water daily');
        break;
      case 'sleep':
        insights.recommendations.push('Aim for 7-9 hours of sleep per night');
        insights.recommendations.push('Maintain a consistent sleep schedule');
        break;
      default:
        insights.recommendations.push('Stay active, eat well, and get enough sleep');
        insights.recommendations.push('Regular check-ups are important for preventive care');
    }
    
    return {
      success: true,
      insights
    };
  }
  
  async searchHealthInfo(input) {
    // In production, this would call a real health information API
    // For now, return a placeholder response
    return {
      success: true,
      query: input.query,
      category: input.category || 'general',
      information: `Health information about: ${input.query}. Please consult with a healthcare professional for personalized medical advice.`,
      disclaimer: 'This information is for educational purposes only and should not replace professional medical advice.'
    };
  }
  
  async calculateHealthMetric(input) {
    const { metric, data } = input;
    let result = {};
    
    switch (metric) {
      case 'bmi':
        if (data.weight && data.height) {
          const bmi = data.weight / ((data.height / 100) ** 2);
          result = {
            bmi: bmi.toFixed(1),
            category: bmi < 18.5 ? 'Underweight' : 
                     bmi < 25 ? 'Normal' : 
                     bmi < 30 ? 'Overweight' : 'Obese'
          };
        }
        break;
      
      case 'calories':
        if (data.weight && data.height && data.age && data.gender && data.activityLevel) {
          // Harris-Benedict Equation
          let bmr;
          if (data.gender === 'male') {
            bmr = 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age);
          } else {
            bmr = 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age);
          }
          
          const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9
          };
          
          const tdee = bmr * (activityMultipliers[data.activityLevel] || 1.2);
          result = {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            recommendation: `${Math.round(tdee)} calories per day to maintain weight`
          };
        }
        break;
      
      case 'water':
        if (data.weight) {
          const waterIntake = (data.weight * 0.033).toFixed(1); // 33ml per kg
          result = {
            dailyWater: `${waterIntake} liters`,
            glasses: Math.round(waterIntake * 4) // ~250ml per glass
          };
        }
        break;
      
      case 'sleep':
        result = {
          recommended: '7-9 hours',
          note: 'Adults typically need 7-9 hours of sleep per night'
        };
        break;
      
      case 'steps':
        result = {
          recommended: '10,000 steps',
          note: 'Aim for at least 10,000 steps per day for optimal health'
        };
        break;
    }
    
    return {
      success: true,
      metric,
      result
    };
  }
  
  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      profile: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        healthGoals: user.healthGoals || 'Not specified',
        medicalConditions: user.medicalConditions || 'None specified',
        reminderCount: user.reminders?.length || 0
      }
    };
  }
}

module.exports = new ToolExecutor();
