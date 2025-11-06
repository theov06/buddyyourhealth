import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Contact.css';
import ParticleBackground from '../home/ParticleBackground';
import LightBackground from '../home/LightBackground';
import Navbar from '../navbar/Navbar';
import { useTheme } from '../contexts/ThemeContext';

function Contact() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Redirect to Thank You page
    navigate('/thank-you');
  };

  return (
    <div className="App">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      
      <div className="main-content">
        <Navbar activeLink="contact" />
        
        <div className="contact-container">
          <div className="contact-header">
            <h1>Contact Us</h1>
            <p className="contact-subtitle">Get in touch with our health technology experts</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-form-section">
              <h2>Send us a message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      className="cyber-input"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      className="cyber-input"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    className="cyber-input"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea 
                    name="message"
                    className="cyber-textarea"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="cyber-button primary">Send Message</button>
              </form>
            </div>

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
        </div>
      </div>
    </div>
  );
}

export default Contact;