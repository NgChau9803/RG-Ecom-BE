import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/index.js';

/**
 * Configure Passport with Google OAuth 2.0 strategy
 */
export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });
          
          if (!user) {
            // Check if user exists with the same email
            user = await User.findOne({ email: profile.emails[0].value });
            
            if (user) {
              // Update existing user with Google ID
              user.googleId = profile.id;
              await user.save();
            } else {
              // Create new user
              user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                profile: {
                  firstName: profile.name.givenName || profile.displayName.split(' ')[0],
                  lastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' '),
                  avatar: profile.photos[0].value
                },
                isEmailVerified: true,
                lastLogin: new Date()
              });
            }
          } else {
            // Update last login time
            user.lastLogin = new Date();
            await user.save();
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};