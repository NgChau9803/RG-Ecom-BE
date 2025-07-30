import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== USER SCHEMA ====================
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null/undefined values (for potential future auth methods)
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    default: 'buyer'
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    avatar: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] }
  },
  addresses: [{
    label: { type: String, default: 'Home' }, // Home, Office, etc.
    fullName: String,
    phone: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  refreshTokens: [String], // For JWT refresh tokens
}, {
  timestamps: true
});

// User indexes
// email already has an index from unique: true
userSchema.index({ role: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });

export default mongoose.model('User', userSchema);