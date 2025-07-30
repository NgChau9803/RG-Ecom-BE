import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== SHIPPING SCHEMA ====================
const shippingSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  carrier: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'],
    default: 'pending'
  },
  trackingEvents: [{
    status: String,
    description: String,
    location: String,
    timestamp: Date
  }],
  estimatedDelivery: Date,
  actualDelivery: Date,
  shippingCost: Number
}, {
  timestamps: true
});

export default mongoose.model('Shipping', shippingSchema);