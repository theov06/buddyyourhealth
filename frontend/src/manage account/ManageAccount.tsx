import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ManageAccount.css';
import ParticleBackground from '../home/ParticleBackground';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  healthGoals: string[];
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

function ManageAccount() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    healthGoals: [],
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
        name: user.fullName,
        email: user.email
      }));
    }
  }, [isAuthenticated, user, navigate]);

  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
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

  return (
    <div className="App">
      <ParticleBackground />
      
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
                      <label className="input-label">Full Name</label>
                      <input 
                        type="text" 
                        className="cyber-input"
                        value={profile.name}
                        onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <input 
                        type="email" 
                        className="cyber-input"
                        value={profile.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="cyber-input"
                        value={profile.phone}
                        onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Date of Birth</label>
                      <input 
                        type="date" 
                        className="cyber-input"
                        value={profile.dateOfBirth}
                        onChange={(e) => handleProfileUpdate('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'health' && (
                <div className="health-section">
                  <h2>Health Metrics</h2>
                  <div className="health-cards">
                    <div className="health-card">
                      <h3>Current Weight</h3>
                      <div className="metric-value">75.2 kg</div>
                      <div className="metric-trend">↓ 2.1kg this month</div>
                    </div>
                    <div className="health-card">
                      <h3>BMI Index</h3>
                      <div className="metric-value">22.4</div>
                      <div className="metric-status healthy">Normal Range</div>
                    </div>
                    <div className="health-card">
                      <h3>Daily Steps</h3>
                      <div className="metric-value">8,547</div>
                      <div className="metric-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: '85%'}}></div>
                        </div>
                        <span>85% of goal</span>
                      </div>
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

            {/* Action Buttons */}
            <div className="account-actions">
              <button className="cyber-button primary">Save Changes</button>
              <Link to="/" className="cyber-button secondary">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAccount;