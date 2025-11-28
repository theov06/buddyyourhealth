# Apple Health Data Sync Feature

## Overview
The Apple Health Data Sync feature allows users to import their health data from the iPhone Health app and view it in a comprehensive dashboard.

## Features

### 1. Health Data Upload
- **Location**: `/health/upload`
- **Supported Formats**: 
  - Apple Health XML export (`.xml`)
  - Apple Health ZIP export (`.zip`)
- **Sample Data**: Test the feature with pre-loaded sample data

### 2. Health Dashboard
- **Location**: `/health/dashboard`
- **Features**:
  - View all imported health metrics
  - Time range filters (7 days, 30 days, 3 months, 1 year)
  - Two view modes: Cards and Charts
  - Delete all data functionality

### 3. Supported Health Metrics
- **Vital Signs**:
  - Heart Rate (bpm)
  - Blood Pressure (Systolic/Diastolic)
  - Blood Glucose (mg/dL)
  - Oxygen Saturation (%)
  - Respiratory Rate
  - Body Temperature

- **Activity**:
  - Steps (count)
  - Distance Walked (km/miles)
  - Calories Burned
  - Flights Climbed

- **Body Measurements**:
  - Weight (kg/lbs)
  - Height (cm/inches)
  - BMI

- **Sleep**:
  - Sleep Analysis

## How to Use

### For Users:

1. **Export from iPhone Health App**:
   - Open the Health app on your iPhone
   - Tap your profile picture (top right)
   - Scroll down and tap "Export All Health Data"
   - Choose where to save the export (it will be a ZIP file)
   - Share/transfer the file to your computer

2. **Upload to BYH App**:
   - Navigate to `/health/upload`
   - Click "Choose File" and select your exported ZIP or XML file
   - Click "Upload to Dashboard"
   - Wait for processing (may take a few seconds for large files)

3. **View Your Data**:
   - Automatically redirected to `/health/dashboard`
   - Use time range filters to view specific periods
   - Switch between Cards and Charts view
   - Click "Import More Data" to add additional exports

### For Testing:
- Click "Load Sample Data" on the upload page to test with pre-populated health metrics

## Technical Implementation

### Frontend Components:
- **HealthDataUpload.tsx**: Upload interface
- **HealthDashboard.tsx**: Main dashboard with metrics display
- **HealthChart.tsx**: Chart visualization component
- **healthDataParser.ts**: XML/ZIP parsing utility
- **healthApi.ts**: API service for health data operations

### Backend Routes:
- `POST /api/health/bulk`: Add bulk health data
- `GET /api/health/data`: Get health data with filters
- `DELETE /api/health/data`: Delete all health data
- `GET /api/health/summary`: Get health data summary

### Database Schema:
Health data is stored in the User model under the `healthData` array:
```javascript
healthData: [{
  dataType: String,      // e.g., 'heart_rate', 'steps'
  value: Mixed,          // Number or Object
  unit: String,          // e.g., 'bpm', 'count'
  timestamp: Date,       // When the data was recorded
  source: String,        // e.g., 'Apple Health'
  metadata: Mixed,       // Additional data
  createdAt: Date        // When imported to BYH
}]
```

## Dependencies

### Frontend:
- `jszip`: ^3.10.1 - For extracting XML from ZIP files
- `recharts`: ^2.10.3 - For chart visualizations

### Backend:
- No additional dependencies required (uses existing MongoDB/Mongoose)

## Installation

1. **Install Frontend Dependencies**:
```bash
cd BYH_App/frontend
npm install
```

2. **Backend is Ready**: No additional setup needed

3. **Start the Application**:
```bash
# Terminal 1 - Backend
cd BYH_App/backend
npm start

# Terminal 2 - Frontend
cd BYH_App/frontend
npm start
```

## API Endpoints

### Add Bulk Health Data
```
POST /api/health/bulk
Authorization: Bearer <token>
Body: {
  "healthDataArray": [
    {
      "dataType": "heart_rate",
      "value": 72,
      "unit": "bpm",
      "timestamp": "2024-11-26T10:00:00Z",
      "source": "Apple Health"
    }
  ]
}
```

### Get Health Data
```
GET /api/health/data?startDate=2024-11-01&endDate=2024-11-26&limit=100
Authorization: Bearer <token>
```

### Delete All Health Data
```
DELETE /api/health/data
Authorization: Bearer <token>
```

### Get Health Summary
```
GET /api/health/summary?period=30d
Authorization: Bearer <token>
```

## Privacy & Security
- All health data is encrypted in transit (HTTPS)
- Data is stored securely in MongoDB
- Only the authenticated user can access their own health data
- Users can delete all their health data at any time
- No health data is shared with third parties

## Future Enhancements
- [ ] AI-powered health insights based on imported data
- [ ] Trend analysis and predictions
- [ ] Export health data to PDF reports
- [ ] Integration with wearable devices
- [ ] Health goal tracking
- [ ] Medication reminders based on health metrics
- [ ] Share health reports with healthcare providers

## Troubleshooting

### Upload Issues:
- **File too large**: Apple Health exports can be large. Ensure good internet connection.
- **Parsing errors**: Make sure the file is a valid Apple Health export.
- **No data showing**: Check that the export contains recent data (last 30 days are imported).

### Dashboard Issues:
- **No data displayed**: Try uploading data first or use "Load Sample Data".
- **Charts not rendering**: Ensure recharts is installed (`npm install recharts`).

## Support
For issues or questions, please contact support or create an issue in the repository.
