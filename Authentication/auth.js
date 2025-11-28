const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log(`🔐 Auth middleware - ${req.method} ${req.path}`);
  
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ Token verified for user:', decoded.userId);
    next();
  } catch (error) {
    console.log('❌ Invalid token:', error.message);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

module.exports = auth;