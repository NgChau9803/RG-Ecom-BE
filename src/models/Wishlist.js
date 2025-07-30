import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== WISHLIST SCHEMA ====================
const wishlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Wishlist', wishlistSchema);