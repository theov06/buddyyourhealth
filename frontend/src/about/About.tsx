
import { Link } from 'react-router-dom';
import './About.css';
import ParticleBackground from '../home/ParticleBackground';
import LightBackground from '../home/LightBackground';
import Navbar from '../navbar/Navbar';
import { useTheme } from '../contexts/ThemeContext'; 

function About() {
  const { theme } = useTheme();
  
  return (
    <div className="App">
      {/* Background based on theme */}
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      
      <div className="main-content">
        
        {/* 네비게이션 바 */}
        <Navbar activeLink="about" />
        
        {/* About 페이지 본문 컨테이너 */}
        <div className="about-container">
          
          <div className="about-hero">
            <h1>About Buddy Your Health</h1>
            <p className="about-subtitle">
              Revolutionizing healthcare through AI-powered personalized health solutions
            </p>
          </div>
          
          <div className="about-content">
            
            {/* Vision Section */}
            <section className="features-section">
              <h2>Our Vision: Why Buddy Your Health?</h2>
              <p className="section-intro">
                Health information is overflowing today, but finding personalized, accurate information remains challenging.
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-header">
                    <h3>The Challenge</h3>
                  </div>
                  <div className="feature-content">
                    <ul>
                      <li>Overwhelming amount of generic health information available</li>
                      <li>Difficulty finding personalized recommendations</li>
                      <li>Most apps only track data without providing actionable insights</li>
                      <li>Lack of AI-powered analysis for individual health profiles</li>
                    </ul>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-header">
                    <h3>Our Solution: Innovation in Healthcare Through AI</h3>
                  </div>
                  <div className="feature-content">
                    <ul>
                      <li>Going beyond simple health tracking apps</li>
                      <li>Leveraging artificial intelligence to analyze your unique body data</li>
                      <li>Understanding your lifestyle habits and preferences</li>
                      <li>Providing personalized solutions like having a dedicated doctor</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* What We Do Section */}
            <section className="features-section">
              <h2>What We Do: Key Features</h2>
              <p className="section-intro">
                Buddy Your Health transforms complex health data into simple, practical action plans. 
                Our AI technology provides three core differentiators:
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-header">
                    <h3>Advanced Personalized Nutrition Analysis</h3>
                  </div>
                  <div className="feature-content">
                    <p><strong>Beyond Calorie Counting:</strong></p>
                    <ul>
                      <li>Learns your unique health profile and medical conditions</li>
                      <li>Identifies food allergies and dietary restrictions</li>
                      <li>Tracks nutrient limitations like sodium or sugar intake</li>
                      <li>Considers chronic conditions such as gastritis or diabetes</li>
                    </ul>
                    <p><strong>Smart Recommendations:</strong></p>
                    <ul>
                      <li>Suggests foods that aid digestion for gastritis patients</li>
                      <li>Recommends low-salt alternatives for high blood pressure</li>
                      <li>Provides daily meal plans that align with your health goals</li>
                      <li>Offers practical tips like incorporating salads for better nutrition</li>
                    </ul>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-header">
                    <h3>Proactive Health Risk Management</h3>
                  </div>
                  <div className="feature-content">
                    <p><strong>Comprehensive Data Analysis:</strong></p>
                    <ul>
                      <li>Monitors sleep patterns and quality</li>
                      <li>Tracks daily activity levels and exercise</li>
                      <li>Analyzes heart rate variability</li>
                      <li>Predicts health risks before they become problems</li>
                    </ul>
                    <p><strong>Preventive Care:</strong></p>
                    <ul>
                      <li>Provides real-time lifestyle improvement feedback</li>
                      <li>Alerts you to potential health issues early</li>
                      <li>Suggests preventive measures based on your data trends</li>
                      <li>Helps you stay ahead of health problems</li>
                    </ul>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-header">
                    <h3>Data-Driven Medical Reliability</h3>
                  </div>
                  <div className="feature-content">
                    <p><strong>Expert Development Team:</strong></p>
                    <ul>
                      <li>Medical experts from around the world</li>
                      <li>Certified nutritionists and dietitians</li>
                      <li>AI and data science specialists</li>
                      <li>Continuous updates based on latest research</li>
                    </ul>
                    <p><strong>Proven AI Technology:</strong></p>
                    <ul>
                      <li>Trained on over 3 million clinical nutrition data points</li>
                      <li>Based on the latest scientific evidence</li>
                      <li>Regularly updated with new medical findings</li>
                      <li>Validated by healthcare professionals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Core Values Section */}
            <section className="features-section">
              <h2>Our Core Values: Trust and Safety</h2>
              <p className="section-intro">
                100% User-Centric and Data Security - Your health data deserves the highest level of protection and transparency.
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-header">
                    <h3>Privacy</h3>
                  </div>
                  <div className="feature-content">
                    <p><strong>Data Protection:</strong></p>
                    <ul>
                      <li>Secured by the highest level of encryption technology</li>
                      <li>Strict compliance with privacy regulations like HIPAA and GDPR standards</li>
                      <li>Complete control over your personal health information</li>
                      <li>Regular security audits and updates</li>
                    </ul>
                    <p><strong>Your Rights:</strong></p>
                    <ul>
                      <li>No data sharing or commercial use with third parties without your consent</li>
                      <li>Right to access, modify, or delete your data at any time</li>
                      <li>Clear consent processes for all data usage</li>
                      <li>Transparent privacy policy and terms of service</li>
                    </ul>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-header">
                    <h3>Transparency</h3>
                  </div>
                  <div className="feature-content">
                    <p><strong>AI Explainability:</strong></p>
                    <ul>
                      <li>Clear disclosure of AI analysis results and recommendations</li>
                      <li>Detailed explanations of how conclusions are reached</li>
                      <li>Source citations for all health recommendations</li>
                      <li>Regular updates on AI model improvements</li>
                    </ul>
                    <p><strong>User Empowerment:</strong></p>
                    <ul>
                      <li>Empowering you to make informed health decisions</li>
                      <li>Open communication about data usage and processing</li>
                      <li>Access to your complete health data history</li>
                      <li>Educational resources to understand your health metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
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