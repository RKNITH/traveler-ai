import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import { Review, Payment, Coupon } from '../models/index.js';

// @desc    Get dashboard analytics
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers, newUsersThisMonth,
      totalBookings, bookingsThisMonth, bookingsLastMonth,
      totalRevenue, revenueThisMonth, revenueLastMonth,
      totalPackages, totalDestinations,
      pendingBookings, confirmedBookings,
      recentBookings, topPackages, revenueByMonth
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.aggregate([{ $match: { status: 'completed', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.aggregate([{ $match: { status: 'completed', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Package.countDocuments({ isActive: true }),
      Destination.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.find().populate('user', 'name email').populate('package', 'title').sort({ createdAt: -1 }).limit(5),
      Booking.aggregate([
        { $group: { _id: '$package', count: { $sum: 1 }, revenue: { $sum: '$pricing.totalAmount' } } },
        { $sort: { count: -1 } }, { $limit: 5 },
        { $lookup: { from: 'packages', localField: '_id', foreignField: '_id', as: 'package' } },
        { $unwind: '$package' },
        { $project: { title: '$package.title', count: 1, revenue: 1 } }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 12 }
      ])
    ]);

    const totalRev = totalRevenue[0]?.total || 0;
    const monthRev = revenueThisMonth[0]?.total || 0;
    const lastMonthRev = revenueLastMonth[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, newThisMonth: newUsersThisMonth },
        bookings: {
          total: totalBookings,
          thisMonth: bookingsThisMonth,
          lastMonth: bookingsLastMonth,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          growth: bookingsLastMonth > 0 ? (((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth) * 100).toFixed(1) : 100
        },
        revenue: {
          total: totalRev,
          thisMonth: monthRev,
          lastMonth: lastMonthRev,
          growth: lastMonthRev > 0 ? (((monthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1) : 100
        },
        packages: { total: totalPackages },
        destinations: { total: totalDestinations }
      },
      recentBookings,
      topPackages,
      revenueByMonth
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User role updated', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Coupon created', coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle coupon status
export const toggleCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon (user)
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });

    const now = new Date();
    if (coupon.validFrom > now || coupon.validUntil < now) {
      return res.status(400).json({ success: false, message: 'Coupon has expired or not yet valid' });
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }
    if (amount < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minOrderAmount}` });
    }

    let discount = coupon.discountType === 'percentage'
      ? Math.min(amount * coupon.discountValue / 100, coupon.maxDiscount || Infinity)
      : Math.min(coupon.discountValue, amount);

    res.json({
      success: true,
      message: `Coupon applied! You save ₹${discount.toFixed(2)}`,
      coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount }
    });
  } catch (error) {
    next(error);
  }
};
