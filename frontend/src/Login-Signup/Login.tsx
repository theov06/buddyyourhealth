import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import ParticleBackground from '../Home/ParticleBackground';
import LightBackground from '../Home/LightBackground';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import OAuthService from '../services/oauthService';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const APPLE_CLIENT_ID = process.env.REACT_APP_APPLE_CLIENT_ID || '';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

    // Initialize Google Sign-In
    if (GOOGLE_CLIENT_ID) {
      OAuthService.initializeGoogleSignIn(GOOGLE_CLIENT_ID, handleGoogleResponse);
    }

    // Initialize Apple Sign-In
    if (APPLE_CLIENT_ID) {
      const redirectURI = `${window.location.origin}/auth/apple/callback`;
      OAuthService.initializeAppleSignIn(APPLE_CLIENT_ID, redirectURI);
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

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    setError('');

    try {
      await loginWithGoogle(response.credential, GOOGLE_CLIENT_ID);
      navigate('/loading/home');
    } catch (error: any) {
      setError(error.message || 'Google sign-in failed. Please try again.');
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Sign-In is not configured. Please add your Google Client ID.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get the Google OAuth URL from backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/oauth/google/url`);
      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Google sign-in page
        window.location.href = data.url;
      } else {
        setError('Failed to initiate Google sign-in');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
      setError('Failed to initiate Google sign-in');
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!APPLE_CLIENT_ID) {
      setError('Apple Sign-In is not configured. Please add your Apple Client ID.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (window.AppleID) {
        const data = await window.AppleID.auth.signIn();
        await loginWithApple(data.authorization.id_token, data.user);
        navigate('/loading/home');
      }
    } catch (error: any) {
      if (error.error !== 'popup_closed_by_user') {
        setError(error.message || 'Apple sign-in failed. Please try again.');
        console.error('Apple sign-in error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Login successful - redirect to home page
      navigate('/loading/home');
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

              <div className="social-auth-buttons">
                <button 
                  type="button" 
                  className="social-auth-button google-button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
                <button 
                  type="button" 
                  className="social-auth-button apple-button"
                  onClick={handleAppleSignIn}
                  disabled={isLoading}
                >
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
                  </svg>
                  Sign in with Apple
                </button>
              </div>

              <div className="auth-divider">
                <span className="divider-line"></span>
                <span className="divider-text">OR</span>
                <span className="divider-line"></span>
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
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-icon">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;