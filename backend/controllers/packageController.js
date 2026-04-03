import Package from '../models/Package.js';

// @desc Get all packages with advanced filters
export const getPackages = async (req, res, next) => {
  try {
    const {
      destination, category, minPrice, maxPrice, duration,
      difficulty, search, featured, popular, sort = '-createdAt',
      limit = 12, page = 1
    } = req.query;

    const query = { isActive: true };

    if (destination) query.destination = destination;
    if (category) query.category = { $in: Array.isArray(category) ? category : [category] };
    if (difficulty) query.difficulty = difficulty;
    if (featured === 'true') query.isFeatured = true;
    if (popular === 'true') query.isPopular = true;

    if (minPrice || maxPrice) {
      query['pricing.adultPrice'] = {};
      if (minPrice) query['pricing.adultPrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.adultPrice'].$lte = Number(maxPrice);
    }

    if (duration) {
      const [min, max] = duration.split('-');
      query['duration.days'] = {};
      if (min) query['duration.days'].$gte = Number(min);
      if (max) query['duration.days'].$lte = Number(max);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .populate('destination', 'name country coverImage')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      count: packages.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      packages
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single package
export const getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true
    }).populate('destination', 'name country coverImage climate visaInfo currency');

    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    res.json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc Create package (admin)
export const createPackage = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const pkg = await Package.create(req.body);
    const populated = await pkg.populate('destination', 'name country');
    res.status(201).json({ success: true, message: 'Package created successfully', package: populated });
  } catch (error) {
    next(error);
  }
};

// @desc Update package (admin)
export const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('destination', 'name country');
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package updated', package: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc Delete package (admin)
export const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc Get featured packages
export const getFeaturedPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true, isFeatured: true })
      .populate('destination', 'name country')
      .limit(8)
      .sort({ totalBookings: -1 });
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

// @desc Get popular packages
export const getPopularPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true })
      .populate('destination', 'name country coverImage')
      .sort({ totalBookings: -1, averageRating: -1 })
      .limit(6);
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

// @desc Check availability
export const checkAvailability = async (req, res, next) => {
  try {
    const { date, travelers } = req.body;
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    const isBlackout = pkg.availability.blackoutDates?.some(bd =>
      new Date(bd).toDateString() === new Date(date).toDateString()
    );

    const availableSlots = pkg.availability.slots - pkg.availability.bookedSlots;
    const isAvailable = pkg.availability.isAvailable && !isBlackout && availableSlots >= (travelers || 1);

    res.json({ success: true, isAvailable, availableSlots, package: pkg.title });
  } catch (error) {
    next(error);
  }
};
