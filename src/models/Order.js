import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== ORDER SCHEMA ====================
const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: String, // Store product name at time of order
    variant: String,
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true }
  }],
  
  // Pricing breakdown
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Shipping information
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Payment information
  paymentMethod: { type: String, required: true }, // 'card', 'paypal', 'bank_transfer', etc.
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String, // Payment gateway transaction ID
  
  // Tracking
  trackingNumber: String,
  carrier: String,
  
  // Timestamps for different stages
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  
  // Notes
  buyerNotes: String,
  adminNotes: String,
  
  // Coupon/Discount
  couponUsed: { type: Schema.Types.ObjectId, ref: 'Coupon' }
}, {
  timestamps: true
});

// Order indexes
orderSchema.index({ buyer: 1 });
// orderNumber already has an index from unique: true
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.seller': 1 });

export default mongoose.model('Order', orderSchema);