import express from 'express';
import { processPayment, getPaymentHistory, getPaymentByBooking } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/process', protect, processPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/booking/:bookingId', protect, getPaymentByBooking);
export default router;
