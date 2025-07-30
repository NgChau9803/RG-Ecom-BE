import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== COUPON SCHEMA ====================
const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  description: String,
  
  // Discount details
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  maxDiscountAmount: Number, // For percentage discounts
  minOrderAmount: { type: Number, default: 0 },
  
  // Usage limits
  usageLimit: Number, // Total usage limit
  usageLimitPerUser: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  
  // Validity
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Applicable products/categories
  applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  applicableSellers: [{ type: Schema.Types.ObjectId, ref: 'Seller' }],
  
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' } // Admin who created it
}, {
  timestamps: true
});

export default mongoose.model('Coupon', couponSchema);