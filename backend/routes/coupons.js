import express from 'express';
import { validateCoupon } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/validate', protect, validateCoupon);
export default router;
