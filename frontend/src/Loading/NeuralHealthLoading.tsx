import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './NeuralHealthLoading.css';

export default function NeuralHealthLoading() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  console.log('NeuralHealthLoading theme:', theme);

  const loadingSteps = [
    'INITIALIZING NEURAL NETWORK...',
    'CONNECTING TO HEALTH SYSTEMS...',
    'LOADING HEALTH PROTOCOLS...',
    'ACTIVATING MONITORING ENGINE...',
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
      navigate('/neural-health', { replace: true });
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={`neural-health-loading-container ${theme}`}>
      {/* Animated Background */}
      <div className="neural-health-loading-background">
        <div className="neural-health-loading-grid"></div>
        <div className="neural-health-loading-particles"></div>
        <div className="neural-health-loading-waves"></div>
      </div>

      {/* Main Loading Content */}
      <div className="nhl-loading-content">
        {/* Logo and Title */}
        <div className="nhl-loading-header">
          <div className="nhl-loading-logo">
            <div className="nhl-loading-logo-icon">🧬</div>
          </div>
          <h1 className="nhl-loading-title">NEURAL HEALTH</h1>
          <p className="nhl-loading-subtitle">AI-Powered Health Intelligence System</p>
        </div>

        {/* Progress Section */}
        <div className="nhl-progress-section">
          <div className="nhl-progress-container">
            <div className="nhl-progress-bar">
              <div 
                className="nhl-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="nhl-progress-text">{progress}%</div>
          </div>

          {/* Loading Steps */}
          <div className="nhl-loading-steps">
            {loadingSteps.map((step, index) => (
              <div 
                key={index}
                className={`nhl-loading-step ${index <= currentStep ? 'nhl-active' : ''} ${index < currentStep ? 'nhl-completed' : ''}`}
              >
                <div className="nhl-step-indicator">
                  {index < currentStep ? '✓' : index === currentStep ? '◉' : '○'}
                </div>
                <span className="nhl-step-text">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Activity Visualization */}
        <div className="neural-health-loading-activity">
          <div className="nhl-activity-nodes">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`nhl-activity-node nhl-node-${i}`}>
                <div className="nhl-node-pulse"></div>
              </div>
            ))}
          </div>
          <div className="nhl-activity-connections">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`nhl-connection nhl-connection-${i}`}></div>
            ))}
          </div>
        </div>

        {/* Status Display */}
        <div className="nhl-status-display">
          <div className="nhl-status-indicator">
            <div className="nhl-status-dot"></div>
            <span className="nhl-status-text">SYSTEM INITIALIZING</span>
          </div>
        </div>
      </div>

      {/* Scanning Lines Effect */}
      <div className="nhl-scan-lines">
        <div className="nhl-scan-line nhl-scan-1"></div>
        <div className="nhl-scan-line nhl-scan-2"></div>
        <div className="nhl-scan-line nhl-scan-3"></div>
      </div>
    </div>
  );
}
