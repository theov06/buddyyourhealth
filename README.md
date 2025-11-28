# 🏥 Buddy Your Health - Neural Guardian

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Educational-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-4.9.5-blue.svg)

**A full-stack AI-powered health management platform with intelligent insights, smart reminders, and conversational health assistance using Amazon Bedrock Nova.**

[Features](#-features) • [Installation](#️-installation--setup) • [API Documentation](#-api-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#️-installation--setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#️-database-schema)
- [Architecture](#-architecture)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Security](#-security)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [Roadmap](#️-roadmap)
- [License](#-license)
- [Support](#-support)

---

## 🚀 Overview

Buddy Your Health - Neural Guardian is a modern, full-stack health management application that leverages AI to provide personalized health insights, intelligent reminders, and conversational health assistance. Built with React, Node.js, and Amazon Bedrock Nova, it offers a seamless experience for users to track, manage, and improve their health.


### Key Highlights

- 🤖 **AI-Powered Insights**: Leverages Amazon Bedrock Nova Lite for intelligent health recommendations
- 💬 **Conversational AI**: Natural language health assistant for personalized guidance
- 📊 **Health Dashboard**: Visual analytics with interactive charts using Recharts
- ⏰ **Smart Reminders**: AI-generated and manual health reminders with calendar export
- 🎨 **Modern UI/UX**: Beautiful interface with dark/light theme support and 3D animations
- 🔐 **Secure Authentication**: JWT-based auth with Google OAuth integration
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 📈 **Health Data Upload**: Import and analyze health data from various sources

---

## ✨ Features

### 🏠 Core Features

#### Authentication & User Management
- Email/password registration and login
- Google OAuth 2.0 integration
- JWT token-based authentication
- Secure password hashing with bcrypt
- User profile management
- Account settings and preferences

#### AI-Powered Health Assistant
- **Neural Guardian Chat**: Conversational AI for health queries
- **Health Insights**: Personalized recommendations based on user data
- **Smart Reminder Generation**: AI creates contextual health reminders
- **Goal Recommendations**: Intelligent health goal suggestions

#### Health Dashboard
- Visual health metrics with interactive charts
- Health data upload and parsing (CSV, JSON)
- Activity tracking and trends
- BMI calculator and health indicators
- Progress visualization with Recharts

#### Smart Reminders System
- Create, edit, and delete reminders
- AI-generated reminder suggestions
- Multiple reminder categories (medication, exercise, nutrition, etc.)
- Frequency settings (daily, weekly, monthly)
- Priority levels (low, medium, high)
- Calendar export (.ics format)
- Daily tracker modal for habit monitoring
- Reminder analytics and insights

#### User Interface
- Modern, responsive design
- Dark/Light theme toggle
- 3D interactive robot mascot
- Particle effects and animations
- Loading screens with custom animations
- Smooth page transitions
- Mobile-optimized navigation

### 🎨 Visual Features
- Interactive 3D robot using Three.js and React Three Fiber
- Particle background effects with tsparticles
- Custom loading animations for each section
- Responsive navbar with theme switcher
- Beautiful gradient designs and glassmorphism effects

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2.0 with TypeScript
- **Routing**: React Router DOM 7.9.5
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Charts**: Recharts 2.15.4
- **Particles**: tsparticles 3.9.1
- **File Generation**: jsPDF 3.0.4, JSZip 3.10.1
- **Testing**: Jest, React Testing Library
- **Styling**: CSS3 with custom themes

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.19.2
- **Authentication**: JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.3
- **AI Integration**: AWS SDK for Bedrock Runtime 3.926.0
- **OAuth**: Google Auth Library 10.5.0
- **Security**: CORS, environment variables

### AI & Cloud Services
- **Amazon Bedrock**: Nova Lite model for AI features
- **AWS SDK**: Bedrock Runtime client
- **Google OAuth**: Authentication integration

### Development Tools
- **TypeScript**: Type safety and better DX
- **Nodemon**: Auto-restart for backend development
- **ESLint**: Code quality and consistency
- **Git**: Version control

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v6.0.0 or higher (comes with Node.js)
- **MongoDB**: Local installation or MongoDB Atlas account
  - Local: [Installation Guide](https://docs.mongodb.com/manual/installation/)
  - Atlas: [Get Started](https://www.mongodb.com/cloud/atlas)
- **AWS Account**: With Amazon Bedrock access
  - Enable Nova Lite model in your region
  - Create IAM user with Bedrock permissions
- **Google Cloud Console** (Optional): For OAuth integration
  - Create OAuth 2.0 credentials
  - Configure authorized redirect URIs

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd buddy-your-health
```

### 2. Install Dependencies

```bash
# Install root dependencies (3D libraries)
npm install

# Install backend dependencies
cd System/backend
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

### 3. Configure Environment Variables

#### Backend Environment (.env)

Create `System/backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/buddy-your-health
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/buddy-your-health

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d

# AWS Configuration for Amazon Bedrock Nova
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Frontend Environment (.env)

Create `frontend/.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Google OAuth Configuration (Optional)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Feature Flags (Optional)
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=false
```

### 4. Set Up MongoDB

#### Option A: Local MongoDB (macOS)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh
```

#### Option B: Local MongoDB (Windows)
```bash
# Download and install from https://www.mongodb.com/try/download/community
# Start MongoDB service
net start MongoDB
```

#### Option C: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

### 5. Configure AWS Bedrock

1. **Create IAM User**:
   ```bash
   # In AWS Console:
   # IAM → Users → Add User → Programmatic access
   ```

2. **Attach Bedrock Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": "arn:aws:bedrock:*::foundation-model/amazon.nova-lite-v1:0"
       }
     ]
   }
   ```

3. **Enable Nova Model**:
   - Go to AWS Bedrock Console
   - Navigate to Model Access
   - Request access to Amazon Nova Lite

4. **Add Credentials** to backend `.env`

### 6. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
5. Copy Client ID and Secret to `.env` files

### 7. Start the Application

#### Terminal 1: Start Backend
```bash
cd System/backend
npm run dev
```
Backend runs on `http://localhost:3001`

#### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

### 8. Verify Installation

1. Open browser to `http://localhost:3000`
2. Create a new account or login
3. Test AI chat functionality
4. Create a reminder
5. Check health dashboard

---

## 📁 Project Structure

```
buddy-your-health/
├── frontend/                      # React TypeScript frontend
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── about/                 # About page component
│   │   ├── contact/               # Contact page and thank you
│   │   ├── contexts/              # React contexts (Auth, Theme)
│   │   ├── Guardian/              # AI chat interface (GenAI)
│   │   ├── health-dashboard/      # Health metrics and charts
│   │   ├── Home/                  # Landing page with 3D robot
│   │   ├── Loading/               # Custom loading screens
│   │   ├── Login-Signup/          # Authentication pages
│   │   ├── manage account/        # User profile management
│   │   ├── navbar/                # Navigation component
│   │   ├── NeuralHealth/          # Health insights page
│   │   ├── Reminders/             # Smart reminders system
│   │   ├── services/              # API service layer
│   │   ├── styles/                # Global styles and themes
│   │   ├── utils/                 # Utility functions
│   │   ├── App.tsx                # Main app component
│   │   └── index.tsx              # App entry point
│   ├── .env                       # Frontend environment variables
│   ├── package.json               # Frontend dependencies
│   └── tsconfig.json              # TypeScript configuration
│
├── System/backend/                # Node.js Express backend
│   ├── config/                    # Configuration files
│   ├── middleware/                # Express middleware
│   ├── models/                    # MongoDB models
│   ├── routes/                    # API routes
│   ├── services/                  # Business logic
│   ├── .env                       # Backend environment variables
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Server entry point
│
├── Authentication/                # Auth utilities and services
│   ├── User.js                    # User model
│   ├── auth.js                    # Auth middleware
│   ├── oauth.js                   # OAuth handlers
│   └── users.js                   # User routes
│
├── NovaAPI/                       # Amazon Bedrock integration
│   ├── aiTools.js                 # AI utility functions
│   ├── api.ts                     # API client
│   └── toolExecutor.js            # Tool execution logic
│
├── node_modules/                  # Root dependencies
├── package.json                   # Root package file
└── README.md                      # This file
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Register New User
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

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "healthProfile": {
      "age": 30,
      "height": 175,
      "weight": 70,
      "activityLevel": "moderate",
      "goals": ["weight_loss", "better_sleep"]
    }
  }
}
```

### User Management

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "healthProfile": {
    "age": 30,
    "height": 175,
    "weight": 70,
    "activityLevel": "moderate",
    "goals": ["weight_loss", "better_sleep"]
  }
}
```

### AI Features

#### Chat with Neural Guardian
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How can I improve my sleep quality?",
  "context": "Health conversation",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "response": "To improve your sleep quality, I recommend...",
  "conversationId": "conv_123456"
}
```

#### Generate Health Insights
```http
POST /api/ai/health-insights
Authorization: Bearer <token>
Content-Type: application/json

{
  "healthData": {
    "age": 30,
    "weight": 70,
    "height": 175,
    "activityLevel": "moderate",
    "goals": ["weight_loss"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "category": "nutrition",
      "title": "Optimize Your Diet",
      "description": "Based on your goals...",
      "priority": "high"
    }
  ]
}
```

#### Generate Smart Reminders
```http
POST /api/ai/smart-reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "userContext": {
    "goals": ["weight_loss", "better_sleep"],
    "activityLevel": "moderate"
  },
  "preferences": {
    "frequency": "daily",
    "categories": ["exercise", "nutrition", "sleep"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "reminders": [
    {
      "title": "Morning Hydration",
      "description": "Drink 500ml of water",
      "time": "08:00",
      "frequency": "daily",
      "category": "nutrition",
      "priority": "medium"
    }
  ]
}
```

### Reminders

#### Get All Reminders
```http
GET /api/reminders
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional): Filter by category
- `isActive` (optional): Filter by active status
- `frequency` (optional): Filter by frequency

#### Create Reminder
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Take Vitamin D",
  "description": "Take 1000 IU vitamin D supplement",
  "time": "09:00",
  "frequency": "daily",
  "category": "medication",
  "priority": "high",
  "isActive": true
}
```

#### Update Reminder
```http
PUT /api/reminders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isActive": false
}
```

#### Delete Reminder
```http
DELETE /api/reminders/:id
Authorization: Bearer <token>
```

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid input data",
  "details": ["Email is required", "Password must be at least 8 characters"]
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Access denied"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  // Basic Information
  _id: ObjectId,
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    // Hashed with bcrypt
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Health Profile
  healthProfile: {
    age: {
      type: Number,
      min: 0,
      max: 150
    },
    height: {
      type: Number,
      min: 0,
      // in centimeters
    },
    weight: {
      type: Number,
      min: 0,
      // in kilograms
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
    },
    goals: [{
      type: String,
      enum: [
        'weight_loss',
        'weight_gain',
        'muscle_gain',
        'better_sleep',
        'stress_reduction',
        'improved_fitness',
        'better_nutrition',
        'mental_health'
      ]
    }],
    medicalConditions: [String],
    allergies: [String]
  },
  
  // Reminders Array
  reminders: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    time: {
      type: String,
      required: true,
      // Format: "HH:MM"
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
      default: 'daily'
    },
    category: {
      type: String,
      enum: [
        'medication',
        'exercise',
        'nutrition',
        'sleep',
        'hydration',
        'mental_health',
        'appointment',
        'other'
      ],
      default: 'other'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    aiGenerated: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    completedDates: [Date],
    notes: String
  }],
  
  // OAuth Information
  googleId: String,
  oauthProvider: {
    type: String,
    enum: ['local', 'google']
  },
  
  // Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}
```

### Indexes

```javascript
// Unique index on email
db.users.createIndex({ email: 1 }, { unique: true })

// Index on googleId for OAuth
db.users.createIndex({ googleId: 1 }, { sparse: true })

// Compound index for active reminders
db.users.createIndex({ "reminders.isActive": 1, "reminders.time": 1 })
```

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │   Auth   │  │Dashboard │  │ Reminders│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │          │
│       └─────────────┴──────────────┴──────────────┘          │
│                          │                                    │
│                    ┌─────▼─────┐                            │
│                    │  API Layer │                            │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend (Express)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   User   │  │    AI    │  │ Reminders│   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │          │
│  ┌────▼─────────────▼──────────────▼──────────────▼─────┐  │
│  │              Middleware Layer                         │  │
│  │  (Auth, CORS, Error Handling, Validation)            │  │
│  └────┬──────────────────────────────────────────┬──────┘  │
│       │                                           │          │
│  ┌────▼─────┐                              ┌─────▼─────┐   │
│  │ MongoDB  │                              │   AWS     │   │
│  │ Database │                              │  Bedrock  │   │
│  └──────────┘                              │   Nova    │   │
│                                            └───────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Frontend Components

```
App
├── AuthContext (Global auth state)
├── ThemeContext (Theme management)
├── Navbar (Navigation)
├── Routes
│   ├── Home (Landing page with 3D robot)
│   ├── Login/Signup (Authentication)
│   ├── Dashboard (Health metrics)
│   ├── GenAI (AI chat interface)
│   ├── NeuralHealth (Health insights)
│   ├── SmartReminders (Reminder management)
│   ├── ManageAccount (Profile settings)
│   ├── About (About page)
│   └── Contact (Contact form)
└── Services
    ├── API Service (HTTP client)
    ├── AI Service (AI interactions)
    ├── OAuth Service (Google auth)
    └── Health API (Health data)
```

#### Backend Architecture

```
Server
├── Configuration
│   ├── Database connection
│   ├── AWS Bedrock client
│   └── Environment variables
├── Middleware
│   ├── Authentication (JWT verification)
│   ├── CORS configuration
│   ├── Error handling
│   └── Request validation
├── Routes
│   ├── Auth routes (/api/auth)
│   ├── User routes (/api/users)
│   ├── AI routes (/api/ai)
│   └── Reminder routes (/api/reminders)
├── Models
│   └── User model (Mongoose schema)
└── Services
    ├── AI service (Bedrock integration)
    ├── Auth service (JWT, OAuth)
    └── User service (Business logic)
```

### Data Flow

#### Authentication Flow
```
1. User submits credentials
2. Frontend sends POST to /api/auth/login
3. Backend validates credentials
4. Backend generates JWT token
5. Token sent to frontend
6. Frontend stores token in localStorage
7. Token included in subsequent requests
```

#### AI Chat Flow
```
1. User sends message in chat
2. Frontend sends POST to /api/ai/chat
3. Backend validates JWT token
4. Backend calls AWS Bedrock Nova API
5. Nova processes request and generates response
6. Backend returns AI response
7. Frontend displays response in chat
```

#### Reminder Creation Flow
```
1. User creates reminder (manual or AI-generated)
2. Frontend sends POST to /api/reminders
3. Backend validates and saves to MongoDB
4. Reminder added to user's reminders array
5. Frontend updates UI with new reminder
6. Optional: Export to calendar (.ics)
```

---

## 🔧 Environment Variables

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3001 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRE` | No | 7d | JWT expiration time |
| `AWS_REGION` | Yes | - | AWS region for Bedrock |
| `AWS_ACCESS_KEY_ID` | Yes | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | - | AWS secret key |
| `GOOGLE_CLIENT_ID` | No | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | - | Google OAuth client secret |
| `FRONTEND_URL` | No | http://localhost:3000 | Frontend URL for CORS |
| `ALLOWED_ORIGINS` | No | - | Comma-separated allowed origins |

### Frontend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | Yes | - | Backend API base URL |
| `REACT_APP_GOOGLE_CLIENT_ID` | No | - | Google OAuth client ID |
| `REACT_APP_ENABLE_ANALYTICS` | No | false | Enable analytics |
| `REACT_APP_ENABLE_DEBUG` | No | false | Enable debug mode |

---

## 🔧 Available Scripts

### Root Directory

```bash
# Install all dependencies (root, frontend, backend)
npm install

# Clean all node_modules
npm run clean
```

### Backend Scripts

```bash
cd System/backend

# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

### Frontend Scripts

```bash
cd frontend

# Start development server (http://localhost:3000)
npm start

# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build

# Analyze bundle size
npm run build -- --stats

# Eject from Create React App (irreversible)
npm run eject

# Type check
npx tsc --noEmit

# Lint code
npm run lint
```

---

## 🧪 Testing

### Running Tests

#### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in CI mode (no watch)
npm test -- --watchAll=false

# Run specific test file
npm test -- HealthDashboard.test.tsx

# Update snapshots
npm test -- -u
```

#### Backend Tests
```bash
cd System/backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- auth.test.js
```

### Test Structure

```
frontend/src/
├── App.test.tsx
├── setupTests.ts
└── [component]/
    └── [Component].test.tsx

System/backend/
├── tests/
│   ├── auth.test.js
│   ├── user.test.js
│   ├── ai.test.js
│   └── reminders.test.js
└── jest.config.js
```

### Testing Best Practices

- Write unit tests for all components and services
- Test user interactions and edge cases
- Mock external API calls (AWS Bedrock, MongoDB)
- Maintain >80% code coverage
- Use React Testing Library for component tests
- Use Jest for backend unit tests

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Google OAuth flow
- [ ] Profile update
- [ ] AI chat functionality
- [ ] Health insights generation
- [ ] Reminder creation, update, delete
- [ ] Calendar export
- [ ] Theme switching
- [ ] Responsive design on mobile
- [ ] Error handling and validation

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

**Environment Variables** (Vercel Dashboard):
- `REACT_APP_API_URL`: Your backend API URL
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
npm run build
netlify deploy

# Production deployment
netlify deploy --prod
```

### Backend Deployment (AWS/Heroku/Railway)

#### AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd System/backend
eb init

# Create environment
eb create production

# Deploy
eb deploy

# Set environment variables
eb setenv MONGODB_URI=your-mongodb-uri JWT_SECRET=your-secret
```

#### Heroku
```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
cd System/backend
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
heroku config:set AWS_ACCESS_KEY_ID=your-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
cd System/backend
railway init

# Deploy
railway up

# Set environment variables in Railway dashboard
```

### Database Deployment (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create cluster
3. Configure network access (whitelist IPs)
4. Create database user
5. Get connection string
6. Update `MONGODB_URI` in production environment

### Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Use MongoDB Atlas or managed database
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Set up environment variables
- [ ] Configure AWS IAM with minimal permissions
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all features in production
- [ ] Set up CI/CD pipeline

### Docker Deployment (Optional)

#### Dockerfile (Backend)
```dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

#### Dockerfile (Frontend)
```dockerfile
FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./System/backend
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:3001/api

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB (macOS)
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB

# Check MongoDB Atlas connection string
# Ensure IP is whitelisted in Atlas
```

#### AWS Bedrock Access Denied
```
Error: AccessDeniedException: User is not authorized to perform: bedrock:InvokeModel
```

**Solution:**
1. Check IAM user has Bedrock permissions
2. Verify model access is enabled in Bedrock console
3. Confirm AWS credentials are correct
4. Check AWS region supports Nova model

#### JWT Token Invalid
```
Error: JsonWebTokenError: invalid token
```

**Solution:**
1. Clear localStorage in browser
2. Login again to get new token
3. Check `JWT_SECRET` matches between requests
4. Verify token hasn't expired

#### CORS Error
```
Access to fetch at 'http://localhost:3001/api' has been blocked by CORS policy
```

**Solution:**
```javascript
// Backend: Update CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm start
```

#### Google OAuth Not Working
```
Error: redirect_uri_mismatch
```

**Solution:**
1. Check Google Console authorized redirect URIs
2. Add `http://localhost:3000/auth/google/callback`
3. Verify `GOOGLE_CLIENT_ID` matches in both .env files

#### Build Fails
```
Error: Cannot find module 'react'
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React cache
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install
```

### Debug Mode

Enable debug logging:

**Backend:**
```javascript
// Add to server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}
```

**Frontend:**
```javascript
// Add to .env
REACT_APP_ENABLE_DEBUG=true

// Use in code
if (process.env.REACT_APP_ENABLE_DEBUG === 'true') {
  console.log('Debug info:', data);
}
```

### Getting Help

1. Check [Issues](https://github.com/your-repo/issues) for similar problems
2. Review error logs in browser console and terminal
3. Verify all environment variables are set correctly
4. Test API endpoints with Postman or curl
5. Check MongoDB connection and data
6. Verify AWS credentials and permissions

---

## 🔐 Security

### Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configured allowed origins
- **Environment Variables**: Sensitive data not in code
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: React's built-in escaping
- **HTTPS**: Recommended for production
- **Rate Limiting**: Prevent brute force attacks

### Security Best Practices

#### Password Requirements
```javascript
// Minimum requirements
- At least 8 characters
- Contains uppercase and lowercase
- Contains numbers
- Contains special characters
```

#### JWT Token Security
```javascript
// Token configuration
{
  expiresIn: '7d',
  algorithm: 'HS256',
  issuer: 'buddy-your-health'
}

// Store securely
localStorage.setItem('token', token); // Client-side
// Consider httpOnly cookies for production
```

#### API Security
```javascript
// Rate limiting (recommended)
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### Environment Security
```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use strong secrets
JWT_SECRET=$(openssl rand -base64 32)

# Rotate credentials regularly
# Use AWS IAM roles in production
```

### Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens expire appropriately
- [ ] CORS configured for production domain
- [ ] Environment variables secured
- [ ] HTTPS enabled in production
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] AWS IAM least privilege principle
- [ ] MongoDB authentication enabled
- [ ] Sensitive data encrypted at rest

---

## ⚡ Performance

### Performance Optimizations

#### Frontend Optimizations
- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: React.memo() for expensive components
- **Virtual Scrolling**: For large reminder lists
- **Image Optimization**: Compressed assets and lazy loading
- **Bundle Size**: Tree shaking and minification
- **Caching**: Service workers for offline support

#### Backend Optimizations
- **Database Indexing**: Indexes on frequently queried fields
- **Connection Pooling**: MongoDB connection reuse
- **Caching**: Redis for session and API response caching
- **Compression**: gzip compression for responses
- **Query Optimization**: Efficient MongoDB queries

### Performance Metrics

#### Target Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **API Response Time**: < 200ms (average)

#### Monitoring
```bash
# Frontend performance
npm run build -- --stats
npx lighthouse http://localhost:3000

# Backend performance
# Use tools like New Relic, DataDog, or custom logging
```

### Optimization Tips

1. **Lazy Load Components**
```typescript
const Dashboard = lazy(() => import('./health-dashboard/HealthDashboard'));
const GenAI = lazy(() => import('./Guardian/GenAI'));
```

2. **Optimize Images**
```bash
# Use WebP format
# Compress images before upload
# Implement lazy loading
```

3. **Database Queries**
```javascript
// Use projection to limit fields
User.findById(id).select('firstName lastName email');

// Use lean() for read-only queries
User.find().lean();

// Create indexes
userSchema.index({ email: 1 });
```

4. **API Caching**
```javascript
// Cache AI responses
const cache = new Map();
if (cache.has(query)) {
  return cache.get(query);
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/buddy-your-health.git
   cd buddy-your-health
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Test your changes**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request**

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add Google OAuth integration
fix(reminders): resolve calendar export bug
docs(readme): update installation instructions
test(ai): add unit tests for chat service
```

### Code Style

#### TypeScript/JavaScript
- Use TypeScript for new frontend code
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

#### CSS
- Use BEM naming convention
- Keep styles modular and component-scoped
- Use CSS variables for theming
- Mobile-first responsive design

#### React
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript interfaces for props
- Keep components small and reusable

### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Screenshots**: For UI changes
- **Tests**: Include relevant tests
- **Documentation**: Update if needed
- **Breaking Changes**: Clearly marked

### Code Review Process

1. Automated checks must pass (tests, linting)
2. At least one approval required
3. Address review comments
4. Squash commits before merge

### Development Workflow

```bash
# 1. Update your fork
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and test
npm test

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Push to fork
git push origin feature/new-feature

# 6. Create PR on GitHub
```

### Areas for Contribution

- 🐛 **Bug Fixes**: Check [Issues](https://github.com/your-repo/issues)
- ✨ **New Features**: Propose in discussions first
- 📝 **Documentation**: Improve README, add guides
- 🧪 **Tests**: Increase test coverage
- 🎨 **UI/UX**: Design improvements
- ♿ **Accessibility**: A11y enhancements
- 🌍 **Internationalization**: Add language support
- ⚡ **Performance**: Optimization improvements

---

## 🗺️ Roadmap

### Version 1.1 (Q1 2024)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Advanced health analytics
- [ ] Integration with fitness trackers
- [ ] Medication tracking with barcode scanner
- [ ] Social features (share progress)

### Version 1.2 (Q2 2024)
- [ ] Multi-language support (i18n)
- [ ] Voice commands for reminders
- [ ] Apple Health / Google Fit integration
- [ ] Telemedicine integration
- [ ] Family account management
- [ ] Advanced AI insights with charts
- [ ] Gamification and achievements

### Version 2.0 (Q3 2024)
- [ ] Wearable device integration
- [ ] Real-time health monitoring
- [ ] AI-powered meal planning
- [ ] Exercise video library
- [ ] Community forums
- [ ] Healthcare provider portal
- [ ] Insurance integration
- [ ] Advanced data export (PDF reports)

### Future Considerations
- Machine learning for predictive health insights
- Blockchain for health record security
- AR/VR for exercise guidance
- Integration with smart home devices
- Clinical trial matching
- Mental health chatbot
- Sleep tracking and analysis

---

## 📄 License

This project is licensed for **educational purposes only**.

### Terms
- ✅ Use for learning and personal projects
- ✅ Modify and experiment with the code
- ✅ Share with attribution
- ❌ Commercial use without permission
- ❌ Redistribute as your own work
- ❌ Use in production without proper security audit

### Attribution
If you use this project as a reference or base for your work, please provide attribution:

```
Based on Buddy Your Health - Neural Guardian
https://github.com/your-repo/buddy-your-health
```

### Disclaimer
This application is for educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

## 💬 Support

### Getting Help

- 📖 **Documentation**: Read this README thoroughly
- 🐛 **Bug Reports**: [Open an issue](https://github.com/your-repo/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Open an issue](https://github.com/your-repo/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 **Email**: support@buddyyourhealth.com

### FAQ

**Q: Do I need AWS Bedrock for the app to work?**
A: Yes, the AI features require AWS Bedrock with Nova model access. You can disable AI features if needed.

**Q: Can I use a different AI provider?**
A: Yes, you can modify the AI service to use OpenAI, Anthropic, or other providers.

**Q: Is my health data secure?**
A: Yes, data is encrypted and stored securely. However, this is an educational project - use a production-grade security audit for real deployments.

**Q: Can I deploy this commercially?**
A: This is an educational project. For commercial use, ensure proper licensing, security audits, and HIPAA compliance if handling real health data.

**Q: How do I add more reminder categories?**
A: Update the enum in the User model schema and add corresponding UI options.

**Q: Can I integrate with Apple Health or Google Fit?**
A: Not currently, but it's on the roadmap. You can contribute this feature!

---

## 🙏 Acknowledgments

### Technologies
- [React](https://reactjs.org/) - UI framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [MongoDB](https://www.mongodb.com/) - Database
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) - AI platform
- [Three.js](https://threejs.org/) - 3D graphics
- [Recharts](https://recharts.org/) - Data visualization

### Inspiration
- Modern health management platforms
- AI-powered personal assistants
- Wellness and fitness applications

### Contributors
Thank you to all contributors who have helped improve this project!

---

## 📞 Contact

- **Project Maintainer**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Website**: [buddyyourhealth.com](https://buddyyourhealth.com)

---

<div align="center">

**Made with ❤️ for better health management**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues) • [Documentation](https://github.com/your-repo/wiki)

</div>
