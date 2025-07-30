import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== CATEGORY SCHEMA ====================
const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  level: { type: Number, default: 0 }, // 0 for root categories, 1 for subcategories, etc.
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);