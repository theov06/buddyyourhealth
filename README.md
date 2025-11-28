# Buddy Your Health - Neural Guardian

A full-stack health management application with AI-powered insights and smart reminders using Amazon Bedrock Nova.

## 🚀 Project Overview

This application consists of:
- **Frontend**: React TypeScript application with modern UI
- **Backend**: Node.js/Express API with MongoDB
- **AI Integration**: Amazon Bedrock (Nova Lite) for health insights and chat

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- AWS Account with Bedrock access (for AI features)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
Create or update `backend/.env`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/buddy-your-health
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# AWS Configuration for Amazon Nova
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
Create or update `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Start MongoDB

```bash
# If using local MongoDB (macOS)
brew services start mongodb-community

# Or if using MongoDB Atlas, update MONGODB_URI in backend/.env
```

### 4. Run the Application

#### Start Backend Server
```bash
cd backend
npm start
# Or for development with auto-restart:
npm run dev
```

Backend will run on `http://localhost:3001`

#### Start Frontend
```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)

### User Management
- `GET /api/users/profile` - Get user profile (requires auth token)
- `PUT /api/users/profile` - Update user profile (requires auth token)

### AI Features
- `POST /api/ai/chat` - Chat with Neural Guardian AI (requires auth token)
- `POST /api/ai/health-insights` - Generate AI health insights (requires auth token)
- `POST /api/ai/smart-reminders` - Generate smart reminders (requires auth token)

### Reminders
- `GET /api/reminders` - Get user reminders (requires auth token)
- `POST /api/reminders` - Create reminder (requires auth token)
- `PUT /api/reminders/:id` - Update reminder (requires auth token)
- `DELETE /api/reminders/:id` - Delete reminder (requires auth token)

## 🧪 Testing the API

### Register a new user
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Chat with AI (requires token)
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "How can I improve my sleep?",
    "context": "Health conversation"
  }'
```

## 🗄️ Database Schema

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isVerified: Boolean (default: false),
  createdAt: Date,
  lastLogin: Date,
  healthProfile: {
    age: Number,
    height: Number,
    weight: Number,
    activityLevel: String,
    goals: [String]
  },
  reminders: [{
    id: String,
    title: String,
    description: String,
    time: String,
    frequency: String,
    category: String,
    isActive: Boolean,
    aiGenerated: Boolean,
    priority: String,
    createdAt: Date
  }]
}
```

## 🎨 Frontend Features

- **Authentication**: Login/Signup with JWT
- **Dashboard**: Health overview and statistics
- **GenAI Chat**: Conversational AI health assistant
- **Smart Reminders**: AI-generated and manual health reminders
- **Health Insights**: Personalized AI recommendations
- **Theme Toggle**: Dark/Light mode support
- **Calendar Export**: Export reminders to calendar

## 🤖 AI Features

The application uses **Amazon Bedrock Nova Lite** for:
- Natural language health conversations
- Personalized health insights generation
- Smart reminder creation based on user context
- Health goal recommendations

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart

### Frontend
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (one-way operation)

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- AWS credentials must have Bedrock access and Nova model permissions
- The frontend expects the backend to run on port 3001
- JWT tokens are stored in localStorage for authentication

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- CORS enabled for frontend-backend communication

## 📄 License

This project is for educational purposes.
