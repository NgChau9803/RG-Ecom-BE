import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import passportConfig from './src/config/passport.js';
import apiRoutes from './src/routes/api.js';
dotenv.config();
  
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Initialize Passport
app.use(passport.initialize());
passportConfig();

// Routes
app.get("/", (_, response) => {
    response.send(`API Server running on port ${process.env.PORT}`);
});

// API Routes
app.use('/api', apiRoutes);


// Connect to MongoDB first
try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connected to MongoDB');
  
  // Start server after successful database connection
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
} catch (err) {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit with error if database connection fails
}
