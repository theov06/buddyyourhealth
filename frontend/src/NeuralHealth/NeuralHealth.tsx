import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import healthApi from '../services/healthApi';
import { parseAppleHealthXML, getSampleHealthData, extractXMLFromZip } from '../utils/healthDataParser';
import './NeuralHealth.css';

interface HealthMetric {
  type: string;
  value: number | string;
  unit: string;
  timestamp: string;
}

interface HealthInsight {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  icon: string;
}

export default function NeuralHealth() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [healthData, setHealthData] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [insights, setInsights] = useState<HealthInsight[]>([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.nh-nav-dropdown-container')) {
        setShowNavDropdown(false);
      }
    };

    if (showNavDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNavDropdown]);

  // Load health data
  useEffect(() => {
    if (isAuthenticated) {
      loadHealthData();
      generateInsights();
    }
  }, [isAuthenticated, timeRange]);

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const response = await healthApi.getHealthData({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 1000
      });
      
      if (response.success && response.data && response.data.length > 0) {
        console.log('Raw health data from API:', response.data);
        const transformedData = response.data.map((item: any) => ({
          type: formatDataType(item.dataType),
          value: item.value,
          unit: item.unit,
          timestamp: item.timestamp
        }));
        console.log('Transformed health data:', transformedData);
        setHealthData(transformedData);
      } else {
        console.log('No health data received from API');
        setHealthData([]);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
      setHealthData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDataType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'steps': 'Steps',
      'heart_rate': 'Heart Rate',
      'blood_pressure_systolic': 'Blood Pressure (Systolic)',
      'blood_pressure_diastolic': 'Blood Pressure (Diastolic)',
      'blood_glucose': 'Blood Glucose',
      'hba1c': 'HbA1c',
      'sleep': 'Sleep',
      'weight': 'Weight',
      'bmi': 'BMI',
      'oxygen_saturation': 'Oxygen Saturation',
      'calories_burned': 'Calories',
      'distance_walked': 'Distance',
    };
    return typeMap[type] || type;
  };

  const generateInsights = () => {
    const mockInsights: HealthInsight[] = [
      {
        title: 'Heart Health Monitoring',
        description: 'Your heart rate patterns show healthy variability. Continue regular cardiovascular exercise.',
        priority: 'high',
        category: 'cardiovascular',
        icon: ''
      },
      {
        title: 'Sleep Quality Analysis',
        description: 'Average sleep duration is optimal. Maintain consistent sleep schedule for best results.',
        priority: 'medium',
        category: 'sleep',
        icon: ''
      },
      {
        title: 'Activity Level Trend',
        description: 'Daily step count is above recommended levels. Great job staying active!',
        priority: 'low',
        category: 'activity',
        icon: ''
      }
    ];
    setInsights(mockInsights);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadMessage('Processing your health data...');

    try {
      let parsedData: any[];
      let xmlContent: string;

      if (file.name.endsWith('.zip')) {
        setUploadMessage('📦 Extracting ZIP file...');
        xmlContent = await extractXMLFromZip(file);
        setUploadMessage('📊 Parsing Apple Health data...');
        parsedData = await parseAppleHealthXML(xmlContent);
      } else if (file.name.endsWith('.xml')) {
        const fileContent = await file.text();
        setUploadMessage('📊 Parsing Apple Health data...');
        parsedData = await parseAppleHealthXML(fileContent);
      } else {
        setUploadMessage('⚠️ Unsupported file format. Using sample data...');
        parsedData = getSampleHealthData();
      }

      if (parsedData.length === 0) {
        setUploadMessage('⚠️ No health data found in file. Using sample data instead.');
        parsedData = getSampleHealthData();
      }

      setUploadMessage(`📤 Uploading ${parsedData.length} health records...`);
      
      try {
        await healthApi.addBulkHealthData(parsedData as any);
        setUploadMessage(`✅ Successfully uploaded ${parsedData.length} health records!`);
        setTimeout(() => {
          setShowUploadModal(false);
          loadHealthData();
        }, 1500);
      } catch (apiError: any) {
        console.error('API Error:', apiError);
        setUploadMessage(`⚠️ ${apiError.message || 'Upload failed'}`);
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadMessage(`❌ Error: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSampleData = async () => {
    setUploading(true);
    setUploadMessage('📊 Loading sample health data...');
    try {
      const sampleData = getSampleHealthData();
      console.log('Sample data generated:', sampleData.length, 'records');
      await healthApi.addBulkHealthData(sampleData as any);
      setUploadMessage('✅ Sample data loaded successfully!');
      setTimeout(() => {
        setShowUploadModal(false);
        loadHealthData();
      }, 1500);
    } catch (error: any) {
      console.error('Error loading sample data:', error);
      setUploadMessage(`❌ Error: ${error.message || 'Failed to load sample data'}`);
    } finally {
      setUploading(false);
    }
  };

  const getCategoryIcon = (type: string) => {
    return '';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#FF1493';
      case 'high': return '#FF69B4';
      case 'medium': return '#FFB6C1';
      case 'low': return '#FFC0CB';
      default: return '#FF69B4';
    }
  };

  const getLatestMetrics = () => {
    const metricTypes = Array.from(new Set(healthData.map(d => d.type)));
    console.log('Unique metric types:', metricTypes);
    console.log('Total health data records:', healthData.length);
    const latestMetrics = metricTypes.map(type => {
      const metrics = healthData.filter(d => d.type === type);
      return metrics[metrics.length - 1];
    }).filter(Boolean);
    console.log('Latest metrics to display:', latestMetrics);
    return latestMetrics;
  };

  if (!isAuthenticated) {
    return (
      <div className={`neural-health-container ${theme}`}>
        <div className="auth-required">
          <div className="neural-health-grid"></div>
          <div className="auth-message">
            <div className="auth-icon">🔒</div>
            <h2>Neural Access Required</h2>
            <p>Connect to your health profile to activate AI-powered health monitoring</p>
            <button 
              className="auth-back-button"
              onClick={() => navigate('/')}
            >
              <span className="back-icon">←</span>
              Back to Home
            </button>
            <div className="auth-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`neural-health-container ${theme}`}>
      {/* Neural Background */}
      <div className="neural-health-background">
        <div className="neural-health-grid"></div>
        <div className="neural-health-data-streams"></div>
      </div>

      {/* Header Section */}
      <div className="health-header">
        <div className="nh-header-content">
          <div className="nh-title-section">
            <div className="nh-title-icon">🧬</div>
            <div className="nh-title-text">
              <h1 className="nh-page-title">
                NEURAL HEALTH
                <div className="nh-powered-by-inline">
                  <span className="nh-powered-by-text">powered by</span>
                  <img src="/logo/logo.png" alt="Buddy Your Health Logo" className="nh-company-logo" />
                </div>
              </h1>
              <p className="nh-page-subtitle">AI-Powered Health Intelligence System</p>
            </div>
          </div>
          
          <div className="nh-header-right">
            <div className="nh-theme-buttons-container">
              <button 
                className={`nh-theme-btn ${theme === 'light' ? 'active' : 'inactive'}`}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                LIGHT
              </button>
              <button 
                className={`nh-theme-btn ${theme === 'dark' ? 'active' : 'inactive'}`}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                DARK
              </button>
            </div>
            
            <div className="nh-nav-dropdown-container">
              <button 
                className="nh-nav-dropdown-trigger"
                onClick={() => setShowNavDropdown(!showNavDropdown)}
              >
                <span className="nh-nav-icon">☰</span>
                <span className="nh-nav-text">MENU</span>
              </button>
              
              {showNavDropdown && (
                <div className="nh-nav-dropdown-menu">
                  <div className="nh-nav-dropdown-item" onClick={() => navigate('/loading/home')}>
                    <span className="nh-nav-item-icon">◆</span>
                    <span className="nav-item-text">Home</span>
                  </div>
                  <div className="nh-nav-dropdown-divider"></div>
                  <div className="nh-nav-dropdown-item sign-out" onClick={() => {
                    logout();
                    navigate('/');
                  }}>
                    <span className="nh-nav-item-icon">◉</span>
                    <span className="nav-item-text">Sign Out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="nh-header-actions">
          <button 
            className="nh-action-btn guardian-btn"
            onClick={() => navigate('/loading/genai')}
          >
            NEURAL GUARDIAN
          </button>
          <button 
            className="nh-action-btn upload-btn"
            onClick={() => setShowUploadModal(true)}
          >
            IMPORT DATA
          </button>
          
          <div className="nh-time-range-selector">
            <button 
              className={`nh-range-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </button>
            <button 
              className={`nh-range-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </button>
            <button 
              className={`nh-range-btn ${timeRange === '90d' ? 'active' : ''}`}
              onClick={() => setTimeRange('90d')}
            >
              3 Months
            </button>
            <button 
              className={`nh-range-btn ${timeRange === '1y' ? 'active' : ''}`}
              onClick={() => setTimeRange('1y')}
            >
              1 Year
            </button>
          </div>

          <div className="nh-view-controls">
            <button 
              className={`nh-view-btn ${viewMode === 'overview' ? 'active' : ''}`}
              onClick={() => setViewMode('overview')}
            >
              Overview
            </button>
            <button 
              className={`nh-view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="health-content">
        {loading ? (
          <div className="nh-loading-state">
            <div className="nh-loading-spinner"></div>
            <p>Loading your health data...</p>
          </div>
        ) : healthData.length === 0 ? (
          <div className="nh-empty-state">
            <div className="nh-empty-animation">
              <div className="neural-pulse"></div>
              <div className="nh-empty-icon">🧬</div>
            </div>
            <h3>No Health Data Yet</h3>
            <p>Import your Apple Health data to unlock AI-powered insights</p>
            <button 
              className="nh-initialize-btn"
              onClick={() => setShowUploadModal(true)}
            >
              <span className="nh-btn-glow"></span>
              IMPORT HEALTH DATA
            </button>
          </div>
        ) : (
          <>
            {/* AI Insights Panel */}
            <div className="insights-panel">
              <div className="nh-panel-header">
                <h3>AI Health Insights</h3>
              </div>
              <div className="insights-grid">
                {insights.map((insight, index) => (
                  <div key={index} className="insight-card" style={{ borderLeftColor: getPriorityColor(insight.priority) }}>
                    <div className="insight-content">
                      <h4>{insight.title}</h4>
                      <p>{insight.description}</p>
                      <div className="insight-meta">
                        <span className={`priority-badge ${insight.priority}`}>{insight.priority}</span>
                        <span className="category-badge">{insight.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Metrics */}
            <div className="metrics-section">
              <div className="section-header">
                <h3>Health Metrics</h3>
                <span className="data-count">{healthData.length} records</span>
              </div>
              
              {viewMode === 'overview' ? (
                <div className="metrics-grid">
                  {getLatestMetrics().map((metric, index) => (
                    <div key={index} className="metric-card">
                      <div className="metric-icon">{getCategoryIcon(metric.type)}</div>
                      <div className="metric-info">
                        <h4>{metric.type}</h4>
                        <div className="metric-value">
                          {metric.value} <span className="metric-unit">{metric.unit}</span>
                        </div>
                        <div className="metric-time">
                          {new Date(metric.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="detailed-list">
                  {healthData.map((metric, index) => (
                    <div key={index} className="detail-row">
                      <span className="detail-icon">{getCategoryIcon(metric.type)}</span>
                      <span className="detail-type">{metric.type}</span>
                      <span className="detail-value">{metric.value} {metric.unit}</span>
                      <span className="detail-time">{new Date(metric.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Import Health Data</h3>
              <button className="close-modal-btn" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <p className="modal-instruction">
                <strong>On your iPhone:</strong> Health app → Profile → Export All Health Data
              </p>
              
              <div className="upload-area">
                <input
                  type="file"
                  accept=".xml,.zip"
                  onChange={handleFileChange}
                  id="health-file-input"
                  className="file-input"
                />
                <label htmlFor="health-file-input" className="file-button">
                  <span className="button-text">{file ? file.name : 'Choose File'}</span>
                </label>
                
                {file && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="upload-confirm-btn"
                  >
                    <span className="button-icon">{uploading ? '⏳' : '✓'}</span>
                    <span className="button-text">{uploading ? 'Uploading...' : 'Upload'}</span>
                  </button>
                )}
              </div>

              {uploadMessage && (
                <div className={`upload-message ${uploadMessage.includes('❌') ? 'error' : 'success'}`}>
                  {uploadMessage}
                </div>
              )}

              <div className="modal-divider">OR</div>

              <button 
                className="sample-data-btn"
                onClick={handleLoadSampleData}
                disabled={uploading}
              >
                Load Sample Data (Test Mode)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
