import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './HomeLoading.css';

export default function HomeLoading() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    'INITIALIZING HEALTH PLATFORM...',
    'LOADING USER INTERFACE...',
    'CONNECTING TO SERVICES...',
    'PREPARING DASHBOARD...',
    'WELCOME HOME'
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3;
      });
    }, 60);

    // Step animation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    // Navigate after loading completes
    const timer = setTimeout(() => {
      navigate('/');
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={`home-loading-container ${theme}`}>
      {/* Background Effects */}
      <div className="home-background">
        <div className="floating-particles"></div>
        <div className="gradient-waves"></div>
        <div className="geometric-pattern"></div>
      </div>

      {/* Main Loading Content */}
      <div className="home-loading-content">
        {/* Logo and Title */}
        <div className="home-loading-header">
          <div className="home-loading-logo">
            <img src="/logo/logo.png" alt="Buddy Your Health Logo" className="logo-image" />
            <div className="logo-glow"></div>
          </div>
          <h1 className="home-loading-title">BUDDY YOUR HEALTH</h1>
          <p className="home-loading-subtitle">Your Personal Health Companion</p>
        </div>

        {/* Progress Section */}
        <div className="home-progress-section">
          <div className="home-progress-container">
            <div className="home-progress-bar">
              <div 
                className="home-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
              <div className="home-progress-glow"></div>
            </div>
            <div className="home-progress-text">{progress}%</div>
          </div>

          {/* Loading Steps */}
          <div className="home-loading-steps">
            {loadingSteps.map((step, index) => (
              <div 
                key={index}
                className={`home-loading-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              >
                <div className="home-step-indicator">
                  {index < currentStep ? '✓' : index === currentStep ? '●' : '○'}
                </div>
                <span className="home-step-text">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Icons Animation */}
        <div className="health-icons-animation">
          <div className="health-icon icon-1">🏥</div>
          <div className="health-icon icon-2">💊</div>
          <div className="health-icon icon-3">🩺</div>
          <div className="health-icon icon-4">💓</div>
          <div className="health-icon icon-5">🧘‍♀️</div>
          <div className="health-icon icon-6">🏃‍♂️</div>
        </div>

        {/* Status Display */}
        <div className="home-status-display">
          <div className="home-status-indicator">
            <div className="home-status-dot"></div>
            <span className="home-status-text">LOADING HEALTH DASHBOARD</span>
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="home-animated-elements">
        <div className="pulse-ring ring-1"></div>
        <div className="pulse-ring ring-2"></div>
        <div className="pulse-ring ring-3"></div>
      </div>
    </div>
  );
}