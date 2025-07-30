import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

/**
 * Handle Google OAuth callback and create/update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const googleCallback = (req, res) => {
  // User info will be available in req.user after passport authentication
  const { id, emails, name, photos } = req.user;
  
  // Create JWT token
  const token = jwt.sign(
    { 
      userId: req.user.id,
      email: emails[0].value,
      role: req.user.role || 'buyer'
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
  
  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-refreshTokens');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

export default {
  googleCallback,
  getProfile
};