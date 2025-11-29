# Design Document

## Overview

Buddy Your Health is a full-stack web application built with React TypeScript frontend and Express.js backend, integrated with AWS Bedrock Nova for AI capabilities and MongoDB for data persistence. The architecture follows a client-server model with RESTful API design, JWT-based authentication, and modular component structure. The system is designed to handle health data import, AI-powered conversations, smart reminder management, and data visualization.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Neural  │  │  Neural  │  │  Neural  │  │   Auth   │   │
│  │ Guardian │  │  Health  │  │Reminders │  │  System  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                          │                                    │
│                    API Service Layer                          │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS/REST
┌──────────────────────────┼──────────────────────────────────┐
│                    Backend (Express)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │    AI    │  │ Reminder │  │  Health  │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Layer                        │   │
│  │         (Auth, Validation, Error Handling)           │   │
│  └──────────────────────────────────────────────────────┘   │
│         │              │              │              │       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   User   │  │ Reminder │  │  Health  │                  │
│  │  Model   │  │  Model   │  │  Model   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │   MongoDB   │
                    └─────────────┘

┌─────────────────────────────────────────────────────────────┐
│              External Services                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  AWS Bedrock     │  │  Google OAuth    │                │
│  │  Nova Lite       │  │  2.0             │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 19.2.0 with TypeScript
- Three.js for 3D graphics
- Context API for state management (Auth, Theme)
- Axios for HTTP requests
- Chart.js/Recharts for data visualization

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing

**AI Integration:**
- AWS Bedrock Nova Lite
- AWS SDK for JavaScript

**Authentication:**
- JWT tokens
- Google OAuth 2.0
- Passport.js

## Components and Interfaces

### Frontend Components

#### 1. Authentication Components
- **Login.tsx**: Email/password login form
- **Signup.tsx**: User registration form
- **GoogleCallback.tsx**: OAuth callback handler
- **AuthContext.tsx**: Global authentication state management

**Interface:**
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```

#### 2. Neural Guardian (AI Chat)
- **GenAI.tsx**: Main chat interface
- **aiService.js**: API communication for AI features

**Interface:**
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  conversationHistory: Message[];
}

interface ChatResponse {
  response: string;
  conversationId?: string;
}
```

#### 3. Neural Health Dashboard
- **NeuralHealth.tsx**: Main dashboard component
- **HealthChart.tsx**: Chart visualization component
- **HealthDataUpload.tsx**: File upload interface
- **healthDataParser.ts**: Data parsing utilities

**Interface:**
```typescript
interface HealthData {
  date: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  glucose?: number;
  weight?: number;
  steps?: number;
  [key: string]: any;
}

interface HealthMetrics {
  metrics: HealthData[];
  summary: {
    averageHeartRate: number;
    averageBloodPressure: string;
    totalSteps: number;
  };
}

interface ParsedHealthData {
  data: HealthData[];
  format: 'csv' | 'json' | 'xml';
  errors: string[];
}
```

#### 4. Neural Reminders
- **SmartReminders.tsx**: Main reminders interface
- **NewReminderModal.tsx**: Reminder creation form
- **DailyTrackerModal.tsx**: Daily habit tracking
- **AnalysisModal.tsx**: AI insights display
- **TimePickerModal.tsx**: Time selection interface
- **calendarService.ts**: .ics file generation

**Interface:**
```typescript
interface Reminder {
  id: string;
  title: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  category: 'medication' | 'exercise' | 'nutrition' | 'wellness';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  userId: string;
  createdAt: Date;
}

interface ReminderInsight {
  suggestions: string[];
  reminders: Partial<Reminder>[];
}
```

#### 5. Theme Management
- **ThemeContext.tsx**: Theme state management

**Interface:**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

### Backend Components

#### 1. Authentication Routes
- **POST /api/auth/signup**: User registration
- **POST /api/auth/login**: User authentication
- **POST /api/auth/google**: Google OAuth authentication
- **GET /api/auth/me**: Get current user

#### 2. AI Routes
- **POST /api/ai/chat**: Conversational AI interaction
- **POST /api/ai/health-insights**: Generate health insights
- **POST /api/ai/generate-reminders**: AI-generated reminders

#### 3. Reminder Routes
- **GET /api/reminders**: Fetch user reminders
- **POST /api/reminders**: Create new reminder
- **PUT /api/reminders/:id**: Update reminder
- **DELETE /api/reminders/:id**: Delete reminder
- **PATCH /api/reminders/:id/complete**: Mark reminder complete

