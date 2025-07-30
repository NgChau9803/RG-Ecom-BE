import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== PRODUCT SCHEMA ====================
const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  
  // Product variants (for size, color, etc.)
  variants: [{
    name: String, // e.g., "Red-Large", "Blue-Medium"
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: Number, // Original price for discount calculation
    stock: { type: Number, required: true, min: 0 },
    attributes: [{
      name: String, // e.g., "Color", "Size"
      value: String // e.g., "Red", "Large"
    }],
    images: [String],
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  }],
  
  // Default pricing (for products without variants)
  basePrice: { type: Number, min: 0 },
  baseStock: { type: Number, min: 0, default: 0 },
  
  images: [String], // Main product images
  tags: [String],
  
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  
  // Product status
  status: { type: String, enum: ['draft', 'active', 'inactive', 'out_of_stock'], default: 'draft' },
  
  // Ratings and reviews
  ratings: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  
  // Statistics
  viewCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  
  // Shipping info
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 }
  },
  
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Product indexes
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ 'ratings.averageRating': -1 });
productSchema.index({ createdAt: -1 });
// variants.sku already has an index from unique: true in the schema

export default mongoose.model('Product', productSchema);