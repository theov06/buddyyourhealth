// OAuth Service for Google and Apple Sign-In

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface OAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}

class OAuthService {
  private googleInitialized = false;
  private appleInitialized = false;

  // Google Sign-In
  async googleSignIn(credential: string, clientId: string): Promise<OAuthResponse> {
    try {
      const response = await fetch(`${API_URL}/oauth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential, clientId }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store token
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        message: 'Failed to sign in with Google',
      };
    }
  }

  // Apple Sign-In
  async appleSignIn(identityToken: string, user?: any): Promise<OAuthResponse> {
    try {
      const response = await fetch(`${API_URL}/oauth/apple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identityToken, user }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store token
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      console.error('Apple sign-in error:', error);
      return {
        success: false,
        message: 'Failed to sign in with Apple',
      };
    }
  }

  // Initialize Google Sign-In
  initializeGoogleSignIn(clientId: string, callback: (response: any) => void) {
    // Prevent duplicate initialization
    if (this.googleInitialized) {
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    if (existingScript) {
      // Script already loaded, just initialize
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: callback,
        });
        this.googleInitialized = true;
      }
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize Google Sign-In
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: callback,
        });
        this.googleInitialized = true;
      }
    };
    document.head.appendChild(script);
  }

  // Initialize Apple Sign-In
  initializeAppleSignIn(clientId: string, redirectURI: string) {
    // Prevent duplicate initialization
    if (this.appleInitialized) {
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="appleid.cdn-apple.com"]');
    
    if (existingScript) {
      // Script already loaded, just initialize
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: clientId,
          scope: 'name email',
          redirectURI: redirectURI,
          usePopup: true,
        });
        this.appleInitialized = true;
      }
      return;
    }

    // Load Apple Sign-In script
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: clientId,
          scope: 'name email',
          redirectURI: redirectURI,
          usePopup: true,
        });
        this.appleInitialized = true;
      }
    };
    document.head.appendChild(script);
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: any;
    AppleID?: any;
  }
}

export default new OAuthService();