#### 4. Health Data Routes
- **POST /api/health/upload**: Upload health data
- **GET /api/health/data**: Retrieve health data
- **GET /api/health/summary**: Get health summary statistics

### Data Models

#### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  googleId: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### Reminder Model
```javascript
{
  userId: ObjectId (required, ref: 'User'),
  title: String (required),
  time: String (required),
  frequency: String (enum: ['daily', 'weekly', 'monthly', 'once']),
  category: String (enum: ['medication', 'exercise', 'nutrition', 'wellness']),
  priority: String (enum: ['high', 'medium', 'low']),
  completed: Boolean (default: false),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Health Data Model
```javascript
{
  userId: ObjectId (required, ref: 'User'),
  date: Date (required),
  metrics: {
    bloodPressureSystolic: Number,
    bloodPressureDiastolic: Number,
    heartRate: Number,
    glucose: Number,
    weight: Number,
    steps: Number,
    // Additional metrics as needed
  },
  source: String (enum: ['csv', 'json', 'xml', 'manual']),
  createdAt: Date
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Password hashing consistency
*For any* user registration with a valid password, the stored password should never match the plaintext password provided
**Validates: Requirements 1.1, 7.4**

### Property 2: JWT token validation
*For any* authenticated request with a valid JWT token, the system should successfully extract and verify the user identity
**Validates: Requirements 1.3, 7.2**

### Property 3: Duplicate email rejection
*For any* registration attempt with an email that already exists in the system, the registration should be rejected
**Validates: Requirements 1.2**

### Property 4: AI conversation context preservation
*For any* sequence of messages in a conversation, each AI response should have access to all previous messages in that conversation
**Validates: Requirements 2.2, 2.5**

### Property 5: Health data parsing round-trip (CSV)
*For any* valid CSV health data file, parsing then exporting should preserve all health metric values
**Validates: Requirements 3.1, 8.1**

### Property 6: Health data parsing round-trip (JSON)
*For any* valid JSON health data file, parsing then serializing should produce equivalent data structures
**Validates: Requirements 3.2, 8.2**

### Property 7: Reminder creation persistence
*For any* valid reminder data, creating a reminder should result in the reminder being retrievable with all original properties intact
**Validates: Requirements 4.1**

### Property 8: Calendar export format validity
*For any* reminder exported to .ics format, the generated file should conform to iCalendar RFC 5545 specification
**Validates: Requirements 4.5**

### Property 9: Reminder deletion completeness
*For any* reminder that is deleted, subsequent queries for that reminder should return not found
**Validates: Requirements 4.6**

### Property 10: Theme persistence across sessions
*For any* theme preference set by a user, closing and reopening the application should restore the same theme
**Validates: Requirements 6.2, 6.3**

### Property 11: Unauthorized access rejection
*For any* protected endpoint accessed without valid authentication, the request should be rejected with 401 status
**Validates: Requirements 7.1**

### Property 12: Health data validation
*For any* uploaded file with invalid structure, the system should reject the upload and provide error messages
**Validates: Requirements 8.4**

### Property 13: Reminder priority ordering
*For any* set of reminders with different priorities, high priority reminders should appear before medium, and medium before low
**Validates: Requirements 9.3**

### Property 14: Reminder category filtering
*For any* category filter applied, only reminders matching that category should be returned
**Validates: Requirements 9.4**

### Property 15: Mobile responsive layout adaptation
*For any* viewport width below mobile breakpoint, the layout should switch to mobile-optimized display
**Validates: Requirements 10.1, 10.3**

## Error Handling

### Frontend Error Handling
- Network errors: Display user-friendly messages and retry options
- Authentication errors: Redirect to login with appropriate messaging
- Validation errors: Show inline form validation feedback
- AI service errors: Graceful degradation with fallback messages
- File upload errors: Clear error messages with format requirements

### Backend Error Handling
- Input validation: Return 400 Bad Request with detailed error messages
- Authentication failures: Return 401 Unauthorized
- Authorization failures: Return 403 Forbidden
- Resource not found: Return 404 Not Found
- Server errors: Return 500 Internal Server Error with logged details
- Database errors: Graceful handling with transaction rollback where applicable
- External service failures: Timeout handling and fallback responses

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
  };
}
```

## Testing Strategy

### Unit Testing

**Framework:** Jest for both frontend and backend

**Frontend Unit Tests:**
- Component rendering and props handling
- User interaction handlers (clicks, form submissions)
- Context provider state management
- Utility function correctness (healthDataParser, calendarService)
- API service request formatting

**Backend Unit Tests:**
- Route handler logic
- Middleware functionality (auth, validation)
- Model validation rules
- Service layer business logic
- Error handling paths

**Example Unit Tests:**
- Test that Login component renders form fields correctly
- Test that healthDataParser correctly extracts CSV columns
- Test that JWT middleware rejects expired tokens
- Test that reminder creation validates required fields

### Property-Based Testing

**Framework:** fast-check for JavaScript/TypeScript

**Configuration:** Each property test should run a minimum of 100 iterations to ensure comprehensive coverage of the input space.

**Property Test Requirements:**
- Each property-based test MUST be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: buddy-your-health, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test

**Property Tests:**
1. Password hashing (Property 1): Generate random passwords, verify hashed values never match plaintext
2. JWT validation (Property 2): Generate random valid tokens, verify successful extraction
3. Email uniqueness (Property 3): Generate random user data, verify duplicate email rejection
4. Conversation context (Property 4): Generate random message sequences, verify context preservation
5. CSV round-trip (Property 5): Generate random health data, verify parse-export equivalence
6. JSON round-trip (Property 6): Generate random health objects, verify serialize-deserialize equivalence
7. Reminder persistence (Property 7): Generate random reminder data, verify creation-retrieval consistency
8. Calendar export (Property 8): Generate random reminders, verify .ics format validity
9. Reminder deletion (Property 9): Generate random reminders, verify deletion completeness
10. Theme persistence (Property 10): Generate random theme preferences, verify storage-retrieval
11. Auth rejection (Property 11): Generate random unauthorized requests, verify rejection
12. Data validation (Property 12): Generate random invalid files, verify rejection with errors
13. Priority ordering (Property 13): Generate random reminder sets, verify priority-based sorting
14. Category filtering (Property 14): Generate random reminders, verify filter correctness
15. Responsive layout (Property 15): Generate random viewport sizes, verify layout adaptation

### Integration Testing

**Framework:** Supertest for API testing, React Testing Library for component integration

**Integration Test Coverage:**
- Complete authentication flow (signup → login → protected route access)
- AI chat conversation flow (send message → receive response → maintain history)
- Health data upload flow (file upload → parsing → storage → retrieval → visualization)
- Reminder lifecycle (create → update → complete → delete)
- Theme switching with persistence
- OAuth flow (initiate → callback → user creation/retrieval)

### End-to-End Testing

**Framework:** Cypress or Playwright

**E2E Test Scenarios:**
- New user registration and first-time setup
- Complete health data import and analysis workflow
- AI-assisted reminder generation and management
- Daily habit tracking and completion
- Cross-browser compatibility testing
- Mobile responsive behavior testing

## Security Considerations

### Authentication Security
- Passwords hashed using bcrypt with salt rounds ≥ 10
- JWT tokens with expiration (7 days default)
- Secure token storage (httpOnly cookies or secure localStorage)
- OAuth state parameter validation for CSRF protection

### Data Security
- Input sanitization for all user-provided data
- SQL injection prevention through parameterized queries (Mongoose)
- XSS prevention through React's built-in escaping
- CORS configuration to restrict API access
- Rate limiting on authentication endpoints

### API Security
- Authentication middleware on all protected routes
- Request validation using express-validator
- Error messages that don't leak sensitive information
- Logging of security-relevant events

## Performance Considerations

### Frontend Optimization
- Code splitting for route-based lazy loading
- Memoization of expensive computations (React.memo, useMemo)
- Debouncing of search and filter operations
- Optimized chart rendering with data sampling for large datasets
- Image optimization and lazy loading

### Backend Optimization
- Database indexing on frequently queried fields (userId, email, date)
- Query optimization with projection and pagination
- Caching of AI responses for common queries
- Connection pooling for database connections
- Compression middleware for API responses

### AI Service Optimization
- Request batching where applicable
- Timeout configuration for external service calls
- Fallback responses for service unavailability
- Conversation history truncation to manage token limits

## Deployment Considerations

### Environment Configuration
- Separate .env files for development, staging, production
- Secure storage of API keys and secrets
- Environment-specific API URLs and service endpoints

### Database
- MongoDB Atlas for production (managed service)
- Automated backups and point-in-time recovery
- Replica sets for high availability

### Hosting
- Frontend: Static hosting (Vercel, Netlify, AWS S3 + CloudFront)
- Backend: Container deployment (AWS ECS, Heroku, DigitalOcean)
- SSL/TLS certificates for HTTPS

### Monitoring
- Application logging (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Health check endpoints for uptime monitoring
