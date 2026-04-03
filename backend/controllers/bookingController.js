import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import { Coupon } from '../models/index.js';

// @desc Create booking
export const createBooking = async (req, res, next) => {
  try {
    const {
      packageId, travelers, travelDates, pricing,
      specialRequests, roomType, pickupLocation, emergencyContact,
      couponCode, paymentMethod
    } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    if (!pkg.availability.isAvailable) {
      return res.status(400).json({ success: false, message: 'Package is not available for booking' });
    }

    // Count travelers
    const adults = travelers.filter(t => t.type === 'adult').length;
    const children = travelers.filter(t => t.type === 'child').length;
    const infants = travelers.filter(t => t.type === 'infant').length;

    // Calculate price
    let subtotal = (adults * pkg.pricing.adultPrice) +
                   (children * (pkg.pricing.childPrice || pkg.pricing.adultPrice * 0.7)) +
                   (infants * (pkg.pricing.infantPrice || 0));

    let couponDiscount = 0;
    let appliedCoupon = null;

    // Apply coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        const now = new Date();
        if (coupon.validFrom <= now && coupon.validUntil >= now && coupon.usedCount < coupon.usageLimit) {
          if (subtotal >= coupon.minOrderAmount) {
            if (coupon.discountType === 'percentage') {
              couponDiscount = Math.min(subtotal * coupon.discountValue / 100, coupon.maxDiscount || Infinity);
            } else {
              couponDiscount = Math.min(coupon.discountValue, subtotal);
            }
            appliedCoupon = coupon;
          }
        }
      }
    }

    const taxes = (subtotal - couponDiscount) * 0.05; // 5% tax
    const processingFee = 199;
    const totalAmount = subtotal - couponDiscount + taxes + processingFee;

    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      destination: pkg.destination,
      travelers,
      travelDates,
      pricing: {
        adultsCount: adults,
        childrenCount: children,
        infantsCount: infants,
        adultPrice: pkg.pricing.adultPrice,
        childPrice: pkg.pricing.childPrice,
        infantPrice: pkg.pricing.infantPrice,
        subtotal,
        couponCode: appliedCoupon?.code,
        couponDiscount,
        taxes,
        processingFee,
        totalAmount,
        currency: pkg.pricing.currency
      },
      specialRequests,
      roomType,
      pickupLocation,
      emergencyContact,
      paymentMethod: paymentMethod || 'online',
      loyaltyPointsEarned: Math.floor(totalAmount / 100)
    });

    // Update coupon usage
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    // Update package availability
    pkg.availability.bookedSlots += adults + children;
    pkg.totalBookings += 1;
    await pkg.save();

    const populated = await Booking.findById(booking._id)
      .populate('package', 'title coverImage duration')
      .populate('destination', 'name country');

    res.status(201).json({ success: true, message: 'Booking created successfully!', booking: populated });
  } catch (error) {
    next(error);
  }
};

// @desc Get user bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('package', 'title coverImage duration pricing destination')
      .populate('destination', 'name country')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({ success: true, bookings, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc Get booking by ID
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate('package')
      .populate('destination');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc Cancel booking
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    const daysUntilDeparture = Math.ceil((new Date(booking.travelDates.departureDate) - new Date()) / (1000 * 60 * 60 * 24));
    let refundPercentage = 0;

    if (daysUntilDeparture > 30) refundPercentage = 90;
    else if (daysUntilDeparture > 15) refundPercentage = 70;
    else if (daysUntilDeparture > 7) refundPercentage = 50;
    else if (daysUntilDeparture > 3) refundPercentage = 25;

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    booking.refundAmount = (booking.pricing.totalAmount * refundPercentage) / 100;
    await booking.save();

    res.json({
      success: true,
      message: `Booking cancelled. Refund of ₹${booking.refundAmount.toFixed(2)} (${refundPercentage}%) will be processed.`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin - Get all bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('package', 'title')
      .populate('destination', 'name country')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({ success: true, bookings, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc Admin - Update booking status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true }
    ).populate('user', 'name email').populate('package', 'title');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking status updated', booking });
  } catch (error) {
    next(error);
  }
};
