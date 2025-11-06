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
  const [isRobotActivated, setIsRobotActivated] = useState(false);

  const handleActivateRobot = () => {
    setIsRobotActivated(!isRobotActivated);
  };

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      <Agent />
      
      {/* Robot Activation Button - positioned to the middle right of the robot */}
      {isAuthenticated && (
        <div className="robot-activation-container">
          <button 
            className={`robot-activate-btn ${isRobotActivated ? 'activated' : ''}`}
            onClick={handleActivateRobot}
          >
            <div className="activate-btn-inner">
              <div className="activate-icon">⚡</div>
              <div className="activate-text">
                {isRobotActivated ? 'DEACTIVATE' : 'ACTIVATE'}
              </div>
            </div>
            <div className="activate-pulse"></div>
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