import express from 'express';
import { createBooking, getUserBookings, getBooking, cancelBooking, getAllBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/', protect, authorize('admin', 'agent'), getAllBookings);
router.put('/:id/status', protect, authorize('admin', 'agent'), updateBookingStatus);
export default router;
