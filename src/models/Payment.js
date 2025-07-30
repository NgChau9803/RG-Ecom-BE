import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== PAYMENT SCHEMA ====================
const paymentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentMethod: { type: String, required: true },
  paymentGateway: String, // 'stripe', 'paypal', etc.
  transactionId: String,
  gatewayResponse: Schema.Types.Mixed,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paidAt: Date,
  refundedAt: Date,
  refundAmount: Number
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);