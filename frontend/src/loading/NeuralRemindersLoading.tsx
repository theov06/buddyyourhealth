import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './NeuralRemindersLoading.css';

export default function NeuralRemindersLoading() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    'INITIALIZING NEURAL NETWORK...',
    'CONNECTING TO AI SYSTEMS...',
    'LOADING HEALTH PROTOCOLS...',
    'ACTIVATING REMINDER ENGINE...',
    'SYSTEM READY'
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Step animation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    // Navigate after loading completes
    const timer = setTimeout(() => {
      navigate('/smart-reminders');
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={`neural-loading-container ${theme}`}>
      {/* Animated Background */}
      <div className="neural-background">
        <div className="neural-grid"></div>
        <div className="data-particles"></div>
        <div className="energy-waves"></div>
      </div>

      {/* Main Loading Content */}
      <div className="loading-content">
        {/* Logo and Title */}
        <div className="loading-header">
          <div className="loading-logo">
            <div className="logo-pulse">⚡</div>
          </div>
          <h1 className="loading-title">NEURAL REMINDERS</h1>
          <p className="loading-subtitle">AI-Powered Health Intelligence System</p>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">{progress}%</div>
          </div>

          {/* Loading Steps */}
          <div className="loading-steps">
            {loadingSteps.map((step, index) => (
              <div 
                key={index}
                className={`loading-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              >
                <div className="step-indicator">
                  {index < currentStep ? '✓' : index === currentStep ? '◉' : '○'}
                </div>
                <span className="step-text">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Activity Visualization */}
        <div className="neural-activity">
          <div className="activity-nodes">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`activity-node node-${i}`}>
                <div className="node-pulse"></div>
              </div>
            ))}
          </div>
          <div className="activity-connections">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`connection connection-${i}`}></div>
            ))}
          </div>
        </div>

        {/* Status Display */}
        <div className="status-display">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">SYSTEM INITIALIZING</span>
          </div>
        </div>
      </div>

      {/* Scanning Lines Effect */}
      <div className="scan-lines">
        <div className="scan-line scan-1"></div>
        <div className="scan-line scan-2"></div>
        <div className="scan-line scan-3"></div>
      </div>
    </div>
  );
}