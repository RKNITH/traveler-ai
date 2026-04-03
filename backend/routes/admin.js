import express from 'express';
import { getDashboardStats, getAllUsers, toggleUserStatus, updateUserRole, createCoupon, getCoupons, toggleCoupon, validateCoupon } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/status', protect, authorize('admin'), toggleUserStatus);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.post('/coupons', protect, authorize('admin'), createCoupon);
router.get('/coupons', protect, authorize('admin'), getCoupons);
router.put('/coupons/:id/toggle', protect, authorize('admin'), toggleCoupon);
export default router;
