import express from 'express';
import { createReview, getPackageReviews, getDestinationReviews, deleteReview, respondToReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.post('/', protect, createReview);
router.get('/package/:packageId', getPackageReviews);
router.get('/destination/:destinationId', getDestinationReviews);
router.delete('/:id', protect, deleteReview);
router.put('/:id/respond', protect, authorize('admin'), respondToReview);
export default router;
