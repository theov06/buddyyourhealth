import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ManageAccount.css';
import ParticleBackground from '../home/ParticleBackground';
import LightBackground from '../home/LightBackground';
import Navbar from '../navbar/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ApiService from '../services/api';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  healthProfile: {
    age: number | '';
    height: number | '';
    weight: number | '';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | '';
    goals: string[];
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

function ManageAccount() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    healthProfile: {
      age: '',
      height: '',
      weight: '',
      activityLevel: '',
      goals: []
    },
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Initialize profile with user data
    if (user) {
      setProfile(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        healthProfile: {
          age: user.healthProfile?.age || '',
          height: user.healthProfile?.height || '',
          weight: user.healthProfile?.weight || '',
          activityLevel: user.healthProfile?.activityLevel || '',
          goals: user.healthProfile?.goals || []
        }
      }));
    }
  }, [isAuthenticated, user, navigate]);

  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleHealthProfileUpdate = (field: keyof UserProfile['healthProfile'], value: any) => {
    setProfile(prev => ({
      ...prev,
      healthProfile: {
        ...prev.healthProfile,
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (type: keyof UserProfile['notifications']) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        healthProfile: {
          age: profile.healthProfile.age ? Number(profile.healthProfile.age) : undefined,
          height: profile.healthProfile.height ? Number(profile.healthProfile.height) : undefined,
          weight: profile.healthProfile.weight ? Number(profile.healthProfile.weight) : undefined,
          activityLevel: profile.healthProfile.activityLevel || undefined,
          goals: profile.healthProfile.goals
        }
      };

      const response = await ApiService.updateProfile(updateData);

      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Refresh user data in the auth context
        await refreshUser();
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred while updating profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      
      <div className="main-content">
        {/* Navigation Bar */}
        <Navbar activeLink="account" />

        {/* Account Management Container */}
        <div className="account-container">
          <div className="account-header">
            <h1>Account Management</h1>
            <p className="account-subtitle">Configure your health journey settings</p>
          </div>

          <div className="account-content">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="tab-icon">👤</span>
                Profile
              </button>
              <button 
                className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
                onClick={() => setActiveTab('health')}
              >
                <span className="tab-icon">💊</span>
                Health Data
              </button>
              <button 
                className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <span className="tab-icon">🔔</span>
                Notifications
              </button>
              <button 
                className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <span className="tab-icon">🔒</span>
                Security
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'profile' && (
                <div className="profile-section">
                  <h2>Personal Information</h2>
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">First Name</label>
                      <input 
                        type="text" 
                        className="cyber-input"
                        value={profile.firstName}
                        onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Last Name</label>
                      <input 
                        type="text" 
                        className="cyber-input"
                        value={profile.lastName}
                        onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <input 
                        type="email" 
                        className="cyber-input"
                        value={profile.email}
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Age</label>
                      <input 
                        type="number" 
                        className="cyber-input"
                        value={profile.healthProfile.age}
                        onChange={(e) => handleHealthProfileUpdate('age', e.target.value)}
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'health' && (
                <div className="health-section">
                  <h2>Health Profile</h2>
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Height (cm)</label>
                      <input 
                        type="number" 
                        className="cyber-input"
                        value={profile.healthProfile.height}
                        onChange={(e) => handleHealthProfileUpdate('height', e.target.value)}
                        min="50"
                        max="300"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Weight (kg)</label>
                      <input 
                        type="number" 
                        className="cyber-input"
                        value={profile.healthProfile.weight}
                        onChange={(e) => handleHealthProfileUpdate('weight', e.target.value)}
                        min="20"
                        max="500"
                        step="0.1"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Activity Level</label>
                      <select 
                        className="cyber-input"
                        value={profile.healthProfile.activityLevel}
                        onChange={(e) => handleHealthProfileUpdate('activityLevel', e.target.value)}
                      >
                        <option value="">Select activity level</option>
                        <option value="sedentary">Sedentary (little/no exercise)</option>
                        <option value="light">Light (light exercise 1-3 days/week)</option>
                        <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                        <option value="active">Active (hard exercise 6-7 days/week)</option>
                        <option value="very_active">Very Active (very hard exercise, physical job)</option>
                      </select>
                    </div>
                    <div className="input-group full-width">
                      <label className="input-label">Health Goals</label>
                      <textarea 
                        className="cyber-input"
                        value={profile.healthProfile.goals.join(', ')}
                        onChange={(e) => handleHealthProfileUpdate('goals', e.target.value.split(', ').filter(goal => goal.trim()))}
                        placeholder="Enter your health goals"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="notifications-section">
                  <h2>Notification Preferences</h2>
                  <div className="notification-options">
                    <div className="notification-item">
                      <div className="notification-info">
                        <h3>Email Notifications</h3>
                        <p>Receive health insights and reminders via email</p>
                      </div>
                      <label className="cyber-switch">
                        <input 
                          type="checkbox" 
                          checked={profile.notifications.email}
                          onChange={() => handleNotificationChange('email')}
                        />
                        <span className="switch-slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h3>Push Notifications</h3>
                        <p>Get real-time alerts on your mobile device</p>
                      </div>
                      <label className="cyber-switch">
                        <input 
                          type="checkbox" 
                          checked={profile.notifications.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                        <span className="switch-slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h3>SMS Alerts</h3>
                        <p>Receive critical health alerts via text message</p>
                      </div>
                      <label className="cyber-switch">
                        <input 
                          type="checkbox" 
                          checked={profile.notifications.sms}
                          onChange={() => handleNotificationChange('sms')}
                        />
                        <span className="switch-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="security-section">
                  <h2>Security Settings</h2>
                  <div className="security-options">
                    <div className="security-card">
                      <h3>Change Password</h3>
                      <p>Update your account password for better security</p>
                      <button className="cyber-button secondary">Update Password</button>
                    </div>
                    <div className="security-card">
                      <h3>Two-Factor Authentication</h3>
                      <p>Add an extra layer of security to your account</p>
                      <button className="cyber-button primary">Enable 2FA</button>
                    </div>
                    <div className="security-card danger">
                      <h3>Delete Account</h3>
                      <p>Permanently delete your account and all data</p>
                      <button className="cyber-button danger">Delete Account</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`message ${message.type}`} style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: message.type === 'success' ? '#1a4d3a' : '#4d1a1a',
                border: `1px solid ${message.type === 'success' ? '#00ff88' : '#ff4444'}`,
                color: message.type === 'success' ? '#00ff88' : '#ff4444'
              }}>
                {message.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="account-actions">
              <button 
                className="cyber-button primary" 
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <Link to="/" className="cyber-button secondary">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAccount;