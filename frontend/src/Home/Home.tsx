import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isActivated, setIsActivated] = useState(false);

  const handleActivateClick = () => {
    setIsActivated(!isActivated);
    console.log('Robot activated:', !isActivated);
  };

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      <Agent />
      
      {/* Activate Button - Only show when authenticated */}
      {isAuthenticated && (
        <div className={`activate-button-container ${theme}`}>
          <button 
            className={`activate-button ${isActivated ? 'activated' : ''} ${theme}`}
            onClick={handleActivateClick}
          >
            {isActivated ? 'DEACTIVATE' : 'ACTIVATE'}
          </button>
        </div>
      )}

      {/* Health Monitoring Button - appears when activated */}
      {isActivated && (
        <div className={`health-monitoring-container ${theme}`}>
          <button 
            className={`health-monitoring-button ${theme}`}
            onClick={() => {
              console.log('Health monitoring clicked!');
              navigate('/loading/neural-health');
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
              navigate('/loading/genai');
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
              navigate('/loading/neural-reminders');
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