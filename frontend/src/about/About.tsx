
import { Link } from 'react-router-dom';
import './About.css';
import ParticleBackground from '../Home/ParticleBackground';
import LightBackground from '../Home/LightBackground';
import Navbar from '../navbar/Navbar';
import { useTheme } from '../contexts/ThemeContext'; 

function About() {
  const { theme } = useTheme();
  
  return (
    <div className="App">
      {/* Background based on theme */}
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      
      <div className="main-content">
        
        {/* Navigation Bar */}
        <Navbar activeLink="about" />
        
        {/* About Page Container */}
        <div className="about-container">
          
          <div className="about-hero">
            <h1>About Buddy Your Health</h1>
          </div>
          
          <div className="about-content">
            
            {/* Mission Statement */}
            <section className="mission-statement">
              <div className="mission-card">
                <h2>Our Mission</h2>
                <p>
                  We believe everyone deserves personalized health guidance. Buddy Your Health combines 
                  cutting-edge AI technology with medical expertise to transform complex health data into 
                  simple, actionable insights—making professional-grade health management accessible to all.
                </p>
              </div>
            </section>

            {/* The Problem & Solution */}
            <section className="problem-solution-section">
              <div className="ps-grid">
                <div className="ps-card problem">
                  <h3>The Challenge</h3>
                  <p>
                    Today's health landscape is overwhelming. Generic advice floods the internet, 
                    but finding personalized, trustworthy guidance remains difficult. Most health 
                    apps simply track data without providing meaningful insights tailored to your 
                    unique needs.
                  </p>
                </div>
                
                <div className="ps-card solution">
                  <h3>Our Solution</h3>
                  <p>
                    Buddy Your Health goes beyond tracking. Our AI analyzes your health data, 
                    understands your lifestyle, and delivers personalized recommendations—like 
                    having a dedicated health advisor in your pocket, available 24/7.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Core Features */}
            <section className="features-section">
              <h2>What We Offer</h2>
              <p className="section-intro">
                Three powerful AI-driven features designed to transform your health journey
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <img src="/logo/Neural Guardian.png" alt="Neural Guardian Logo" className="feature-logo" />
                  <h3>Neural Guardian</h3>
                  <p className="feature-description">
                    Your intelligent health assistant powered by advanced AI. Get instant answers 
                    to health questions, personalized advice, and evidence-based recommendations 
                    tailored to your unique profile.
                  </p>
                  <div className="feature-highlights">
                    <span className="highlight">24/7 AI Support</span>
                    <span className="highlight">Personalized Insights</span>
                    <span className="highlight">Evidence-Based</span>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="dna-icon">🧬</div>
                  <h3>Neural Health</h3>
                  <p className="feature-description">
                    Comprehensive health analytics that turn your Apple Health data into actionable 
                    insights. Track trends, identify patterns, and receive AI-powered recommendations 
                    to optimize your wellness.
                  </p>
                  <div className="feature-highlights">
                    <span className="highlight">Data Visualization</span>
                    <span className="highlight">Trend Analysis</span>
                    <span className="highlight">Smart Predictions</span>
                  </div>
                </div>
                
                <div className="feature-card">
                  <img src="/logo/Neural Reminders.png" alt="Neural Reminders Logo" className="feature-logo" />
                  <h3>Neural Reminders</h3>
                  <p className="feature-description">
                    Never miss important health tasks. Intelligent reminders for medications, 
                    appointments, exercise, and wellness activities—all personalized to your 
                    schedule and health goals.
                  </p>
                  <div className="feature-highlights">
                    <span className="highlight">Smart Scheduling</span>
                    <span className="highlight">Custom Alerts</span>
                    <span className="highlight">Goal Tracking</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-section">
              <h2>Why Choose Buddy Your Health?</h2>
              <div className="why-grid">
                <div className="why-card">
                  <div className="why-number">01</div>
                  <h3>AI-Powered Personalization</h3>
                  <p>
                    Our advanced AI learns from your unique health data, lifestyle, and goals 
                    to provide recommendations that actually work for you—not generic advice.
                  </p>
                </div>
                
                <div className="why-card">
                  <div className="why-number">02</div>
                  <h3>Medical-Grade Accuracy</h3>
                  <p>
                    Built with input from healthcare professionals and trained on millions of 
                    clinical data points to ensure reliable, evidence-based guidance.
                  </p>
                </div>
                
                <div className="why-card">
                  <div className="why-number">03</div>
                  <h3>Privacy First</h3>
                  <p>
                    Your health data is encrypted and secure. We never share your information 
                    with third parties. You maintain complete control over your data.
                  </p>
                </div>
                
                <div className="why-card">
                  <div className="why-number">04</div>
                  <h3>Seamless Integration</h3>
                  <p>
                    Works effortlessly with Apple Health to automatically sync your data, 
                    providing insights without manual entry or complicated setup.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Our Commitment */}
            <section className="commitment-section">
              <h2>Our Commitment to You</h2>
              <div className="commitment-grid">
                <div className="commitment-card">
                  <h3>Privacy & Security</h3>
                  <p>
                    Your health data is protected with bank-level encryption. We comply with 
                    HIPAA and GDPR standards, and we never share your information without 
                    explicit consent. You own your data—always.
                  </p>
                </div>
                
                <div className="commitment-card">
                  <h3>Accuracy & Reliability</h3>
                  <p>
                    Our AI is trained on millions of clinical data points and continuously 
                    updated with the latest medical research. Every recommendation is backed 
                    by scientific evidence and validated by healthcare professionals.
                  </p>
                </div>
                
                <div className="commitment-card">
                  <h3>Transparency</h3>
                  <p>
                    We believe in clear communication. Our AI explains its reasoning, cites 
                    sources, and helps you understand the "why" behind every recommendation—
                    empowering you to make informed decisions.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
              <h2>How It Works</h2>
              <div className="steps-container">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Connect Your Data</h3>
                  <p>Sync with Apple Health to automatically import your health metrics</p>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>AI Analysis</h3>
                  <p>Our AI analyzes your data to identify patterns and insights</p>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Get Personalized Insights</h3>
                  <p>Receive tailored recommendations and actionable health guidance</p>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Track Progress</h3>
                  <p>Monitor your improvements and adjust your health journey</p>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <div className="cta-section">
              <h3>Ready to Transform Your Health?</h3>
              <p className="cta-description">
                Join thousands of users who are taking control of their wellness with AI-powered insights
              </p>
              <div className="cta-buttons">
                <Link to="/loading/signup" className="cta-button primary">Get Started Free</Link>
                <Link to="/contact" className="cta-button secondary">Learn More</Link>
              </div>
            </div>
            
          </div> 
        </div> 
      </div>
    </div>
  );
}

export default About;