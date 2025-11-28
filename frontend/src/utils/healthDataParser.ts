// Apple Health XML Parser
// Extracts health metrics from Apple Health export
import JSZip from 'jszip';
import { HealthDataEntry } from '../services/healthApi';

export interface ParsedHealthData {
  dataType: string;
  value: number | string;
  unit: string;
  timestamp: string;
  source?: string;
}

// Extract XML from ZIP file
export const extractXMLFromZip = async (zipFile: File): Promise<string> => {
  const zip = new JSZip();
  const zipData = await zip.loadAsync(zipFile);
  
  // Look for export.xml or any XML file
  const xmlFile = zipData.file(/export\.xml$/i)[0] || zipData.file(/\.xml$/i)[0];
  
  if (!xmlFile) {
    throw new Error('No XML file found in ZIP');
  }
  
  return await xmlFile.async('string');
};

export const parseAppleHealthXML = async (xmlContent: string): Promise<HealthDataEntry[]> => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  const records = xmlDoc.getElementsByTagName('Record');
  const healthData: HealthDataEntry[] = [];
  
  // Map Apple Health types to our data types
  const typeMapping: { [key: string]: string } = {
    'HKQuantityTypeIdentifierStepCount': 'steps',
    'HKQuantityTypeIdentifierHeartRate': 'heart_rate',
    'HKQuantityTypeIdentifierBloodPressureSystolic': 'blood_pressure_systolic',
    'HKQuantityTypeIdentifierBloodPressureDiastolic': 'blood_pressure_diastolic',
    'HKQuantityTypeIdentifierBloodGlucose': 'blood_glucose',
    'HKQuantityTypeIdentifierBodyMass': 'weight',
    'HKQuantityTypeIdentifierHeight': 'height',
    'HKQuantityTypeIdentifierBodyMassIndex': 'bmi',
    'HKQuantityTypeIdentifierBodyTemperature': 'body_temperature',
    'HKQuantityTypeIdentifierOxygenSaturation': 'oxygen_saturation',
    'HKQuantityTypeIdentifierRespiratoryRate': 'respiratory_rate',
    'HKQuantityTypeIdentifierActiveEnergyBurned': 'calories_burned',
    'HKQuantityTypeIdentifierDistanceWalkingRunning': 'distance_walked',
    'HKQuantityTypeIdentifierFlightsClimbed': 'flights_climbed',
    'HKCategoryTypeIdentifierSleepAnalysis': 'sleep',
  };

  // Get only the most recent records for each type (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recordsByType: { [key: string]: HealthDataEntry[] } = {};
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const type = record.getAttribute('type');
    const value = record.getAttribute('value');
    const unit = record.getAttribute('unit');
    const startDate = record.getAttribute('startDate');
    const sourceName = record.getAttribute('sourceName');
    
    if (type && value && typeMapping[type]) {
      const recordDate = startDate ? new Date(startDate) : new Date();
      
      // Only include recent records
      if (recordDate >= thirtyDaysAgo) {
        const dataType = typeMapping[type];
        
        if (!recordsByType[dataType]) {
          recordsByType[dataType] = [];
        }
        
        // Limit to 10 records per type
        if (recordsByType[dataType].length < 10) {
          recordsByType[dataType].push({
            dataType,
            value: parseFloat(value) || value,
            unit: unit || 'count',
            timestamp: startDate || new Date().toISOString(),
            source: sourceName || 'Apple Health'
          });
        }
      }
    }
  }
  
  // Flatten the records
  Object.values(recordsByType).forEach(records => {
    healthData.push(...records);
  });
  
  return healthData;
};

// Parse CSV format (alternative to XML)
export const parseHealthCSV = (csvContent: string): HealthDataEntry[] => {
  const lines = csvContent.split('\n');
  const healthData: HealthDataEntry[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [type, value, unit, timestamp] = line.split(',');
    
    if (type && value) {
      healthData.push({
        dataType: type.toLowerCase().replace(/\s+/g, '_'),
        value: parseFloat(value) || value,
        unit: unit || 'count',
        timestamp: timestamp || new Date().toISOString(),
      });
    }
  }
  
  return healthData;
};

// Extract sample data for testing
export const getSampleHealthData = (): HealthDataEntry[] => {
  return [
    {
      dataType: 'blood_pressure_systolic',
      value: 120,
      unit: 'mmHg',
      timestamp: new Date().toISOString(),
      source: 'Sample Data'
    },
    {
      dataType: 'blood_pressure_diastolic',
      value: 80,
      unit: 'mmHg',
      timestamp: new Date().toISOString(),
      source: 'Sample Data'
    },
    {
      dataType: 'blood_glucose',
      value: 95,
      unit: 'mg/dL',
      timestamp: new Date().toISOString(),
      source: 'Sample Data'
    },
    {
      dataType: 'heart_rate',
      value: 72,
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      source: 'Sample Data'
    },
    {
      dataType: 'steps',
      value: 8543,
      unit: 'count',
      timestamp: new Date().toISOString(),
      source: 'Sample Data'
    },
    {
      dataType: 'weight',
      value: 70,
      unit: 'kg',
      timestamp: new Date().toISOString(),
      source: 'Sample Data'
    },
  ];
};
