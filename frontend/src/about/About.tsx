import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import ParticleBackground from '../home/ParticleBackground';
import Navbar from '../components/Navbar'; 

function About() {
  return (
    <div className="App">
      {/* 배경 입자 효과 컴포넌트 */}
      <ParticleBackground />
      
      <div className="main-content">
        
        {/* 네비게이션 바 */}
        <Navbar activeLink="about" />
        
        {/* About 페이지 본문 컨테이너 */}
        <div className="about-container">
          
          <div className="about-hero">
            <h1>About Us</h1>
            <p className="about-subtitle">
              Empowering your wellness journey with AI-driven insights
            </p>
          </div>
          
          <div className="about-content">
            
            {/* 미션 섹션 */}
            <section className="mission-section">
              <h2>Our Mission</h2>
              <p className="about-description">
                We believe everyone deserves personalized health guidance that adapts to their unique lifestyle. 
                Buddy Your Health combines cutting-edge AI technology with intuitive design to make health tracking 
                simple, insightful, and genuinely helpful.
              </p>
            </section>
            
            {/* 핵심 기능 섹션 */}
            <section className="features-section">
              <h2>What We Offer</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <h3>Smart Tracking</h3>
                  <p>Effortlessly monitor your health metrics with our intelligent tracking system that learns from your habits.</p>
                </div>
                <div className="feature-card">
                  <h3>AI Insights</h3>
                  <p>Get personalized recommendations and insights powered by advanced AI that understands your health patterns.</p>
                </div>
                <div className="feature-card">
                  <h3>Real Results</h3>
                  <p>See meaningful progress with actionable data that helps you make informed decisions about your health.</p>
                </div>
              </div>
            </section>
            
            {/* 비전 섹션 */}
            <section className="vision-section">
              <h2>Our Vision</h2>
              <p>
                To create a world where technology seamlessly supports human wellness, making healthy living 
                accessible, enjoyable, and sustainable for everyone.
              </p>
            </section>
            
            {/* CTA (Call to Action) 섹션 */}
            <div className="cta-section">
              <h3>Ready to start your health journey?</h3>
              <div className="cta-buttons">
                <Link to="/loading/signup" className="cta-button primary">Get Started</Link>
                <Link to="/contact" className="cta-button secondary">Contact Us</Link>
              </div>
            </div>
            
          </div> 
        </div> 
      </div>
    </div>
  );
}

export default About;