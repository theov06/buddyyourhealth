const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.FRONTEND_URL || 'http://localhost:3004'}/auth/google/callback`
);

// @route   GET /api/oauth/google/url
// @desc    Get Google OAuth URL for redirect
// @access  Public
router.get('/google/url', (req, res) => {
  try {
    const url = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar'
      ],
      prompt: 'consent'
    });

    res.json({ success: true, url });
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate OAuth URL'
    });
  }
});

// @route   POST /api/oauth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.post('/google/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const googleUser = ticket.getPayload();

    // Extract user information
    const email = googleUser.email;
    const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || 'User';
    const lastName = googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '';
    const googleId = googleUser.sub;
    const picture = googleUser.picture;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google info
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture;
      }
      user.googleAccessToken = tokens.access_token;
      user.googleRefreshToken = tokens.refresh_token || user.googleRefreshToken;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        googleId,
        profilePicture: picture,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
        authProvider: 'google'
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        healthProfile: user.healthProfile,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    });
  }
});

// @route   POST /api/oauth/google
// @desc    Google OAuth login/signup
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential, clientId } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Decode the Google JWT token (without verification for now - in production, verify with Google)
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const googleUser = JSON.parse(jsonPayload);

    // Extract user information
    const email = googleUser.email;
    const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || 'User';
    const lastName = googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '';
    const googleId = googleUser.sub;
    const picture = googleUser.picture;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture;
        await user.save();
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        googleId,
        profilePicture: picture,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Random password for OAuth users
        authProvider: 'google'
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        healthProfile: user.healthProfile,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    });
  }
});

// @route   POST /api/oauth/apple
// @desc    Apple OAuth login/signup
// @access  Public
router.post('/apple', async (req, res) => {
  try {
    const { identityToken, user: appleUser } = req.body;

    if (!identityToken) {
      return res.status(400).json({
        success: false,
        message: 'Apple identity token is required'
      });
    }

    // Decode the Apple JWT token (without verification for now - in production, verify with Apple)
    const base64Url = identityToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const applePayload = JSON.parse(jsonPayload);

    // Extract user information
    const email = applePayload.email || appleUser?.email;
    const appleId = applePayload.sub;
    
    // Apple only provides name on first sign-in
    let firstName = 'User';
    let lastName = '';
    
    if (appleUser && appleUser.name) {
      firstName = appleUser.name.firstName || 'User';
      lastName = appleUser.name.lastName || '';
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for Apple sign-in'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Apple ID if not set
      if (!user.appleId) {
        user.appleId = appleId;
        await user.save();
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        appleId,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Random password for OAuth users
        authProvider: 'apple'
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Apple authentication successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        healthProfile: user.healthProfile,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Apple OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Apple authentication'
    });
  }
});

module.exports = router;
