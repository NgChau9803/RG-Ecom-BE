import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== SELLER SCHEMA ====================
const sellerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  shopDescription: String,
  shopLogo: String,
  shopBanner: String,
  businessInfo: {
    businessType: { type: String, enum: ['individual', 'company'], required: true },
    businessRegistrationNumber: String,
    taxId: String,
    businessAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  bankInfo: {
    bankName: String,
    accountNumber: String,
    accountHolderName: String,
    routingNumber: String
  },
  verification: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    verifiedAt: Date,
    rejectionReason: String
  },
  ratings: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  statistics: {
    totalProducts: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Seller', sellerSchema);