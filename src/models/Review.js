import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== REVIEW SCHEMA ====================
const reviewSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: String,
  images: [String], // Review images
  isVerifiedPurchase: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  
  // Seller response
  sellerResponse: {
    comment: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Review indexes
reviewSchema.index({ product: 1 });
reviewSchema.index({ buyer: 1 });
reviewSchema.index({ seller: 1 });
reviewSchema.index({ rating: -1 });

export default mongoose.model('Review', reviewSchema);