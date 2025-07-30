// MongoDB Schema for E-commerce Platform (Shopee-like)
// Using Mongoose for Node.js/Express backend

import mongoose from 'mongoose';
const { Schema } = mongoose;

// ==================== USER SCHEMA ====================
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    default: 'buyer'
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    avatar: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] }
  },
  addresses: [{
    label: { type: String, default: 'Home' }, // Home, Office, etc.
    fullName: String,
    phone: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  refreshTokens: [String], // For JWT refresh tokens
}, {
  timestamps: true
});

// ==================== SELLER SCHEMA ====================
const sellerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  shopDescription: String,
  shopLogo: String,
  shopBanner: String,
  businessInfo: {
    businessType: { type: String, enum: ['individual', 'company'], required: true },
    businessRegistrationNumber: String,
    taxId: String,
    businessAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  bankInfo: {
    bankName: String,
    accountNumber: String,
    accountHolderName: String,
    routingNumber: String
  },
  verification: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    verifiedAt: Date,
    rejectionReason: String
  },
  ratings: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  statistics: {
    totalProducts: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

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

// ==================== COUPON SCHEMA ====================
const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  description: String,
  
  // Discount details
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  maxDiscountAmount: Number, // For percentage discounts
  minOrderAmount: { type: Number, default: 0 },
  
  // Usage limits
  usageLimit: Number, // Total usage limit
  usageLimitPerUser: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  
  // Validity
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Applicable products/categories
  applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  applicableSellers: [{ type: Schema.Types.ObjectId, ref: 'Seller' }],
  
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' } // Admin who created it
}, {
  timestamps: true
});

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

// ==================== INDEXES ====================
// User indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });

// Product indexes
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ 'ratings.averageRating': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'variants.sku': 1 });

// Order indexes
orderSchema.index({ buyer: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.seller': 1 });

// Review indexes
reviewSchema.index({ product: 1 });
reviewSchema.index({ buyer: 1 });
reviewSchema.index({ seller: 1 });
reviewSchema.index({ rating: -1 });

// Cart indexes
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Notification indexes
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// ==================== MODELS ====================
export default {
  User: mongoose.model('User', userSchema),
  Seller: mongoose.model('Seller', sellerSchema),
  Category: mongoose.model('Category', categorySchema),
  Product: mongoose.model('Product', productSchema),
  Cart: mongoose.model('Cart', cartSchema),
  Order: mongoose.model('Order', orderSchema),
  Review: mongoose.model('Review', reviewSchema),
  Coupon: mongoose.model('Coupon', couponSchema),
  Wishlist: mongoose.model('Wishlist', wishlistSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Payment: mongoose.model('Payment', paymentSchema),
  Shipping: mongoose.model('Shipping', shippingSchema),
  AdminLog: mongoose.model('AdminLog', adminLogSchema)
};

// ==================== USAGE EXAMPLE ====================
/*
// Example of creating a new user
const newUser = new User({
  email: 'john@example.com',
  password: 'hashedPassword',
  role: 'buyer',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890'
  }
});

// Example of creating a product with variants
const newProduct = new Product({
  name: 'Wireless Headphones',
  slug: 'wireless-headphones-xyz',
  description: 'High-quality wireless headphones with noise cancellation',
  seller: sellerId,
  category: categoryId,
  variants: [
    {
      name: 'Black',
      sku: 'WH-BLACK-001',
      price: 199.99,
      stock: 50,
      attributes: [{ name: 'Color', value: 'Black' }],
      images: ['black-headphones-1.jpg', 'black-headphones-2.jpg']
    },
    {
      name: 'White',
      sku: 'WH-WHITE-001',
      price: 199.99,
      stock: 30,
      attributes: [{ name: 'Color', value: 'White' }],
      images: ['white-headphones-1.jpg', 'white-headphones-2.jpg']
    }
  ],
  images: ['headphones-main.jpg'],
  status: 'active'
});
*/