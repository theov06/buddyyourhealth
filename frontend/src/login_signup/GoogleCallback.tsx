import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Auth.css';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Google sign-in was cancelled or failed');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Send code to backend
        const response = await fetch(`${process.env.REACT_APP_API_URL}/oauth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success && data.token) {
          // Store token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect to account page - the AuthContext will pick up the user from localStorage
          window.location.href = '/account';
        } else {
          setError(data.message || 'Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Error processing Google callback:', error);
        setError('Failed to complete sign-in');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {error ? (
            <>
              <h2 style={{ color: '#ff4444', marginBottom: '20px' }}>Error</h2>
              <p style={{ color: '#fff' }}>{error}</p>
              <p style={{ color: '#888', marginTop: '10px' }}>Redirecting to login...</p>
            </>
          ) : (
            <>
              <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>Completing Sign-In</h2>
              <p style={{ color: '#fff' }}>Please wait while we complete your Google sign-in...</p>
              <div className="loading-spinner" style={{ marginTop: '20px' }}>
                <div className="spinner"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
