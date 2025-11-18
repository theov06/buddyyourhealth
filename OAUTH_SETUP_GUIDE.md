# 🔐 OAuth Setup Guide - Google & Apple Sign-In

## Overview

This guide will help you configure Google and Apple OAuth authentication for Buddy Your Health.

## Prerequisites

- Google Cloud Console account
- Apple Developer account (for Apple Sign-In)
- Your application domain/URL

---

## 🔵 Google Sign-In Setup

### ⚠️ IMPORTANT: Required Redirect URI Configuration

**You MUST add this redirect URI to your Google Cloud Console:**

`http://localhost:3004/auth/google/callback`

Without this, Google authentication will fail!

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "Buddy Your Health" or similar

### Step 2: Enable Google Sign-In API

1. Navigate to **APIs & Services** > **Library**
2. Search for "Google Sign-In API" or "Google Identity"
3. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure consent screen if prompted:
   - User Type: **External**
   - App name: **Buddy Your Health**
   - User support email: Your email
   - Developer contact: Your email
4. Application type: **Web application**
5. Name: **Buddy Your Health Web Client**
6. Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:3000
   https://yourdomain.com
   ```
7. Authorized redirect URIs:
   ```
   http://localhost:5173
   http://localhost:3000
   https://yourdomain.com
   ```
8. Click **Create**
9. **Copy the Client ID** - you'll need this!

### Step 4: Configure Frontend

1. Open `frontend/src/login_signup/Login.tsx`
2. Find this line:
   ```typescript
   const GOOGLE_CLIENT_ID = ''; // Add your Google Client ID here
   ```
3. Replace with your Client ID:
   ```typescript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```

### Step 5: Test Google Sign-In

1. Start your application
2. Go to login page
3. Click "Log-in with Google"
4. Select your Google account
5. Grant permissions
6. You should be logged in!

---

## 🍎 Apple Sign-In Setup

### Step 1: Apple Developer Account

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Enroll in Apple Developer Program (if not already)

### Step 2: Create App ID

1. Go to **Certificates, Identifiers & Profiles**
2. Click **Identifiers** > **+** (Add button)
3. Select **App IDs** > **Continue**
4. Select **App** > **Continue**
5. Description: **Buddy Your Health**
6. Bundle ID: `com.buddyyourhealth.app` (or your domain reversed)
7. Scroll down and enable **Sign In with Apple**
8. Click **Continue** > **Register**

### Step 3: Create Service ID

1. Go to **Identifiers** > **+** (Add button)
2. Select **Services IDs** > **Continue**
3. Description: **Buddy Your Health Web**
4. Identifier: `com.buddyyourhealth.web`
5. Enable **Sign In with Apple**
6. Click **Configure** next to Sign In with Apple
7. Primary App ID: Select the App ID you created
8. Web Domain: `yourdomain.com` (without http://)
9. Return URLs:
   ```
   https://yourdomain.com/auth/apple/callback
   http://localhost:5173/auth/apple/callback
   ```
10. Click **Save** > **Continue** > **Register**

### Step 4: Create Key

1. Go to **Keys** > **+** (Add button)
2. Key Name: **Buddy Your Health Sign In Key**
3. Enable **Sign In with Apple**
4. Click **Configure** > Select your App ID
5. Click **Save** > **Continue** > **Register**
6. **Download the key file** (.p8) - you can only download once!
7. Note the **Key ID** shown

### Step 5: Configure Frontend

1. Open `frontend/src/login_signup/Login.tsx`
2. Find this line:
   ```typescript
   const APPLE_CLIENT_ID = ''; // Add your Apple Client ID here
   ```
3. Replace with your Service ID:
   ```typescript
   const APPLE_CLIENT_ID = 'com.buddyyourhealth.web';
   ```

### Step 6: Test Apple Sign-In

1. Start your application
2. Go to login page
3. Click "Log-in with Apple"
4. Sign in with your Apple ID
5. Grant permissions
6. You should be logged in!

---

## 🔧 Environment Variables

### Backend (.env)

No additional environment variables needed for basic OAuth. The JWT_SECRET you already have will be used for all authentication methods.

### Frontend

For production, you may want to use environment variables:

Create `frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_APPLE_CLIENT_ID=com.buddyyourhealth.web
VITE_API_URL=http://localhost:5000/api
```

Then update `Login.tsx`:
```typescript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID || '';
```

---

## 🧪 Testing

### Test Google Sign-In
1. Click "Log-in with Google" button
2. Google popup should appear
3. Select account
4. Grant permissions
5. Should redirect to /account page

### Test Apple Sign-In
1. Click "Log-in with Apple" button
2. Apple popup should appear
3. Sign in with Apple ID
4. Grant permissions
5. Should redirect to /account page

### Test Regular Login
1. Regular email/password login should still work
2. All three methods should work independently

---

## 🔒 Security Notes

### Production Considerations

1. **Verify Tokens on Backend**
   - Currently, tokens are decoded without verification
   - In production, verify Google tokens with Google's API
   - Verify Apple tokens with Apple's public keys

2. **HTTPS Required**
   - OAuth providers require HTTPS in production
   - Use SSL certificates for your domain

3. **Secure Client IDs**
   - Store Client IDs in environment variables
   - Don't commit them to version control
   - Use different IDs for dev/staging/production

4. **CORS Configuration**
   - Ensure your backend allows requests from your frontend domain
   - Update CORS settings in production

---

## 📱 Mobile Support

Both Google and Apple Sign-In work on mobile browsers:
- **iOS Safari**: Full support for both
- **Android Chrome**: Full support for both
- **Mobile apps**: Would require native SDK integration

---

## 🐛 Troubleshooting

### Google Sign-In Not Working

**Issue**: Button doesn't respond
- **Solution**: Check if GOOGLE_CLIENT_ID is set
- **Solution**: Check browser console for errors
- **Solution**: Verify authorized origins in Google Console

**Issue**: "Popup blocked"
- **Solution**: Allow popups for your domain
- **Solution**: Check browser popup blocker settings

### Apple Sign-In Not Working

**Issue**: Button doesn't respond
- **Solution**: Check if APPLE_CLIENT_ID is set
- **Solution**: Verify Service ID configuration
- **Solution**: Check return URLs match exactly

**Issue**: "Invalid client"
- **Solution**: Verify Service ID is correct
- **Solution**: Check domain verification in Apple Developer Portal

### General Issues

**Issue**: "OAuth not configured" error
- **Solution**: Add Client IDs to Login.tsx
- **Solution**: Restart development server after changes

**Issue**: User created but not logged in
- **Solution**: Check backend OAuth routes are registered
- **Solution**: Verify JWT_SECRET is set in backend .env

---

## 📚 Additional Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [Apple Sign-In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [JWT Best Practices](https://jwt.io/introduction)

---

## ✅ Quick Start Checklist

- [ ] Create Google Cloud project
- [ ] Enable Google Sign-In API
- [ ] Create OAuth 2.0 credentials
- [ ] Copy Google Client ID to Login.tsx
- [ ] Create Apple App ID
- [ ] Create Apple Service ID
- [ ] Create Apple Key
- [ ] Copy Apple Service ID to Login.tsx
- [ ] Test Google Sign-In
- [ ] Test Apple Sign-In
- [ ] Test regular login still works
- [ ] Configure production domains
- [ ] Set up environment variables
- [ ] Deploy and test in production

---

**Note**: OAuth setup requires developer accounts and may take 15-30 minutes to configure properly. Once set up, users can sign in with one click!
