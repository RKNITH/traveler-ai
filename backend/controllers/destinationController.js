import Destination from '../models/Destination.js';

// @desc Get all destinations with filters
export const getDestinations = async (req, res, next) => {
  try {
    const { type, continent, search, featured, limit = 12, page = 1 } = req.query;
    const query = { isActive: true };

    if (type) query.type = type;
    if (continent) query.continent = continent;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort({ popularityScore: -1, isFeatured: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      count: destinations.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single destination
export const getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true
    });

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Increment popularity
    destination.popularityScore += 1;
    await destination.save();

    res.json({ success: true, destination });
  } catch (error) {
    next(error);
  }
};

// @desc Create destination (admin)
export const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, message: 'Destination created', destination });
  } catch (error) {
    next(error);
  }
};

// @desc Update destination (admin)
export const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.json({ success: true, message: 'Destination updated', destination });
  } catch (error) {
    next(error);
  }
};

// @desc Delete destination (admin)
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc Get featured destinations
export const getFeaturedDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ isActive: true, isFeatured: true }).limit(6).sort({ popularityScore: -1 });
    res.json({ success: true, destinations });
  } catch (error) {
    next(error);
  }
};
