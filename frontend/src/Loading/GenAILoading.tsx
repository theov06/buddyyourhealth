import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './GenAILoading.css';

export default function GenAILoading() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);

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

    // Navigate after loading completes
    const timer = setTimeout(() => {
      navigate('/genai', { replace: true });
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={`genai-loading-container ${theme}`}>
      {/* Background Effects */}
      <div className="genai-background">
        <div className="genai-circuit-pattern"></div>
        <div className="genai-data-streams"></div>
        <div className="genai-grid-overlay"></div>
      </div>

      {/* Main Loading Content */}
      <div className="genai-loading-content">
        {/* Logo and Title */}
        <div className="genai-loading-header">
          <div className="genai-loading-logo">
            <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="genai-loading-logo-image" />
            <div className="genai-logo-glow"></div>
          </div>
          <h1 className="genai-loading-title">NEURAL GUARDIAN</h1>
          <p className="genai-loading-subtitle">Your Personal Health AI Assistant</p>
        </div>

        {/* Progress Section */}
        <div className="genai-progress-section">
          <div className="genai-progress-container">
            <div className="genai-progress-bar">
              <div 
                className="genai-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
              <div className="genai-progress-glow"></div>
            </div>
            <div className="genai-progress-text">{progress}%</div>
          </div>
        </div>

        {/* AI Status Display */}
        <div className="genai-status-display">
          <div className="genai-status-indicator">
            <div className="genai-status-dot"></div>
            <span className="genai-status-text">INITIALIZING AI SYSTEMS</span>
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="genai-animated-elements">
        <div className="genai-pulse-ring ring-1"></div>
        <div className="genai-pulse-ring ring-2"></div>
        <div className="genai-pulse-ring ring-3"></div>
      </div>
    </div>
  );
}
