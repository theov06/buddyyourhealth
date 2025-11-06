import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 
import ParticleBackground from './ParticleBackground';
import LightBackground from './LightBackground';
import Agent from './model';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../navbar/Navbar';

function Home() {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [isActivated, setIsActivated] = useState(false);

  const handleActivateClick = () => {
    setIsActivated(!isActivated);
    console.log('Robot activated:', !isActivated);
  };

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      <Agent />
      
      {/* Activate Button */}
      <div className={`activate-button-container ${theme}`}>
        <button 
          className={`activate-button ${isActivated ? 'activated' : ''} ${theme}`}
          onClick={handleActivateClick}
        >
          {isActivated ? 'DEACTIVATE' : 'ACTIVATE'}
        </button>
      </div>

      {/* Health Monitoring Button - appears when activated */}
      {isActivated && (
        <div className={`health-monitoring-container ${theme}`}>
          <button 
            className={`health-monitoring-button ${theme}`}
            onClick={() => {
              console.log('Health monitoring clicked!');
              // Add your health monitoring functionality here
              alert('💓 Health Monitoring: Access real-time monitoring of your vital signs, heart rate, and health metrics!');
            }}
          >
            Health monitoring
          </button>
        </div>
      )}

      {/* Generative AI Button - appears when activated */}
      {isActivated && (
        <div className={`generative-ai-container ${theme}`}>
          <button 
            className={`generative-ai-button ${theme}`}
            onClick={() => {
              console.log('Generative AI clicked!');
              // Add your AI functionality here
              alert('🤖 Generative AI: Ready to assist with your health questions and provide personalized insights!');
            }}
          >
            Generative AI
          </button>
        </div>
      )}

      {/* Reminder Button - appears when activated */}
      {isActivated && (
        <div className={`reminder-container ${theme}`}>
          <button 
            className={`reminder-button ${theme}`}
            onClick={() => {
              console.log('Reminder clicked!');
              // Add your reminder functionality here
              alert('⏰ Reminder: Set up personalized health reminders for medications, workouts, and wellness checks!');
            }}
          >
            Reminder
          </button>
        </div>
      )}
      
      <div className="main-content">
        <Navbar activeLink="home" />
        
        <div className="hero-text-container">
          {isAuthenticated ? (
            <>
              <h1>Welcome back,<br />{user?.firstName}!</h1>
              <p>Continue your personalized health journey</p>
              <div className="cta-buttons">
                <Link to="/account" className="cta-button primary">Manage Account</Link>
                <Link to="/about" className="cta-button secondary">Learn More</Link>
              </div>
            </>
          ) : (
            <>
              <h1>Simple tracking<br />Smart insights<br />Real results</h1>
              <p>Where personalized AI guidance meets your healthiest future</p>
              <div className="cta-buttons">
                <Link to="/loading/signup" className="cta-button primary">Create Account</Link>
                <Link to="/loading/login" className="cta-button secondary">Sign In</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;