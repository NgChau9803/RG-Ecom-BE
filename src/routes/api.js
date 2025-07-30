import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);

// Add other routes here as they are created
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

export default router;