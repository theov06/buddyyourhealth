// AI Tools Configuration for Amazon Bedrock Function Calling
const tools = [
  {
    toolSpec: {
      name: 'create_reminder',
      description: 'Creates a new health reminder for the user. Use this when the user asks to set up a reminder for health-related activities.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the reminder (e.g., "Drink Water", "Take Medication")'
            },
            description: {
              type: 'string',
              description: 'A brief description of the reminder'
            },
            time: {
              type: 'string',
              description: 'Time in HH:MM format (24-hour)'
            },
            frequency: {
              type: 'string',
              enum: ['daily', 'weekly', 'monthly'],
              description: 'How often the reminder should repeat'
            },
            category: {
              type: 'string',
              enum: ['medication', 'exercise', 'nutrition', 'wellness', 'sleep'],
              description: 'Category of the health reminder'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Priority level of the reminder'
            }
          },
          required: ['title', 'time', 'frequency', 'category']
        }
      }
    }
  },
  {
    toolSpec: {
      name: 'get_reminders',
      description: 'Retrieves all reminders for the current user. Use this when the user asks to see their reminders.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {}
        }
      }
    }
  }
];

module.exports = tools;
