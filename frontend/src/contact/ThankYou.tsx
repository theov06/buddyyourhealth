import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';
import ParticleBackground from '../Home/ParticleBackground';
import LightBackground from '../Home/LightBackground';
import Navbar from '../navbar/Navbar';
import { useTheme } from '../contexts/ThemeContext';



function ThankYou() {

  const {theme} = useTheme();

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      
      <div className="main-content">
        <Navbar activeLink="contact" />
        
        <div className="thankyou-container">
          <div className="thankyou-header">
            <h1>Thank you for your message</h1>
            <p className="thankyou-subtitle">We will do our best to respond to your message by 5-6 business days</p>
          </div>
          
          <div className="thankyou-content">
            <div className="contact-info-section">
              <h2>Get in Touch</h2>
              <div className="contact-cards">
                <div className="contact-card">
                  <div className="contact-icon">📧</div>
                  <h3>Email</h3>
                  <p>buddyyourhealth@gmail.com</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📱</div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">🏢</div>
                  <h3>Office</h3>
                  <p>3333 University Way<br />Kelowna, BC V1V 1V7</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">⏰</div>
                  <h3>Support Hours</h3>
                  <p>Mon-Fri: 9AM-6PM PST<br />Weekend: 10AM-4PM PST</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="thankyou-actions">
            <Link to="/" className="cyber-button primary">Back to Home</Link>
            <Link to="/contact" className="cyber-button secondary">Send Another Message</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;