import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import ParticleBackground from '../home/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { createAccount } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      await createAccount(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      // Account created successfully - redirect to login page
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please sign in with your credentials.',
          email: formData.email 
        } 
      });
    } catch (error: any) {
      setError(error.message || 'Account creation failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'WEAK';
      case 2:
      case 3: return 'MODERATE';
      case 4:
      case 5: return 'STRONG';
      default: return 'WEAK';
    }
  };

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return '#ff4444';
      case 2:
      case 3: return '#ffaa00';
      case 4:
      case 5: return '#00ff88';
      default: return '#ff4444';
    }
  };

  return (
    <div className="auth-container">
      <ParticleBackground />
      
      <div className="auth-content">
        <div className="auth-header">
          <Link to="/" className="logo">
            <img src="/logo/logo.png" alt="Buddy Your Health Logo" className="logo-image" />
            <span className="logo-text">BUDDY YOUR HEALTH®</span>
          </Link>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="form-header">
              <h1 className="form-title">CREATE ACCOUNT</h1>
              <p className="form-subtitle">Initialize your health journey</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message" style={{ marginBottom: '20px', textAlign: 'center' }}>
                  {error}
                </div>
              )}
              
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="firstName" className="input-label">FIRST NAME</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="John"
                    required
                  />
                  <div className="input-border"></div>
                </div>

                <div className="input-group">
                  <label htmlFor="lastName" className="input-label">LAST NAME</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="Doe"
                    required
                  />
                  <div className="input-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email" className="input-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="user@domain.com"
                  required
                />
                <div className="input-border"></div>
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">PASSWORD</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="••••••••••••"
                  required
                />
                <div className="input-border"></div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: getStrengthColor(passwordStrength)
                        }}
                      ></div>
                    </div>
                    <span 
                      className="strength-label"
                      style={{ color: getStrengthColor(passwordStrength) }}
                    >
                      {getStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="auth-input"
                  placeholder="••••••••••••"
                  required
                />
                <div className="input-border"></div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="error-message">Passwords do not match</span>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I agree to the <a href="#terms" className="auth-link">Terms of Service</a> and <a href="#privacy" className="auth-link">Privacy Policy</a>
                </label>
              </div>

              <button 
                type="submit" 
                className={`auth-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-text">
                    <span className="loading-dots">CREATING ACCOUNT</span>
                  </span>
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
            </div>
          </div>
        </div>

        <div className="auth-nav">
          <button onClick={handleBackClick} className="home-button">
            <span className="home-text">BACK</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;