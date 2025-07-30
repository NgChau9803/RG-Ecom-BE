import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== CART SCHEMA ====================
const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: String, // variant name or ID if product has variants
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price at time of adding to cart
    seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true }
  }],
  totalAmount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
}, {
  timestamps: true
});

// Cart indexes
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Cart', cartSchema);