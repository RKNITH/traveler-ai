import { Review } from '../models/index.js';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';

// @desc    Create review
export const createReview = async (req, res, next) => {
  try {
    const { packageId, destinationId, bookingId, rating, title, review, categories, images, travelDate, travelType } = req.body;

    // Check for existing review
    const existingReview = await Review.findOne({
      user: req.user._id,
      ...(packageId && { package: packageId }),
      ...(destinationId && { destination: destinationId })
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this.' });
    }

    const newReview = await Review.create({
      user: req.user._id,
      package: packageId,
      destination: destinationId,
      booking: bookingId,
      rating, title, review, categories, images, travelDate, travelType
    });

    // Update average rating
    if (packageId) await updatePackageRating(packageId);
    if (destinationId) await updateDestinationRating(destinationId);

    const populated = await Review.findById(newReview._id).populate('user', 'name avatar');
    res.status(201).json({ success: true, message: 'Review submitted successfully!', review: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a package
export const getPackageReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = { package: req.params.packageId, isActive: true };

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const stats = await Review.aggregate([
      { $match: { package: reviews[0]?.package || null } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 }, ratingDist: { $push: '$rating' } } }
    ]);

    res.json({ success: true, reviews, total, pages: Math.ceil(total / limit), stats: stats[0] || {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a destination
export const getDestinationReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ destination: req.params.destinationId, isActive: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.isActive = false;
    await review.save();

    if (review.package) await updatePackageRating(review.package);
    if (review.destination) await updateDestinationRating(review.destination);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin respond to review
export const respondToReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { adminResponse: { text: req.body.response, respondedAt: new Date() } },
      { new: true }
    ).populate('user', 'name');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Response added', review });
  } catch (error) {
    next(error);
  }
};

// Helper: update package average rating
const updatePackageRating = async (packageId) => {
  const result = await Review.aggregate([
    { $match: { package: packageId, isActive: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  await Package.findByIdAndUpdate(packageId, {
    averageRating: result[0]?.avg?.toFixed(1) || 0,
    totalReviews: result[0]?.count || 0
  });
};

// Helper: update destination average rating
const updateDestinationRating = async (destinationId) => {
  const result = await Review.aggregate([
    { $match: { destination: destinationId, isActive: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  await Destination.findByIdAndUpdate(destinationId, {
    averageRating: result[0]?.avg?.toFixed(1) || 0,
    totalReviews: result[0]?.count || 0
  });
};
