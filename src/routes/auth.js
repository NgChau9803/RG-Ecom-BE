import express from 'express';
import passport from 'passport';
import AuthController from '../controllers/AuthController.js';
import { authenticateJWT } from '../middlewares/jwt.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login', 
    session: false 
  }),
  AuthController.googleCallback
);

// Protected routes
router.get('/profile', authenticateJWT, AuthController.getProfile);

export default router;