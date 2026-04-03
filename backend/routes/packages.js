import express from 'express';
import { getPackages, getPackage, createPackage, updatePackage, deletePackage, getFeaturedPackages, getPopularPackages, checkAvailability } from '../controllers/packageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getPackages);
router.get('/featured', getFeaturedPackages);
router.get('/popular', getPopularPackages);
router.get('/:id', getPackage);
router.post('/:id/check-availability', checkAvailability);
router.post('/', protect, authorize('admin', 'agent'), createPackage);
router.put('/:id', protect, authorize('admin', 'agent'), updatePackage);
router.delete('/:id', protect, authorize('admin'), deletePackage);
export default router;
