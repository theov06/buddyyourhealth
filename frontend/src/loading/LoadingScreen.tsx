import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingScreen.css';
import ParticleBackground from '../home/ParticleBackground';

interface LoadingScreenProps {
  destination: string;
  loadingText: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ destination, loadingText }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Animate text typing effect
    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex <= loadingText.length) {
        setCurrentText(loadingText.slice(0, textIndex));
        textIndex++;
      } else {
        clearInterval(textInterval);
      }
    }, 100);

    // Navigate after 2.5 seconds
    const timer = setTimeout(() => {
      navigate(destination, { replace: true });
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [destination, loadingText, navigate]);

  return (
    <div className="loading-screen">
      <ParticleBackground />
      
      <div className="loading-content">
        <div className="loading-header">
          <div className="logo">
            <img src="/logo/logo.png" alt="Buddy Your Health Logo" className="logo-image" />
            <span className="logo-text">BUDDY YOUR HEALTH®</span>
          </div>
        </div>

        <div className="loading-animation">
          <div className="loading-circle">
            <div className="loading-circle-inner">
              <div className="loading-pulse"></div>
            </div>
            <svg className="loading-progress" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(0, 255, 255, 0.2)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#00FFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                className="progress-circle"
              />
            </svg>
          </div>
          
          <div className="loading-text">
            <h2 className="loading-title">{currentText}</h2>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="loading-bar-container">
            <div className="loading-bar">
              <div 
                className="loading-bar-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="loading-percentage">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="loading-footer">
          <p className="loading-subtitle">Preparing your health journey...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;