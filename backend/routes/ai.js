import express from 'express';
import { chatWithAI, generateItinerary, getAIHistory, getUserItineraries, getItinerary } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/chat', protect, chatWithAI);
router.post('/generate-itinerary', protect, generateItinerary);
router.get('/history', protect, getAIHistory);
router.get('/itineraries', protect, getUserItineraries);
router.get('/itineraries/:id', protect, getItinerary);
export default router;
