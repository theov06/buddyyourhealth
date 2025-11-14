# B.A.G.AI Setup Guide

## Overview
Your GenAI chat interface is now connected to AWS Bedrock's Amazon Nova AI model. This guide explains how to make it work.

## Prerequisites

### 1. AWS Account Setup
You need an AWS account with access to Amazon Bedrock.

### 2. AWS Credentials
You need to configure your AWS credentials in the backend `.env` file:

```env
# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### 3. Amazon Bedrock Model Access
1. Go to AWS Console → Amazon Bedrock
2. Navigate to "Model access" in the left sidebar
3. Request access to **Amazon Nova Micro** or **Amazon Nova Lite**
4. Wait for approval (usually instant for Nova models)

## How It Works

### Backend (Already Configured)
- **Service**: `backend/services/aiService.js`
  - Uses AWS Bedrock Runtime Client
  - Model: `amazon.nova-micro-v1:0`
  - Handles AI requests and responses

- **API Route**: `backend/routes/ai.js`
  - Endpoint: `POST /api/ai/chat`
  - Requires authentication
  - Sends user message + conversation history
  - Returns AI response

### Frontend (Already Configured)
- **Component**: `frontend/src/genai/GenAI.tsx`
  - Sends messages to `/api/ai/chat`
  - Includes last 10 messages for context
  - Displays AI responses in real-time
  - Updates chat history automatically

## Features

### 1. Contextual Conversations
- AI remembers the last 10 messages
- Provides personalized responses based on user profile
- Maintains conversation flow

### 2. Health-Focused AI
The AI is configured to:
- Provide evidence-based health advice
- Offer personalized wellness recommendations
- Encourage healthy lifestyle choices
- Remind users to consult healthcare professionals for serious concerns

### 3. User Profile Integration
The AI has access to:
- User's name
- Health goals
- Medical conditions
- Previous conversation context

## Testing

### 1. Start the Backend
```bash
cd backend
npm run dev
```

### 2. Start the Frontend
```bash
cd frontend
npm start
```

### 3. Test the Chat
1. Sign in to your account
2. Click "ACTIVATE" button
3. Click "Generative AI" button
4. Wait for loading screen
5. Start chatting!

### Example Questions to Try:
- "How are you feeling today?" (initial greeting)
- "What are some good exercises for beginners?"
- "How can I improve my sleep quality?"
- "What should I eat for better energy?"
- "Can you help me create a workout plan?"

## Troubleshooting

### Error: "Failed to get AI response"
**Causes:**
1. AWS credentials not configured
2. No access to Amazon Bedrock models
3. Backend server not running
4. User not authenticated

**Solutions:**
1. Check `.env` file has correct AWS credentials
2. Verify model access in AWS Bedrock console
3. Ensure backend is running on port 3001
4. Make sure you're logged in

### Error: "I'm having trouble connecting"
**Causes:**
1. Network issues
2. Backend API endpoint incorrect
3. CORS issues

**Solutions:**
1. Check backend is running
2. Verify API URL in GenAI.tsx (should be `http://localhost:3001/api/ai/chat`)
3. Check CORS is enabled in backend

### AI Responses Are Generic
**Solution:**
- Make sure user profile is complete (health goals, conditions)
- The AI uses this information for personalization

## Cost Considerations

### Amazon Nova Pricing (as of 2024)
- **Nova Micro**: ~$0.000035 per 1K input tokens, ~$0.00014 per 1K output tokens
- **Nova Lite**: ~$0.00006 per 1K input tokens, ~$0.00024 per 1K output tokens

### Estimated Costs
- Average conversation (10 messages): ~$0.001 - $0.005
- 1000 conversations per month: ~$1 - $5

**Note**: These are estimates. Check AWS pricing for current rates.

## Customization

### Change AI Model
Edit `backend/services/aiService.js`:
```javascript
this.modelId = 'amazon.nova-lite-v1:0'; // For more advanced features
```

### Adjust Response Length
Edit `backend/routes/ai.js`:
```javascript
max_tokens: 800, // Increase for longer responses
```

### Modify AI Personality
Edit the system prompt in `backend/routes/ai.js`:
```javascript
const systemPrompt = `You are B.A.G.AI...
// Customize the personality and guidelines here
`;
```

## Security Notes

1. **Never commit AWS credentials** to git
2. **Always use environment variables** for sensitive data
3. **Validate user input** before sending to AI
4. **Rate limit API calls** to prevent abuse
5. **Monitor AWS costs** regularly

## Alternative AI Services

If you don't want to use AWS Bedrock, you can integrate:

### OpenAI (ChatGPT)
```javascript
// Install: npm install openai
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: message }]
});
```

### Anthropic (Claude)
```javascript
// Install: npm install @anthropic-ai/sdk
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
  messages: [{ role: "user", content: message }]
});
```

### Google Gemini
```javascript
// Install: npm install @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent(message);
```

## Support

For issues or questions:
1. Check AWS Bedrock documentation
2. Review backend logs for errors
3. Test API endpoint with Postman/curl
4. Verify authentication token is valid

## Next Steps

1. **Add conversation persistence**: Store chat history in MongoDB
2. **Implement voice input**: Add speech-to-text
3. **Add file uploads**: Allow users to share health documents
4. **Create AI health reports**: Generate weekly summaries
5. **Add multi-language support**: Translate conversations

---

**Your GenAI is now ready to use!** Just make sure your AWS credentials are configured and you have access to Amazon Bedrock models.
