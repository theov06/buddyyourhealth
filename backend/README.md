# Buddy Your Health - Backend API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env` file and update the values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/buddy-your-health
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   brew services start mongodb-community
   
   # Or if using MongoDB Atlas, update MONGODB_URI in .env
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### User Management
- `GET /api/users/profile` - Get user profile (requires token)
- `PUT /api/users/profile` - Update user profile (requires token)

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Database Schema

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
  }
}
```