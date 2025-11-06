import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './SmartReminders.css';

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  category: 'medication' | 'exercise' | 'checkup' | 'wellness' | 'nutrition';
  isActive: boolean;
  nextReminder: Date;
  aiGenerated: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function SmartReminders() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.nav-dropdown-container')) {
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

  // Sample AI-generated reminders
  useEffect(() => {
    if (isAuthenticated) {
      const sampleReminders: Reminder[] = [
        {
          id: '1',
          title: 'Morning Vitamin D',
          description: 'AI detected low sunlight exposure. Take 2000 IU Vitamin D supplement',
          time: '08:00',
          frequency: 'daily',
          category: 'medication',
          isActive: true,
          nextReminder: new Date(Date.now() + 8 * 60 * 60 * 1000),
          aiGenerated: true,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Hydration Check',
          description: 'AI analysis: Drink 500ml water based on your activity level',
          time: '14:00',
          frequency: 'daily',
          category: 'wellness',
          isActive: true,
          nextReminder: new Date(Date.now() + 6 * 60 * 60 * 1000),
          aiGenerated: true,
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Cardio Session',
          description: 'AI recommends 25-min moderate cardio based on heart rate data',
          time: '18:30',
          frequency: 'daily',
          category: 'exercise',
          isActive: false,
          nextReminder: new Date(Date.now() + 12 * 60 * 60 * 1000),
          aiGenerated: true,
          priority: 'medium'
        }
      ];
      setReminders(sampleReminders);
      
      // Simulate AI suggestions
      setAiSuggestions([
        'Based on your sleep pattern, consider a melatonin reminder at 21:00',
        'Your stress levels suggest adding a 5-minute meditation break',
        'AI detected irregular meal times - shall I create nutrition reminders?'
      ]);
    }
  }, [isAuthenticated]);

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiSuggestions([
        'AI detected you missed 3 workouts this week - adjusting intensity',
        'Your medication adherence is 95% - excellent progress!',
        'Recommend adding a posture check reminder every 2 hours'
      ]);
    }, 3000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return '💊';
      case 'exercise': return '🏃‍♂️';
      case 'checkup': return '🩺';
      case 'wellness': return '🧘‍♀️';
      case 'nutrition': return '🥗';
      default: return '⚡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#FF4444';
      case 'high': return '#FF8800';
      case 'medium': return '#FFA500';
      case 'low': return '#FFD700';
      default: return '#FFA500';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`smart-reminders-container ${theme}`}>
        <div className="auth-required">
          <div className="neural-grid"></div>
          <div className="auth-message">
            <div className="auth-icon">🔒</div>
            <h2>Neural Access Required</h2>
            <p>Connect to your health profile to activate AI-powered smart reminders</p>
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
    <div className={`smart-reminders-container ${theme}`}>
      {/* Neural Background */}
      <div className="neural-background">
        <div className="neural-grid"></div>
        <div className="data-streams"></div>
      </div>

      {/* Header Section */}
      <div className="reminders-header">
        <div className="header-content">
          <div className="title-section">
            <div className="title-icon">⚡</div>
            <div className="title-text">
              <h1 className="page-title">
                NEURAL REMINDERS
                <div className="powered-by-inline">
                  <span className="powered-by-text">powered by</span>
                  <img src="/logo/logo.png" alt="Buddy Your Health Logo" className="company-logo" />
                </div>
              </h1>
              <p className="page-subtitle">AI-Powered Health Intelligence System</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="theme-buttons-container">
              <button 
                className={`theme-btn ${theme === 'light' ? 'active' : 'inactive'}`}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                LIGHT
              </button>
              <button 
                className={`theme-btn ${theme === 'dark' ? 'active' : 'inactive'}`}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                DARK
              </button>
            </div>
            
            <div className="nav-dropdown-container">
              <button 
                className="nav-dropdown-trigger"
                onClick={() => setShowNavDropdown(!showNavDropdown)}
              >
                <span className="nav-icon">☰</span>
                <span className="nav-text">MENU</span>
              </button>
              
              {showNavDropdown && (
                <div className="nav-dropdown-menu">
                  <div className="nav-dropdown-item" onClick={() => navigate('/loading/home')}>
                    <span className="nav-item-icon">◆</span>
                    <span className="nav-item-text">Home</span>
                  </div>
                  <div className="nav-dropdown-divider"></div>
                  <div className="nav-dropdown-item sign-out" onClick={() => {
                    logout();
                    navigate('/');
                  }}>
                    <span className="nav-item-icon">◉</span>
                    <span className="nav-item-text">Sign Out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="header-actions">
          <button 
            className="ai-analyze-btn"
            onClick={handleAiAnalysis}
            disabled={isAiAnalyzing}
          >
            <span className="btn-icon">◈</span>
            {isAiAnalyzing ? 'ANALYZING...' : 'AI ANALYSIS'}
          </button>
          <button 
            className="add-reminder-btn"
            onClick={() => setShowAddForm(true)}
          >
            <span className="btn-icon">+</span>
            NEW REMINDER
          </button>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      {aiSuggestions.length > 0 && (
        <div className="ai-suggestions-panel">
          <div className="panel-header">
            <span className="panel-icon">🤖</span>
            <h3>AI HEALTH INSIGHTS</h3>
          </div>
          <div className="suggestions-list">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <div className="suggestion-pulse"></div>
                <span className="suggestion-text">{suggestion}</span>
                <button className="suggestion-action">APPLY</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminders Grid */}
      <div className="reminders-content">
        <div className="reminders-grid">
          {reminders.map((reminder) => (
            <div key={reminder.id} className={`reminder-card ${reminder.isActive ? 'active' : 'inactive'} ${reminder.aiGenerated ? 'ai-generated' : ''}`}>
              {reminder.aiGenerated && (
                <div className="ai-badge">
                  <span>AI</span>
                </div>
              )}
              
              <div className="card-header">
                <div className="priority-indicator" style={{ backgroundColor: getPriorityColor(reminder.priority) }}></div>
                <div className="reminder-info">
                  <span className="category-icon">{getCategoryIcon(reminder.category)}</span>
                  <div className="reminder-details">
                    <h3 className="reminder-title">{reminder.title}</h3>
                    <p className="reminder-description">{reminder.description}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button className={`toggle-btn ${reminder.isActive ? 'active' : 'inactive'}`}>
                    {reminder.isActive ? '🔔' : '🔕'}
                  </button>
                </div>
              </div>
              
              <div className="card-schedule">
                <div className="schedule-grid">
                  <div className="schedule-item">
                    <span className="schedule-label">TIME</span>
                    <span className="schedule-value">{reminder.time}</span>
                  </div>
                  <div className="schedule-item">
                    <span className="schedule-label">FREQ</span>
                    <span className="schedule-value">{reminder.frequency.toUpperCase()}</span>
                  </div>
                  <div className="schedule-item">
                    <span className="schedule-label">PRIORITY</span>
                    <span className="schedule-value" style={{ color: getPriorityColor(reminder.priority) }}>
                      {reminder.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {reminder.isActive && (
                <div className="next-reminder">
                  <div className="countdown-display">
                    <span className="countdown-label">NEXT ACTIVATION</span>
                    <span className="countdown-time">
                      {reminder.nextReminder.toLocaleDateString()} • {reminder.time}
                    </span>
                  </div>
                </div>
              )}

              <div className="card-glow"></div>
            </div>
          ))}
        </div>

        {reminders.length === 0 && (
          <div className="empty-state">
            <div className="empty-animation">
              <div className="neural-pulse"></div>
              <div className="empty-icon">⚡</div>
            </div>
            <h3>NEURAL NETWORK READY</h3>
            <p>Initialize your first AI-powered health reminder to begin optimization</p>
            <button 
              className="initialize-btn"
              onClick={() => setShowAddForm(true)}
            >
              <span className="btn-glow"></span>
              INITIALIZE SYSTEM
            </button>
          </div>
        )}
      </div>

      {/* AI Stats Panel */}
      <div className="ai-stats-panel">
        <div className="stats-header">
          <span className="stats-icon">📊</span>
          <h3>SYSTEM METRICS</h3>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">95%</span>
            <span className="stat-label">ADHERENCE</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">12</span>
            <span className="stat-label">ACTIVE</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3.2x</span>
            <span className="stat-label">EFFICIENCY</span>
          </div>
        </div>
      </div>
    </div>
  );
}