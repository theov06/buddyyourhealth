import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import ParticleBackground from '../home/ParticleBackground';
import LightBackground from '../home/LightBackground';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if we came from signup with a success message
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location.state]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Login successful - redirect to manage account page
      navigate('/account');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {theme === 'dark' ? <ParticleBackground /> : <LightBackground />}
      
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
              <h1 className="form-title">SIGN IN</h1>
              <p className="form-subtitle">Enter your information to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {successMessage && (
                <div className="success-message" style={{ marginBottom: '20px', textAlign: 'center', color: '#00ff88' }}>
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="error-message" style={{ marginBottom: '20px', textAlign: 'center' }}>
                  {error}
                </div>
              )}
              
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
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                className={`auth-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-text">
                    <span className="loading-dots">SIGNING IN</span>
                  </span>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>New to the system? <Link to="/signup" className="auth-link">Create Account</Link></p>
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

export default Login;