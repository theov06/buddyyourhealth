# 🏥 Buddy Your Health

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)

**AI-powered health management platform with intelligent insights, smart reminders, and conversational health assistance.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## � Desceription

Buddy Your Health is a comprehensive health management application that combines modern web technologies with artificial intelligence to help users track, manage, and improve their health. The platform features an AI health assistant powered by Amazon Bedrock Nova, smart reminder systems, health data analytics, and personalized wellness insights.

### Key Capabilities
- 💬 Conversational AI health assistant
- 📊 Health data visualization and analytics
- ⏰ Intelligent reminder system with calendar integration
- 🎯 Personalized health insights based on user data
- 🔐 Secure authentication with Google OAuth support
- 🎨 Beautiful UI with dark/light themes

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits](#-credits)
- [Roadmap](#️-roadmap)
- [Known Issues](#-known-issues)

---

## ✨ Features

### 🤖 Neural Guardian (AI Assistant)
- Natural language health conversations
- Personalized wellness guidance
- Health question answering
- Goal recommendations
- Powered by Amazon Bedrock Nova Lite

### 📊 Neural Health Dashboard
- Import health data (CSV, JSON, Apple Health XML)
- Visual analytics with interactive charts
- Health metrics tracking (blood pressure, heart rate, glucose, etc.)
- Trend analysis and insights
- Sample data for testing

### ⏰ Neural Reminders
- AI-generated smart reminders
- Manual reminder creation
- Multiple categories (medication, exercise, nutrition, wellness)
- Priority levels and frequency settings
- Calendar export (.ics format)
- Daily habit tracker
- Personalized insights based on health data

### 🔐 Authentication & Security
- Email/password authentication
- Google OAuth 2.0 integration
- JWT token-based sessions
- Secure password hashing
- Protected routes

### 🎨 User Interface
- Modern, responsive design
- Dark/Light theme toggle
- 3D interactive robot mascot
- Smooth animations and transitions
- Mobile-optimized

---

## 🛠 Installation

### Prerequisites

- **Node.js** v14.0.0 or higher
- **MongoDB** (local or Atlas)
- **AWS Account** with Bedrock access
- **Google Cloud Console** (optional, for OAuth)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd buddy-your-health
```

2. **Install dependencies**
```bash
# Root dependencies
npm install

# Backend dependencies
cd System/backend
npm install

# Frontend dependencies
cd ../../frontend
npm install
```

3. **Configure environment variables**

Create `System/backend/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/buddy-your-health
JWT_SECRET=your-secret-key-minimum-32-characters
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id (optional)
```

4. **Start MongoDB**
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Or use MongoDB Atlas cloud service
```

5. **Run the application**
```bash
# Terminal 1: Backend
cd System/backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## 💻 Usage

### Getting Started

1. **Create an account** or login at http://localhost:3000
2. **Explore features**:
   - Click the robot to activate features
   - Access Neural Guardian for AI health chat
   - Visit Neural Health to upload health data
   - Set up Neural Reminders for health tasks

### Using Neural Guardian (AI Chat)

```
Example conversations:
- "How can I improve my sleep quality?"
- "What are good exercises for beginners?"
- "Help me create a healthy meal plan"
- "What should I know about managing stress?"
```

### Creating Smart Reminders

1. Navigate to Neural Reminders
2. Click "NEW REMINDER" or use AI generation
3. Fill in details (title, time, frequency, category)
4. Optionally export to calendar
5. Track completion in Daily Tracker

### Uploading Health Data

1. Go to Neural Health page
2. Click "IMPORT DATA"
3. Upload CSV, JSON, or Apple Health export
4. View analytics and AI-generated insights
5. Use sample data for testing

---

## 📁 Project Structure

```
buddy-your-health/
├── frontend/                  # React TypeScript app
│   ├── src/
│   │   ├── Guardian/          # AI chat interface
│   │   ├── Reminders/         # Smart reminders
│   │   ├── NeuralHealth/      # Health dashboard
│   │   ├── Home/              # Landing page
│   │   ├── contexts/          # Auth & Theme contexts
│   │   ├── services/          # API services
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── System/backend/            # Express API server
│   ├── routes/                # API endpoints
│   ├── models/                # MongoDB schemas
│   ├── middleware/            # Auth & validation
│   ├── services/              # Business logic
│   └── package.json
│
├── NovaAPI/                   # AWS Bedrock integration
│   ├── api.ts                 # Bedrock client
│   └── aiTools.js             # AI utilities
│
└── Authentication/            # Auth services
    ├── auth.js                # JWT middleware
    └── oauth.js               # Google OAuth
```

---

## 📚 API Documentation

### Authentication

**Register**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### AI Features

**Chat with Neural Guardian**
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How can I improve my sleep?",
  "conversationHistory": []
}
```

**Generate Health Insights**
```http
POST /api/ai/health-insights
Authorization: Bearer <token>
Content-Type: application/json

{
  "healthData": {
    "age": 30,
    "activityLevel": "moderate"
  }
}
```

### Reminders

**Get Reminders**
```http
GET /api/reminders
Authorization: Bearer <token>
```

**Create Reminder**
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Take Vitamin D",
  "time": "09:00",
  "frequency": "daily",
  "category": "medication",
  "priority": "high"
}
```

**Delete Reminder**
```http
DELETE /api/reminders/:id
Authorization: Bearer <token>
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Reporting Bugs

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Suggesting Features

Open an issue with:
- Feature description
- Use case and benefits
- Potential implementation approach

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

### Technologies
- **Amazon Bedrock Nova** - AI capabilities
- **React** - Frontend framework
- **Three.js** - 3D graphics
- **MongoDB** - Database
- **Express** - Backend framework

### Contributors
- Development Team

---

## 🗺️ Roadmap

### Current Version (1.0.0)
- ✅ AI health assistant
- ✅ Smart reminders system
- ✅ Health data analytics
- ✅ User authentication
- ✅ Dark/Light themes

### Upcoming Features
- 🔄 Mobile app (React Native)
- 🔄 Wearable device integration
- 🔄 Social features and health challenges
- 🔄 Advanced AI models
- 🔄 Multi-language support
- 🔄 Telemedicine integration

---

## ⚠️ Known Issues

- Health data upload limited to specific formats (CSV, JSON, Apple Health XML)
- AI features require AWS Bedrock access and configuration
- Google OAuth requires additional setup
- Calendar export tested on major calendar apps only

### Workarounds
- Use sample data feature for testing without uploads
- Mock AI responses available when AWS not configured
- Email/password auth works without OAuth setup

---

## 📞 Support

For questions or issues:
- Open a GitHub issue
- Check existing issues for solutions
- Review API documentation above

---

<div align="center">

**Built with ❤️ for better health management**

</div>
```

2. **Install dependencies**
```bash
# Root dependencies
npm install

# Backend dependencies
cd System/backend
npm install

# Frontend dependencies
cd ../../frontend
npm install
```

3. **Configure environment variables**

Create `System/backend/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/buddy-your-health
JWT_SECRET=your-secret-key-minimum-32-characters
JWT_EXPIRE=7d
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id (optional)
```

4. **Start MongoDB**
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Or use MongoDB Atlas cloud database
```

5. **Run the application**

Terminal 1 - Backend:
```bash
cd System/backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## 🎯 Usage

### Getting Started

1. **Create an account** or sign in with Google
2. **Explore features**:
   - Chat with Neural Guardian for health advice
   - Upload health data in Neural Health
   - Set up smart reminders
   - Track your health progress

### Using Neural Guardian (AI Chat)

```
Example queries:
- "What can you help me with?"
- "How can I improve my sleep quality?"
- "Give me tips for staying hydrated"
- "Create a workout plan for beginners"
```

### Creating Smart Reminders

1. Navigate to Neural Reminders
2. Click "Generate Insights Based on Your Health Data" or "Generate General Health Insights"
3. Apply AI suggestions or create custom reminders
4. Export to your calendar if needed

### Uploading Health Data

1. Go to Neural Health page
2. Click "Import Data"
3. Upload CSV/JSON file or use sample data
4. View analytics and AI-generated insights

---

## 📁 Project Structure

```
buddy-your-health/
├── frontend/                  # React TypeScript app
│   ├── src/
│   │   ├── Guardian/          # AI chat interface
│   │   ├── Reminders/         # Smart reminders
│   │   ├── NeuralHealth/      # Health dashboard
│   │   ├── contexts/          # Auth & Theme contexts
│   │   ├── services/          # API services
│   │   └── App.tsx
│   └── package.json
│
├── System/backend/            # Express API server
│   ├── routes/                # API endpoints
│   ├── models/                # MongoDB schemas
│   ├── middleware/            # Auth & validation
│   ├── services/              # Business logic
│   └── server.js
│
├── NovaAPI/                   # AWS Bedrock integration
│   ├── api.ts
│   └── aiTools.js
│
└── Authentication/            # Auth utilities
    ├── auth.js
    └── oauth.js
```

---

## 📚 API Documentation

### Authentication

**Register**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### AI Features

**Chat with Neural Guardian**
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How can I improve my sleep?",
  "conversationHistory": []
}
```

**Generate Health Insights**
```http
POST /api/ai/health-insights
Authorization: Bearer <token>
Content-Type: application/json

{
  "healthData": {
    "age": 30,
    "activityLevel": "moderate"
  }
}
```

### Reminders

**Get Reminders**
```http
GET /api/reminders
Authorization: Bearer <token>
```

**Create Reminder**
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Take Vitamin D",
  "time": "09:00",
  "frequency": "daily",
  "category": "medication",
  "priority": "high"
}
```

**Delete Reminder**
```http
DELETE /api/reminders/:id
Authorization: Bearer <token>
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Reporting Bugs

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Suggesting Features

Open an issue with:
- Feature description
- Use case and benefits
- Potential implementation approach

---

## 📄 License

This project is for educational purposes only.

---

## 🙏 Credits

### Technologies
- [Amazon Bedrock Nova](https://aws.amazon.com/bedrock/) - AI model
- [React](https://react.dev/) - Frontend framework
- [Three.js](https://threejs.org/) - 3D graphics
- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Backend framework

### Contributors
- Development Team - Initial work and ongoing maintenance

---

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Contact through the app's Contact page

---

<div align="center">

**Built with ❤️ for better health management**

</div>
