import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 
import ParticleBackground from './ParticleBackground';
import Agent from './model';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../navbar/Navbar';

function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="App">
      
      <ParticleBackground />

      <Agent /> 
      
      
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