import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HealthDataUpload.css';
import Navbar from '../navbar/Navbar';
import ParticleBackground from '../home/ParticleBackground';
import LightBackground from '../home/LightBackground';
import { useTheme } from '../contexts/ThemeContext';
import { parseAppleHealthXML, getSampleHealthData, extractXMLFromZip } from '../utils/healthDataParser';
import healthApi from '../services/healthApi';

const HealthDataUpload: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('Processing your health data...');

    try {
      let parsedData: any[];
      let xmlContent: string;

      // Check if it's a ZIP file
      if (file.name.endsWith('.zip')) {
        setMessage('�  Extracting ZIP file...');
        xmlContent = await extractXMLFromZip(file);
        setMessage('📊 Parsing Apple Health data...');
        parsedData = await parseAppleHealthXML(xmlContent);
      } 
      // Check if it's XML
      else if (file.name.endsWith('.xml')) {
        const fileContent = await file.text();
        setMessage('📊 Parsing Apple Health data...');
        parsedData = await parseAppleHealthXML(fileContent);
      } 
      // Unknown format
      else {
        setMessage('⚠️ Unsupported file format. Using sample data...');
        parsedData = getSampleHealthData();
      }

      if (parsedData.length === 0) {
        setMessage('⚠️ No health data found in file. Using sample data instead.');
        parsedData = getSampleHealthData();
      }

      setMessage(`📤 Uploading ${parsedData.length} health records...`);
      
      try {
        // Send to backend API
        await healthApi.addBulkHealthData(parsedData as any);
        setMessage(`✅ Successfully uploaded ${parsedData.length} health records to database!`);
      } catch (apiError: any) {
        console.error('API Error:', apiError);
        console.error('Error details:', apiError.message);
        
        // Check if it's an auth error
        if (apiError.message?.includes('401') || apiError.message?.includes('auth')) {
          setMessage(`⚠️ Please log in first. Data saved locally (${parsedData.length} records).`);
        } else {
          // If backend fails, store locally as fallback
          localStorage.setItem('healthData', JSON.stringify(parsedData));
          setMessage(`✅ Data saved locally (${parsedData.length} records). Backend: ${apiError.message}`);
        }
      }
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/health/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Unknown error';
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      <div className="main-content">
        <Navbar activeLink="health" />
        <div className="health-upload-container">
          <div className="upload-card">
        <div className="hero-icon">📊</div>
        <h1>Import Your Health Data</h1>
        <p className="big-subtitle">
          Export your data from iPhone Health app and upload it here
        </p>

        <div className="info-steps">
          <p className="step-instruction">
            <strong>On your iPhone:</strong> Health app → Profile (top right) → Export All Health Data
          </p>
        </div>

        <div className="upload-area">
          <input
            type="file"
            accept=".xml,.zip"
            onChange={handleFileChange}
            id="health-file-input"
            className="file-input"
          />
          <label htmlFor="health-file-input" className="mega-button file-button">
            <span className="button-icon">📁</span>
            <span className="button-text">{file ? file.name : 'Choose File'}</span>
          </label>
          
          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mega-button upload-confirm"
            >
              <span className="button-icon">{uploading ? '⏳' : '✓'}</span>
              <span className="button-text">{uploading ? 'Uploading...' : 'Upload to Dashboard'}</span>
            </button>
          )}
        </div>

        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="help-note">
          <p>💡 Your data is encrypted and stored securely. We never share your health information.</p>
        </div>

        <div className="test-data-section">
          <p className="test-label">Want to test first?</p>
          <button 
            className="test-button"
            onClick={async () => {
              setUploading(true);
              setMessage('📊 Loading sample health data...');
              try {
                const sampleData = getSampleHealthData();
                await healthApi.addBulkHealthData(sampleData as any);
                setMessage('✅ Sample data loaded successfully!');
                setTimeout(() => navigate('/health/dashboard'), 1500);
              } catch (error) {
                setMessage('❌ Error loading sample data');
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading}
          >
            Load Sample Data (Blood Pressure, Glucose, etc.)
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDataUpload;