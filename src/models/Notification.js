import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== NOTIFICATION SCHEMA ====================
const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['order_update', 'payment', 'product', 'promotion', 'system'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: Schema.Types.Mixed, // Additional data specific to notification type
  isRead: { type: Boolean, default: false },
  readAt: Date
}, {
  timestamps: true
});

// Notification indexes
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);