import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== ADMIN LOG SCHEMA ====================
const adminLogSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // 'create', 'update', 'delete', etc.
  resource: { type: String, required: true }, // 'user', 'product', 'order', etc.
  resourceId: Schema.Types.ObjectId,
  details: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

export default mongoose.model('AdminLog', adminLogSchema);