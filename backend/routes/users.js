import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
router.get('/wishlist', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'title coverImage pricing duration destination averageRating');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (e) { next(e); }
});
export default router;
