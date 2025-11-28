import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HealthDashboard.css';
import Navbar from '../navbar/Navbar';
import ParticleBackground from '../home/ParticleBackground';
import LightBackground from '../home/LightBackground';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import healthApi from '../services/healthApi';
import HealthChart from './HealthChart';

interface HealthMetric {
  type: string;
  value: number | string;
  unit: string;
  timestamp: string;
}

const HealthDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [healthData, setHealthData] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [viewMode, setViewMode] = useState<'cards' | 'charts'>('cards');

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        // Calculate date range
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

        // Try to fetch from backend with date filter
        const response = await healthApi.getHealthData({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 1000
        });
        
        if (response.success && response.data && response.data.length > 0) {
          // Transform backend data to display format
          const transformedData = response.data.map((item: any) => ({
            type: formatDataType(item.dataType),
            value: item.value,
            unit: item.unit,
            timestamp: item.timestamp
          }));
          setHealthData(transformedData);
        } else {
          // No data in backend, show empty state
          setHealthData([]);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
        // If backend fails, show empty state
        setHealthData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [isAuthenticated, timeRange]);

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

  const handleDeleteData = async () => {
    try {
      // Call API to delete data
      await healthApi.deleteAllHealthData();
      
      // Clear local state
      setHealthData([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Error deleting data. Please try again.');
    }
  };

  const getIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'Steps': '👣',
      'Heart Rate': '❤️',
      'Sleep': '😴',
      'Weight': '⚖️',
      'Distance': '🏃',
      'Calories': '🔥',
      'Blood Pressure (Systolic)': '🩺',
      'Blood Pressure (Diastolic)': '🩺',
      'Blood Glucose': '🩸',
      'HbA1c': '🩸',
      'BMI': '📊',
      'Oxygen Saturation': '🫁',
    };
    return icons[type] || '📊';
  };

  if (loading) {
    return (
      <div className="App">
        {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
        <div className="main-content">
          <Navbar activeLink="health" />
          <div className="dashboard-container">
            <div className="loading">Loading your health data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (healthData.length === 0) {
    return (
      <div className="App">
        {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
        <div className="main-content">
          <Navbar activeLink="health" />
          <div className="dashboard-container">
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h2>No Health Data Yet</h2>
              <p>Import your Apple Health data to see your metrics here</p>
              <Link to="/health/upload" className="import-button">
                🏥 Import Health Data
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      <div className="main-content">
        <Navbar activeLink="health" />
        <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Health Dashboard</h1>
        <div className="header-controls">
          <div className="time-range-selector">
            <button 
              className={`range-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </button>
            <button 
              className={`range-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </button>
            <button 
              className={`range-btn ${timeRange === '90d' ? 'active' : ''}`}
              onClick={() => setTimeRange('90d')}
            >
              3 Months
            </button>
            <button 
              className={`range-btn ${timeRange === '1y' ? 'active' : ''}`}
              onClick={() => setTimeRange('1y')}
            >
              1 Year
            </button>
          </div>
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              📊 Cards
            </button>
            <button 
              className={`view-btn ${viewMode === 'charts' ? 'active' : ''}`}
              onClick={() => setViewMode('charts')}
            >
              📈 Charts
            </button>
          </div>
          <Link to="/health/upload" className="import-button-small">
            + Import More Data
          </Link>
        </div>
      </div>

      {viewMode === 'charts' ? (
        <div className="charts-container">
          {Array.from(new Set(healthData.map(d => d.type))).map((type, index) => (
            <HealthChart
              key={type}
              data={healthData}
              dataType={type}
              color={['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'][index % 6]}
            />
          ))}
        </div>
      ) : (
        <div className="metrics-grid">
        {healthData.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon">{getIcon(metric.type)}</div>
            <div className="metric-info">
              <h3>{metric.type}</h3>
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
      )}

      <div className="dashboard-actions">
        <button className="action-button">
          📈 View Trends
        </button>
        <button className="action-button">
          🤖 Get AI Insights
        </button>
        <button 
          className="action-button delete-button"
          onClick={() => setShowDeleteConfirm(true)}
        >
          🗑️ Delete All Data
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h2>Delete All Health Data?</h2>
            <p>This will permanently delete all your imported health data. This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="modal-button cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleDeleteData}
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </div>
  );
};

export default HealthDashboard;