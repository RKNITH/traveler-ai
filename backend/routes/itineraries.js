import express from 'express';
import { Itinerary } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, itineraries });
  } catch (e) { next(e); }
});
router.get('/:id', protect, async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({ _id: req.params.id, user: req.user._id });
    if (!itinerary) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, itinerary });
  } catch (e) { next(e); }
});
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Itinerary.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Itinerary deleted' });
  } catch (e) { next(e); }
});
export default router;
