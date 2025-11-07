import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import aiService from '../services/aiService';
import calendarService from '../services/calendarService';
import TimePickerModal from './TimePickerModal';
import NewReminderModal, { NewReminderData } from './NewReminderModal';
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
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [appliedInsights, setAppliedInsights] = useState<Set<number>>(new Set());
  const [applyMessage, setApplyMessage] = useState('');
  const [deletingReminder, setDeletingReminder] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [selectedInsightIndex, setSelectedInsightIndex] = useState<number>(-1);

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

  // Load AI Health Insights
  const loadAIInsights = async () => {
    setIsLoadingInsights(true);
    
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // For now, use mock data with randomization. Replace with real AI call when AWS credentials are configured
      const mockInsights = generateRandomizedInsights();
      console.log('Generated new AI insights:', mockInsights);
      setAiInsights(mockInsights);
      
      // Uncomment below when AWS credentials are configured:
      // const response = await aiService.generateHealthInsights({
      //   activityLevel: 'moderate',
      //   sleepQuality: 'good',
      //   stressLevel: 'low',
      //   nutritionScore: 'fair'
      // });
      // setAiInsights(response.insights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
      // Fallback to mock data
      const mockInsights = aiService.getMockHealthInsights();
      setAiInsights(mockInsights.insights);
    } finally {
      setIsLoadingInsights(false);
      setAppliedInsights(new Set()); // Reset applied insights when new ones are loaded
      setRefreshMessage('✨ New insights generated!');
      setTimeout(() => setRefreshMessage(''), 3000);
    }
  };

  // Generate randomized insights for demo purposes
  const generateRandomizedInsights = () => {
    const insightPool = [
      {
        title: "Optimize Your Hydration",
        description: "Based on your activity level, aim for 10-12 glasses of water daily. Consider adding electrolytes after workouts to maintain optimal hydration balance.",
        priority: "high",
        category: "hydration"
      },
      {
        title: "Enhance Sleep Recovery",
        description: "Your sleep quality could benefit from a consistent bedtime routine. Try dimming lights 1 hour before bed and avoiding screens to improve deep sleep phases.",
        priority: "high",
        category: "sleep"
      },
      {
        title: "Boost Nutritional Variety",
        description: "Incorporate more colorful vegetables into your meals. Aim for 5 different colored fruits and vegetables daily to maximize nutrient diversity.",
        priority: "medium",
        category: "nutrition"
      },
      {
        title: "Increase Daily Movement",
        description: "Add 2-3 short walking breaks throughout your day. Even 5-minute walks can significantly improve circulation and energy levels.",
        priority: "medium",
        category: "exercise"
      },
      {
        title: "Stress Management Focus",
        description: "Consider implementing a 10-minute daily meditation practice. Deep breathing exercises can reduce cortisol levels and improve mental clarity.",
        priority: "high",
        category: "stress"
      },
      {
        title: "Vitamin D Optimization",
        description: "Your indoor lifestyle suggests potential vitamin D deficiency. Consider 15 minutes of morning sunlight or a quality supplement.",
        priority: "medium",
        category: "general"
      },
      {
        title: "Posture Improvement",
        description: "Set hourly reminders to check and correct your posture. Poor posture can lead to back pain and reduced energy levels.",
        priority: "low",
        category: "exercise"
      },
      {
        title: "Meal Timing Optimization",
        description: "Try eating your largest meal earlier in the day. This can improve digestion and support better sleep quality.",
        priority: "medium",
        category: "nutrition"
      }
    ];

    // Randomly select 3 insights
    const shuffled = insightPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Load AI Smart Reminders
  const loadAIReminders = async () => {
    setIsAiAnalyzing(true);
    try {
      // For now, use mock data. Replace with real AI call when AWS credentials are configured
      const mockReminders = aiService.getMockSmartReminders();
      
      // Convert AI reminders to our Reminder format
      const aiReminders: Reminder[] = mockReminders.reminders.map((reminder: any, index: number) => ({
        id: `ai-${index + 1}`,
        title: reminder.title,
        description: reminder.description,
        time: reminder.time,
        frequency: reminder.frequency as 'daily' | 'weekly' | 'monthly' | 'custom',
        category: reminder.category as 'medication' | 'exercise' | 'checkup' | 'wellness' | 'nutrition',
        isActive: true,
        nextReminder: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000),
        aiGenerated: true,
        priority: reminder.priority as 'low' | 'medium' | 'high' | 'critical'
      }));
      
      setReminders(aiReminders);
      
      // Uncomment below when AWS credentials are configured:
      // const response = await aiService.generateSmartReminders({
      //   schedule: 'standard work hours',
      //   focusAreas: ['hydration', 'exercise', 'nutrition', 'sleep']
      // });
      // const aiReminders: Reminder[] = response.reminders.map((reminder: any, index: number) => ({
      //   id: `ai-${index + 1}`,
      //   title: reminder.title,
      //   description: reminder.description,
      //   time: reminder.time,
      //   frequency: reminder.frequency,
      //   category: reminder.category,
      //   isActive: true,
      //   nextReminder: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000),
      //   aiGenerated: true,
      //   priority: reminder.priority
      // }));
      // setReminders(aiReminders);
    } catch (error) {
      console.error('Error loading AI reminders:', error);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Sample AI-generated reminders
  useEffect(() => {
    if (isAuthenticated) {
      // Don't auto-load - let users initialize the system manually
      // loadAIInsights();
      // loadAIReminders();
      // Don't load sample data automatically - let users initialize the system
      // const sampleReminders: Reminder[] = [...];
      // setReminders(sampleReminders);
      
      // Don't auto-load AI suggestions - they'll be loaded during initialization
      // setAiSuggestions([...]);
    }
  }, [isAuthenticated]);

  const handleApplyInsight = (insight: any, index: number) => {
    // Check if already applied
    if (appliedInsights.has(index)) {
      setApplyMessage('⚠️ This insight has already been applied!');
      setTimeout(() => setApplyMessage(''), 3000);
      return;
    }

    // Open time picker modal
    setSelectedInsight(insight);
    setSelectedInsightIndex(index);
    setShowTimePicker(true);
  };

  const handleTimePickerConfirm = (time: string, addToCalendar: boolean, calendarType?: string) => {
    if (!selectedInsight || selectedInsightIndex === -1) return;

    const insight = selectedInsight;
    const index = selectedInsightIndex;

    // Convert insight to a reminder
    const newReminder: Reminder = {
      id: `insight-${Date.now()}-${index}`,
      title: `💡 ${insight.title}`,
      description: `AI Insight: ${insight.description}`,
      time: time,
      frequency: 'daily',
      category: insight.category === 'hydration' ? 'wellness' : 
                insight.category === 'general' ? 'wellness' : 
                insight.category === 'stress' ? 'wellness' :
                insight.category as 'medication' | 'exercise' | 'checkup' | 'wellness' | 'nutrition',
      isActive: true,
      nextReminder: new Date(Date.now() + 24 * 60 * 60 * 1000),
      aiGenerated: true,
      priority: insight.priority as 'low' | 'medium' | 'high' | 'critical'
    };

    // Add to reminders
    setReminders(prev => [...prev, newReminder]);
    
    // Mark as applied
    setAppliedInsights(prev => new Set(Array.from(prev).concat(index)));

    // Handle calendar integration
    if (addToCalendar && calendarType) {
      const calendarEvent = calendarService.createEventFromReminder(
        newReminder.title,
        newReminder.description,
        newReminder.time,
        newReminder.frequency,
        newReminder.category,
        newReminder.priority
      );

      try {
        switch (calendarType) {
          case 'google':
            calendarService.addToGoogleCalendar(calendarEvent);
            setApplyMessage(`✅ "${insight.title}" added at ${time} & exported to Google Calendar!`);
            break;
          case 'outlook':
            calendarService.addToOutlookCalendar(calendarEvent);
            setApplyMessage(`✅ "${insight.title}" added at ${time} & exported to Outlook Calendar!`);
            break;
          case 'ics':
            calendarService.downloadICS(calendarEvent, `neural-reminder-${Date.now()}.ics`);
            setApplyMessage(`✅ "${insight.title}" added at ${time} & calendar file downloaded!`);
            break;
        }
      } catch (error) {
        console.error('Calendar export error:', error);
        setApplyMessage(`✅ "${insight.title}" added at ${time} (calendar export failed)`);
      }
    } else {
      setApplyMessage(`✅ "${insight.title}" added as a ${time} reminder!`);
    }
    
    setTimeout(() => setApplyMessage(''), 5000);
    
    console.log('Applied insight as reminder:', insight.title, 'at', time);
    
    // Reset selection
    setSelectedInsight(null);
    setSelectedInsightIndex(-1);
  };

  const handleDeleteReminder = (reminderId: string, reminderTitle: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${reminderTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) {
      return;
    }
    
    // Set deleting state for animation
    setDeletingReminder(reminderId);
    
    // Remove the reminder after a short delay for animation
    setTimeout(() => {
      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
      setDeletingReminder(null);
    }, 300);
    
    // Show success message
    setApplyMessage(`🗑️ "${reminderTitle}" has been deleted`);
    setTimeout(() => setApplyMessage(''), 3000);
    
    console.log('Deleted reminder:', reminderTitle);
  };

  const handleInitializeSystem = async () => {
    setIsInitializing(true);
    setApplyMessage('🚀 Initializing Neural Health System...');
    
    try {
      // Step 1: Generate AI insights (with delay for effect)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApplyMessage('🧠 Analyzing your health profile...');
      
      await loadAIInsights();
      
      // Step 2: Generate initial reminders
      await new Promise(resolve => setTimeout(resolve, 800));
      setApplyMessage('⚡ Creating personalized reminders...');
      
      await loadAIReminders();
      
      // Step 3: Complete initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      setApplyMessage('✅ Neural Health System initialized successfully!');
      
      setTimeout(() => setApplyMessage(''), 4000);
      
    } catch (error) {
      console.error('Initialization error:', error);
      setApplyMessage('❌ Initialization failed. Please try again.');
      setTimeout(() => setApplyMessage(''), 3000);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setApplyMessage('✅ AI analysis complete! Check insights panel for recommendations.');
      setTimeout(() => setApplyMessage(''), 3000);
    }, 3000);
  };

  const handleNewReminderSubmit = (data: NewReminderData) => {
    // Create new reminder
    const newReminder: Reminder = {
      id: `custom-${Date.now()}`,
      title: data.title,
      description: data.description,
      time: data.time,
      frequency: data.frequency,
      category: data.category,
      isActive: true,
      nextReminder: new Date(Date.now() + 24 * 60 * 60 * 1000),
      aiGenerated: false,
      priority: data.priority
    };

    // Add to reminders
    setReminders(prev => [...prev, newReminder]);

    // Handle calendar integration
    if (data.addToCalendar && data.calendarType) {
      const calendarEvent = calendarService.createEventFromReminder(
        newReminder.title,
        newReminder.description,
        newReminder.time,
        newReminder.frequency,
        newReminder.category,
        newReminder.priority
      );

      try {
        switch (data.calendarType) {
          case 'google':
            calendarService.addToGoogleCalendar(calendarEvent);
            setApplyMessage(`✅ "${data.title}" created & exported to Google Calendar!`);
            break;
          case 'outlook':
            calendarService.addToOutlookCalendar(calendarEvent);
            setApplyMessage(`✅ "${data.title}" created & exported to Outlook Calendar!`);
            break;
          case 'ics':
            calendarService.downloadICS(calendarEvent, `${data.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`);
            setApplyMessage(`✅ "${data.title}" created & calendar file downloaded!`);
            break;
        }
      } catch (error) {
        console.error('Calendar export error:', error);
        setApplyMessage(`✅ "${data.title}" created successfully!`);
      }
    } else {
      setApplyMessage(`✅ "${data.title}" created successfully!`);
    }

    setTimeout(() => setApplyMessage(''), 5000);
    console.log('Created new reminder:', data.title);
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

      {/* AI Health Insights Panel */}
      <div className="ai-suggestions-panel">
        <div className="panel-header">
          <span className="panel-icon">🤖</span>
          <h3>AI HEALTH INSIGHTS</h3>
          {isLoadingInsights && <span className="loading-indicator">Analyzing...</span>}
        </div>
        <div className="suggestions-list">
          {isLoadingInsights ? (
            <div className="suggestion-item">
              <div className="suggestion-pulse"></div>
              <span className="suggestion-text">AI is analyzing your health data...</span>
              <button className="suggestion-action" disabled>LOADING</button>
            </div>
          ) : (
            aiInsights.map((insight, index) => (
              <div key={index} className={`suggestion-item ${appliedInsights.has(index) ? 'applied' : ''}`}>
                <div className="suggestion-pulse"></div>
                <div className="suggestion-content">
                  <div className="suggestion-title">{insight.title}</div>
                  <span className="suggestion-text">{insight.description}</span>
                  <div className="suggestion-meta">
                    <span className={`priority-badge ${insight.priority}`}>{insight.priority.toUpperCase()}</span>
                    <span className="category-badge">{insight.category}</span>
                  </div>
                </div>
                <button 
                  className={`suggestion-action ${appliedInsights.has(index) ? 'applied' : ''}`}
                  onClick={() => handleApplyInsight(insight, index)}
                  disabled={appliedInsights.has(index)}
                >
                  {appliedInsights.has(index) ? '✓ APPLIED' : 'APPLY'}
                </button>
              </div>
            ))
          )}
        </div>
        <div className="ai-actions">
          <button 
            className="refresh-insights-btn"
            onClick={loadAIInsights}
            disabled={isLoadingInsights}
          >
            {isLoadingInsights ? (
              <>
                <span className="spinning">🔄</span> Generating Insights...
              </>
            ) : (
              <>
                🔄 Refresh Insights
              </>
            )}
          </button>
          {refreshMessage && (
            <div className="refresh-message">
              {refreshMessage}
            </div>
          )}
          {applyMessage && (
            <div className="apply-message">
              {applyMessage}
            </div>
          )}
        </div>
      </div>

      {/* Reminders Grid */}
      <div className="reminders-content">
        <div className="reminders-grid">
          {reminders.map((reminder) => (
            <div key={reminder.id} className={`reminder-card ${reminder.isActive ? 'active' : 'inactive'} ${reminder.aiGenerated ? 'ai-generated' : ''} ${deletingReminder === reminder.id ? 'deleting' : ''}`}>
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
                  <button 
                    className="calendar-export-btn"
                    onClick={() => {
                      const event = calendarService.createEventFromReminder(
                        reminder.title,
                        reminder.description,
                        reminder.time,
                        reminder.frequency,
                        reminder.category,
                        reminder.priority
                      );
                      calendarService.downloadICS(event, `${reminder.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`);
                      setApplyMessage(`📥 Calendar file downloaded for "${reminder.title}"!`);
                      setTimeout(() => setApplyMessage(''), 3000);
                    }}
                    title="Export to calendar"
                  >
                    📅
                  </button>
                  <button className={`toggle-btn ${reminder.isActive ? 'active' : 'inactive'}`}>
                    {reminder.isActive ? '🔔' : '🔕'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteReminder(reminder.id, reminder.title)}
                    title="Delete this reminder"
                  >
                    🗑️
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
            <h3>{isInitializing ? 'SYSTEM INITIALIZING...' : 'NEURAL NETWORK READY'}</h3>
            <p>
              {isInitializing 
                ? 'AI is analyzing your health profile and creating personalized reminders...'
                : 'Initialize your first AI-powered health reminder to begin optimization'
              }
            </p>
            <button 
              className="initialize-btn"
              onClick={handleInitializeSystem}
              disabled={isInitializing}
            >
              <span className="btn-glow"></span>
              {isInitializing ? (
                <>
                  <span className="spinning">⚡</span> INITIALIZING...
                </>
              ) : (
                'INITIALIZE SYSTEM'
              )}
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
            <span className="stat-value">{reminders.length}</span>
            <span className="stat-label">ACTIVE</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3.2x</span>
            <span className="stat-label">EFFICIENCY</span>
          </div>
        </div>
      </div>

      {/* Time Picker Modal */}
      <TimePickerModal
        isOpen={showTimePicker}
        onClose={() => {
          setShowTimePicker(false);
          setSelectedInsight(null);
          setSelectedInsightIndex(-1);
        }}
        onConfirm={handleTimePickerConfirm}
        insightTitle={selectedInsight?.title || ''}
        defaultTime={selectedInsight?.category === 'hydration' ? '08:00' :
                     selectedInsight?.category === 'exercise' ? '17:00' :
                     selectedInsight?.category === 'nutrition' ? '12:00' :
                     selectedInsight?.category === 'sleep' ? '21:00' :
                     selectedInsight?.category === 'stress' ? '15:00' : '09:00'}
      />

      {/* New Reminder Modal */}
      <NewReminderModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleNewReminderSubmit}
      />
    </div>
  );
}