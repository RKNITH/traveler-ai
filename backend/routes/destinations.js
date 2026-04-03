import express from 'express';
import { getDestinations, getDestination, createDestination, updateDestination, deleteDestination, getFeaturedDestinations } from '../controllers/destinationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/:id', getDestination);
router.post('/', protect, authorize('admin'), createDestination);
router.put('/:id', protect, authorize('admin'), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);
export default router;
