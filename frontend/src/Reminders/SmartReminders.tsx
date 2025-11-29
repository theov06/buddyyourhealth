import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import aiService from '../services/aiService';
import calendarService from '../services/calendarService';
import TimePickerModal from './TimePickerModal';
import NewReminderModal, { NewReminderData } from './NewReminderModal';
import DailyTrackerModal from './DailyTrackerModal';
import jsPDF from 'jspdf';
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
  const [showDailyTracker, setShowDailyTracker] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
  // Load health data from API
  const loadHealthData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      // Fetch health data from backend
      const response = await fetch('http://localhost:3001/api/health/data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          return data.data;
        }
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
    return null;
  };

  // Generate insights based on user's health data
  const loadPersonalizedInsights = async () => {
    setIsLoadingInsights(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      let healthData = await loadHealthData();
      let usingSampleData = false;
      
      // If no health data, use sample data
      if (!healthData || healthData.length === 0) {
        healthData = getSampleHealthMetrics();
        usingSampleData = true;
      }
      
      // Convert health data array to metrics object
      const metricsObj = convertHealthDataToMetrics(healthData);
      
      // Generate insights based on health data
      const personalizedInsights = generatePersonalizedInsights(metricsObj);
      console.log('Generated personalized AI insights:', personalizedInsights);
      setAiInsights(personalizedInsights);
      
      if (usingSampleData) {
        setRefreshMessage('✨ Insights generated from sample health data. Upload your data in Neural Health for personalized insights!');
      } else {
        setRefreshMessage('✨ Personalized insights generated from your health data!');
      }
    } catch (error) {
      console.error('Error loading personalized insights:', error);
      setRefreshMessage('❌ Failed to generate personalized insights');
    } finally {
      setIsLoadingInsights(false);
      setAppliedInsights(new Set());
      setTimeout(() => setRefreshMessage(''), 5000);
    }
  };

  // Get sample health metrics for demo
  const getSampleHealthMetrics = () => {
    return [
      { type: 'Blood Pressure Systolic', value: 128, unit: 'mmHg', timestamp: new Date().toISOString() },
      { type: 'Blood Pressure Diastolic', value: 82, unit: 'mmHg', timestamp: new Date().toISOString() },
      { type: 'Heart Rate', value: 72, unit: 'bpm', timestamp: new Date().toISOString() },
      { type: 'Blood Glucose', value: 95, unit: 'mg/dL', timestamp: new Date().toISOString() },
      { type: 'Weight', value: 75, unit: 'kg', timestamp: new Date().toISOString() },
      { type: 'Height', value: 175, unit: 'cm', timestamp: new Date().toISOString() },
      { type: 'Steps', value: 6500, unit: 'steps', timestamp: new Date().toISOString() }
    ];
  };

  // Convert health data array to metrics object
  const convertHealthDataToMetrics = (healthData: any[]) => {
    const metrics: any = {};
    
    healthData.forEach((item: any) => {
      const type = item.type?.toLowerCase() || '';
      
      if (type.includes('blood') && type.includes('pressure')) {
        if (type.includes('systolic')) {
          metrics.bloodPressureSystolic = item.value;
        } else if (type.includes('diastolic')) {
          metrics.bloodPressureDiastolic = item.value;
        }
      } else if (type.includes('heart') && type.includes('rate')) {
        metrics.heartRate = item.value;
      } else if (type.includes('glucose') || type.includes('blood') && type.includes('sugar')) {
        metrics.bloodGlucose = item.value;
      } else if (type.includes('weight') || type.includes('body') && type.includes('mass')) {
        metrics.weight = item.value;
      } else if (type.includes('height')) {
        metrics.height = item.value;
      } else if (type.includes('step')) {
        metrics.steps = item.value;
      }
    });
    
    return metrics;
  };

  // Generate general health insights
  const loadGeneralInsights = async () => {
    setIsLoadingInsights(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const mockInsights = generateRandomizedInsights();
      console.log('Generated general AI insights:', mockInsights);
      setAiInsights(mockInsights);
      setRefreshMessage('✨ General health insights generated!');
    } catch (error) {
      console.error('Error loading general insights:', error);
      const mockInsights = aiService.getMockHealthInsights();
      setAiInsights(mockInsights.insights);
      setRefreshMessage('✨ Insights generated!');
    } finally {
      setIsLoadingInsights(false);
      setAppliedInsights(new Set());
      setTimeout(() => setRefreshMessage(''), 3000);
    }
  };

  // Generate personalized insights based on health data
  const generatePersonalizedInsights = (metrics: any) => {
    const insights: any[] = [];
    
    // Analyze blood pressure
    if (metrics.bloodPressureSystolic && metrics.bloodPressureDiastolic) {
      const systolic = parseFloat(metrics.bloodPressureSystolic);
      const diastolic = parseFloat(metrics.bloodPressureDiastolic);
      
      if (systolic > 130 || diastolic > 80) {
        insights.push({
          title: "Blood Pressure Management",
          description: `Your blood pressure (${systolic}/${diastolic}) is elevated. Consider reducing sodium intake, increasing physical activity, and managing stress. Consult your doctor for personalized advice.`,
          priority: "high",
          category: "wellness"
        });
      }
    }
    
    // Analyze heart rate
    if (metrics.heartRate) {
      const hr = parseFloat(metrics.heartRate);
      if (hr > 100) {
        insights.push({
          title: "Heart Rate Monitoring",
          description: `Your resting heart rate (${hr} bpm) is elevated. Focus on stress reduction, adequate sleep, and regular cardiovascular exercise to improve heart health.`,
          priority: "medium",
          category: "exercise"
        });
      } else if (hr < 60 && hr > 40) {
        insights.push({
          title: "Excellent Heart Health",
          description: `Your resting heart rate (${hr} bpm) indicates good cardiovascular fitness. Maintain your current exercise routine and healthy lifestyle.`,
          priority: "low",
          category: "exercise"
        });
      }
    }
    
    // Analyze blood glucose
    if (metrics.bloodGlucose) {
      const glucose = parseFloat(metrics.bloodGlucose);
      if (glucose > 100) {
        insights.push({
          title: "Blood Sugar Management",
          description: `Your blood glucose (${glucose} mg/dL) is elevated. Focus on balanced meals, reduce refined carbs, increase fiber intake, and maintain regular physical activity.`,
          priority: "high",
          category: "nutrition"
        });
      }
    }
    
    // Analyze weight and BMI
    if (metrics.weight && metrics.height) {
      const weight = parseFloat(metrics.weight);
      const height = parseFloat(metrics.height) / 100; // convert cm to m
      const bmi = weight / (height * height);
      
      if (bmi > 25) {
        insights.push({
          title: "Weight Management Focus",
          description: `Your BMI (${bmi.toFixed(1)}) suggests focusing on balanced nutrition and regular exercise. Aim for 150 minutes of moderate activity weekly and a calorie-controlled diet.`,
          priority: "medium",
          category: "wellness"
        });
      }
    }
    
    // Analyze steps
    if (metrics.steps) {
      const steps = parseFloat(metrics.steps);
      if (steps < 5000) {
        insights.push({
          title: "Increase Daily Movement",
          description: `Your daily steps (${steps}) are below recommended levels. Aim for 7,000-10,000 steps daily. Try short walking breaks every hour and take stairs when possible.`,
          priority: "medium",
          category: "exercise"
        });
      } else if (steps > 10000) {
        insights.push({
          title: "Excellent Activity Level",
          description: `Great job! You're achieving ${steps} steps daily. Maintain this activity level and consider adding strength training for balanced fitness.`,
          priority: "low",
          category: "exercise"
        });
      }
    }
    
    // If no specific insights, add general wellness tips
    if (insights.length === 0) {
      insights.push({
        title: "Maintain Healthy Habits",
        description: "Your health metrics look good! Continue with regular check-ups, balanced nutrition, adequate sleep (7-9 hours), and consistent physical activity.",
        priority: "low",
        category: "wellness"
      });
    }
    
    // Limit to 3 insights
    return insights.slice(0, 3);
  };

  // Generate randomized insights for demo purposes
  const generateRandomizedInsights = () => {
    const insightPool = [
      {
        title: "Optimize Your Hydration",
        description: "Aim for 8-10 glasses of water daily for optimal health. Increase intake during physical activity and warm weather to maintain proper hydration.",
        priority: "high",
        category: "hydration"
      },
      {
        title: "Enhance Sleep Quality",
        description: "Establish a consistent bedtime routine for better rest. Try dimming lights 1 hour before bed and avoiding screens to improve sleep quality.",
        priority: "high",
        category: "sleep"
      },
      {
        title: "Boost Nutritional Variety",
        description: "Incorporate more colorful vegetables into your meals. Aim for 5 different colored fruits and vegetables daily to maximize nutrient diversity and health benefits.",
        priority: "medium",
        category: "nutrition"
      },
      {
        title: "Increase Daily Movement",
        description: "Add 2-3 short walking breaks throughout your day. Even 5-minute walks can significantly improve circulation, energy levels, and overall health.",
        priority: "medium",
        category: "exercise"
      },
      {
        title: "Practice Stress Management",
        description: "Consider implementing a 10-minute daily meditation or deep breathing practice. Regular stress management can improve mental clarity and overall wellbeing.",
        priority: "high",
        category: "stress"
      },
      {
        title: "Vitamin D Awareness",
        description: "Many people have insufficient vitamin D levels. Consider 15-20 minutes of morning sunlight exposure or consult your doctor about supplementation.",
        priority: "medium",
        category: "general"
      },
      {
        title: "Posture Check Reminder",
        description: "Set regular reminders to check and correct your posture throughout the day. Good posture can prevent back pain and improve energy levels.",
        priority: "low",
        category: "exercise"
      },
      {
        title: "Meal Timing Strategy",
        description: "Consider eating larger meals earlier in the day when your metabolism is more active. This can improve digestion and support better sleep quality at night.",
        priority: "medium",
        category: "nutrition"
      },
      {
        title: "Protein Intake Focus",
        description: "Ensure adequate protein intake throughout the day. Aim for 0.8-1g per kg of body weight to support muscle maintenance and overall health.",
        priority: "medium",
        category: "nutrition"
      },
      {
        title: "Active Recovery Days",
        description: "Include light activity on rest days such as walking, stretching, or yoga. Active recovery can improve circulation and reduce muscle soreness.",
        priority: "low",
        category: "exercise"
      },
      {
        title: "Mindful Eating Practice",
        description: "Take time to eat slowly and without distractions. Mindful eating can improve digestion, help with portion control, and increase meal satisfaction.",
        priority: "medium",
        category: "nutrition"
      },
      {
        title: "Consistent Exercise Schedule",
        description: "Aim for at least 150 minutes of moderate activity per week. Consistency is key for building sustainable fitness habits and seeing long-term results.",
        priority: "high",
        category: "exercise"
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
      
      const token = localStorage.getItem('authToken');
      const savedReminders: Reminder[] = [];

      // Save each reminder to backend
      for (const reminder of mockReminders.reminders) {
        try {
          console.log('📤 Sending reminder to backend:', reminder);
          
          const response = await fetch('http://localhost:3001/api/reminders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: reminder.title,
              description: reminder.description,
              time: reminder.time,
              frequency: reminder.frequency,
              category: reminder.category,
              priority: reminder.priority
            })
          });

          console.log('📡 Response status:', response.status);
          const data = await response.json();
          console.log('📦 Response data:', data);

          if (data.success && data.reminder) {
            savedReminders.push({
              id: data.reminder.id,
              title: data.reminder.title,
              description: data.reminder.description,
              time: data.reminder.time,
              frequency: data.reminder.frequency as 'daily' | 'weekly' | 'monthly' | 'custom',
              category: data.reminder.category as 'medication' | 'exercise' | 'checkup' | 'wellness' | 'nutrition',
              isActive: true,
              nextReminder: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000),
              aiGenerated: true,
              priority: data.reminder.priority as 'low' | 'medium' | 'high' | 'critical'
            });
            console.log('✅ Reminder saved successfully');
          } else {
            console.error('❌ Failed to save reminder:', data.message);
          }
        } catch (error) {
          console.error('❌ Error saving reminder:', error);
        }
      }
      
      setReminders(savedReminders);
      
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
  // Load reminders from API
  useEffect(() => {
    if (isAuthenticated) {
      loadUserReminders();
    }
  }, [isAuthenticated]);

  const loadUserReminders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('📥 Loading reminders... Token exists:', !!token);
      
      const response = await fetch('http://localhost:3001/api/reminders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Load reminders response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Load reminders response data:', data);
      
      if (data.success && data.reminders) {
        // Convert API reminders to component format
        const loadedReminders: Reminder[] = data.reminders.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          time: r.time,
          frequency: r.frequency,
          category: r.category,
          isActive: r.isActive,
          nextReminder: new Date(),
          aiGenerated: r.aiGenerated,
          priority: r.priority
        }));
        
        setReminders(loadedReminders);
        console.log('✅ Loaded reminders:', loadedReminders.map(r => ({ id: r.id, title: r.title })));
      } else {
        console.error('❌ Failed to load reminders:', data.message);
      }
    } catch (error) {
      console.error('❌ Error loading reminders:', error);
    }
  };

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

  const handleTimePickerConfirm = async (time: string, addToCalendar: boolean, calendarType?: string) => {
    if (!selectedInsight || selectedInsightIndex === -1) return;

    const insight = selectedInsight;
    const index = selectedInsightIndex;

    // Save reminder to backend first
    let newReminder: Reminder | null = null;
    
    try {
      const token = localStorage.getItem('authToken');
      const reminderData = {
        title: `💡 ${insight.title}`,
        description: `AI Insight: ${insight.description}`,
        time: time,
        frequency: 'daily',
        category: insight.category === 'hydration' ? 'wellness' : 
                  insight.category === 'general' ? 'wellness' : 
                  insight.category === 'stress' ? 'wellness' :
                  insight.category,
        priority: insight.priority
      };

      const response = await fetch('http://localhost:3001/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reminderData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save reminder');
      }

      // Convert backend reminder to frontend format
      newReminder = {
        id: data.reminder.id,
        title: data.reminder.title,
        description: data.reminder.description,
        time: data.reminder.time,
        frequency: data.reminder.frequency as 'daily' | 'weekly' | 'monthly' | 'custom',
        category: data.reminder.category as 'medication' | 'exercise' | 'checkup' | 'wellness' | 'nutrition',
        isActive: true,
        nextReminder: new Date(Date.now() + 24 * 60 * 60 * 1000),
        aiGenerated: true,
        priority: data.reminder.priority as 'low' | 'medium' | 'high' | 'critical'
      };

      // Add to reminders
      setReminders(prev => [...prev, newReminder!]);
    } catch (error) {
      console.error('Error saving reminder:', error);
      setApplyMessage(`❌ Failed to save reminder: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setApplyMessage(''), 3000);
      return;
    }
    
    // Mark as applied
    setAppliedInsights(prev => new Set(Array.from(prev).concat(index)));

    // Handle calendar integration
    if (addToCalendar && calendarType && newReminder) {
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
            setApplyMessage(`✅ "${insight.title}" added at ${time} & opening Google Calendar!`);
            break;
          case 'outlook':
            calendarService.addToOutlookCalendar(calendarEvent);
            setApplyMessage(`✅ "${insight.title}" added at ${time} & opening Outlook Calendar!`);
            break;
          default:
            calendarService.addToGoogleCalendar(calendarEvent);
            setApplyMessage(`✅ "${insight.title}" added at ${time} & opening Google Calendar!`);
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

  const handleDeleteReminder = async (reminderId: string, reminderTitle: string) => {
    // Set deleting state for animation
    setDeletingReminder(reminderId);
    
    try {
      const token = localStorage.getItem('authToken');
      console.log('🗑️ Attempting to delete reminder:', { reminderId, reminderTitle, hasToken: !!token });
      
      const response = await fetch(`http://localhost:3001/api/reminders/${reminderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Delete response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Delete response data:', data);
      
      if (data.success) {
        // Remove the reminder after a short delay for animation
        setTimeout(() => {
          setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
          setDeletingReminder(null);
        }, 300);
        
        // Show success message
        setApplyMessage(`🗑️ "${reminderTitle}" has been deleted`);
        setTimeout(() => setApplyMessage(''), 3000);
        
        console.log('✅ Deleted reminder:', reminderTitle);
      } else {
        console.error('❌ Delete failed:', data.message);
        setDeletingReminder(null);
        setApplyMessage(`❌ Failed to delete reminder: ${data.message || 'Unknown error'}`);
        setTimeout(() => setApplyMessage(''), 3000);
      }
    } catch (error) {
      console.error('❌ Error deleting reminder:', error);
      setDeletingReminder(null);
      setApplyMessage(`❌ Failed to delete reminder: ${error instanceof Error ? error.message : 'Network error'}`);
      setTimeout(() => setApplyMessage(''), 3000);
    }
  };

  const handleInitializeSystem = async () => {
    setIsInitializing(true);
    setApplyMessage('🚀 Initializing Neural Health System...');
    
    try {
      // Only load insights if they don't exist yet
      if (aiInsights.length === 0) {
        await loadGeneralInsights();
      }
      
      // Generate initial reminders
      await loadAIReminders();
      
      // Show success message
      setApplyMessage('✅ System initialized successfully!');
      setTimeout(() => setApplyMessage(''), 3000);
      
    } catch (error) {
      console.error('Initialization error:', error);
      setApplyMessage('❌ Initialization failed. Please try again.');
      setTimeout(() => setApplyMessage(''), 3000);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAiAnalysis = () => {
    setShowDailyTracker(true);
  };

  const handleShareProgress = () => {
    setShowShareModal(true);
  };

  const handleShareTo = (platform: string) => {
    const categories = Array.from(new Set(reminders.map(r => r.category))).join(', ');
    const summary = `Neural Reminders Progress Report\n\nTotal Active Reminders: ${reminders.length}\nCategories: ${categories}\nAI-Generated: ${reminders.filter(r => r.aiGenerated).length}`;
    const url = window.location.origin;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(summary)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(summary + '\n' + url)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(summary)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Neural Reminders Progress')}&body=${encodeURIComponent(summary)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(summary).then(() => {
          setApplyMessage('✅ Copied to clipboard!');
          setTimeout(() => setApplyMessage(''), 3000);
        });
        setShowShareModal(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      setShowShareModal(false);
    }
  };

  const handleExportData = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(255, 165, 0);
    doc.text('Neural Reminders Report', pageWidth / 2, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
    
    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Active Reminders: ${reminders.length}`, 20, 45);
    doc.text(`AI-Generated: ${reminders.filter(r => r.aiGenerated).length}`, 20, 52);
    
    // Reminders List
    doc.setFontSize(14);
    doc.setTextColor(255, 165, 0);
    doc.text('Reminders:', 20, 65);
    
    let yPos = 75;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    reminders.forEach((reminder, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(`${index + 1}. ${reminder.title}`, 20, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`   Time: ${reminder.time} | Frequency: ${reminder.frequency} | Category: ${reminder.category}`, 20, yPos);
      yPos += 6;
      doc.text(`   Priority: ${reminder.priority} | ${reminder.aiGenerated ? 'AI-Generated' : 'User-Created'}`, 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    });
    
    // Save PDF
    doc.save(`neural-reminders-${new Date().toISOString().split('T')[0]}.pdf`);
    
    setApplyMessage('💾 PDF exported successfully!');
    setTimeout(() => setApplyMessage(''), 3000);
  };

  const handleNewReminderSubmit = async (data: NewReminderData) => {
    // Save reminder to backend first
    let newReminder: Reminder | null = null;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          time: data.time,
          frequency: data.frequency,
          category: data.category,
          priority: data.priority
        })
      });

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to save reminder');
      }

      // Create reminder with backend ID
      newReminder = {
        id: responseData.reminder.id,
        title: responseData.reminder.title,
        description: responseData.reminder.description,
        time: responseData.reminder.time,
        frequency: responseData.reminder.frequency,
        category: responseData.reminder.category,
        isActive: true,
        nextReminder: new Date(Date.now() + 24 * 60 * 60 * 1000),
        aiGenerated: false,
        priority: responseData.reminder.priority
      };

      // Add to reminders
      setReminders(prev => [...prev, newReminder!]);
    } catch (error) {
      console.error('Error saving reminder:', error);
      setApplyMessage(`❌ Failed to save reminder: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setApplyMessage(''), 3000);
      return;
    }

    // Handle calendar integration
    if (data.addToCalendar && data.calendarType && newReminder) {
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
            setApplyMessage(`✅ "${data.title}" created & opening Google Calendar!`);
            break;
          case 'outlook':
            calendarService.addToOutlookCalendar(calendarEvent);
            setApplyMessage(`✅ "${data.title}" created & opening Outlook Calendar!`);
            break;
          default:
            calendarService.addToGoogleCalendar(calendarEvent);
            setApplyMessage(`✅ "${data.title}" created & opening Google Calendar!`);
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
            <img src="/logo/Neural Reminders.png" alt="Neural Reminders" className="title-icon-img" />
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
          >
            <span className="btn-icon">◈</span>
            DAILY TRACKER
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
          <span className="panel-icon">⚡</span>
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
        {(refreshMessage || applyMessage) && (
          <div className="insights-messages">
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
        )}
        <div className="ai-actions">
          <button 
            className="personalized-insights-btn"
            onClick={loadPersonalizedInsights}
            disabled={isLoadingInsights}
          >
            {isLoadingInsights ? 'Analyzing...' : 'Generate Insights Based on Your Health Data'}
          </button>
          <button 
            className="general-insights-btn"
            onClick={loadGeneralInsights}
            disabled={isLoadingInsights}
          >
            {isLoadingInsights ? 'Generating...' : 'Generate General Health Insights'}
          </button>
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
                      calendarService.openWithCalendarApp(event);
                      setApplyMessage(`📅 Opening "${reminder.title}" in calendar app!`);
                      setTimeout(() => setApplyMessage(''), 3000);
                    }}
                    title="Export to calendar"
                  >
                    📅
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

      {/* Social/Sharing Stats Panel */}
      <div className="ai-stats-panel">
        <div className="stats-header">
          <span className="stats-icon">⚡</span>
          <h3>SOCIAL & SHARING</h3>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">SHARED WITH</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{reminders.length}</span>
            <span className="stat-label">TRACKABLE</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Private</span>
            <span className="stat-label">STATUS</span>
          </div>
        </div>
        <div className="sharing-actions">
          <button 
            className="share-button" 
            title="Share progress with family or healthcare provider"
            onClick={handleShareProgress}
          >
            Share Progress
          </button>
          <button 
            className="export-button" 
            title="Export reminders data"
            onClick={handleExportData}
          >
            Export Data
          </button>
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

      {/* Daily Tracker Modal */}
      <DailyTrackerModal
        isOpen={showDailyTracker}
        onClose={() => setShowDailyTracker(false)}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Your Progress</h3>
              <button className="close-modal-btn" onClick={() => setShowShareModal(false)}>×</button>
            </div>
            <div className="share-options">
              <button className="share-option-btn twitter" onClick={() => handleShareTo('twitter')}>
                <img src="/social_media_logo/X logo.png" alt="X" className="share-option-logo" />
                <span>X</span>
              </button>
              <button className="share-option-btn facebook" onClick={() => handleShareTo('facebook')}>
                <img src="/social_media_logo/Facebook Logo.png" alt="Facebook" className="share-option-logo" />
                <span>Facebook</span>
              </button>
              <button className="share-option-btn whatsapp" onClick={() => handleShareTo('whatsapp')}>
                <img src="/social_media_logo/WhatsApp logo.webp" alt="WhatsApp" className="share-option-logo" />
                <span>WhatsApp</span>
              </button>
              <button className="share-option-btn sms" onClick={() => handleShareTo('sms')}>
                <img src="/social_media_logo/SMS logo.png" alt="SMS" className="share-option-logo" />
                <span>SMS</span>
              </button>
              <button className="share-option-btn email" onClick={() => handleShareTo('email')}>
                <img src="/social_media_logo/email logo.webp" alt="Email" className="share-option-logo" />
                <span>Email</span>
              </button>
              <button className="share-option-btn copy" onClick={() => handleShareTo('copy')}>
                <span className="share-option-icon">📋</span>
                <span>Copy Text</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}