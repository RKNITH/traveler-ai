import mongoose from 'mongoose';

// Payment Model
const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactionId: { type: String, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
  method: { type: String, enum: ['online', 'upi', 'bank_transfer', 'cash', 'manual'], default: 'online' },
  gateway: { type: String, default: 'manual' },
  receiptUrl: String,
  refundId: String,
  refundAmount: Number,
  metadata: { type: Map, of: String }
}, { timestamps: true });

// Review Model
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 100 },
  review: { type: String, required: true, maxlength: 1000 },
  categories: {
    accommodation: { type: Number, min: 1, max: 5 },
    transport: { type: Number, min: 1, max: 5 },
    guideService: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    meals: { type: Number, min: 1, max: 5 }
  },
  images: [String],
  travelDate: Date,
  travelType: { type: String, enum: ['solo', 'couple', 'family', 'friends', 'group'] },
  isVerified: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
  adminResponse: { text: String, respondedAt: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Itinerary Model
const itinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  destination: String,
  days: { type: Number, required: true },
  budget: Number,
  budgetType: { type: String, enum: ['budget', 'moderate', 'luxury'] },
  groupSize: { type: Number, default: 1 },
  groupType: { type: String, enum: ['solo', 'couple', 'family', 'friends'] },
  preferences: [String],
  season: String,
  dayPlans: [{
    day: Number,
    date: Date,
    title: String,
    description: String,
    activities: [{
      time: String,
      activity: String,
      location: String,
      duration: String,
      cost: Number,
      notes: String,
      category: String
    }],
    accommodation: { name: String, type: String, checkIn: String, checkOut: String, cost: Number },
    meals: [{ type: String, place: String, cuisine: String, cost: Number }],
    transport: [{ from: String, to: String, mode: String, duration: String, cost: Number }],
    tips: [String],
    totalDayCost: Number
  }],
  totalEstimatedCost: Number,
  currency: { type: String, default: 'INR' },
  isAIGenerated: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  isSaved: { type: Boolean, default: true },
  linkedPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' }
}, { timestamps: true });

// AI History Model
const aiHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  context: {
    destination: String,
    budget: Number,
    days: Number,
    preferences: [String],
    groupSize: Number,
    season: String
  },
  generatedItinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Coupon Model
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  maxDiscount: Number,
  minOrderAmount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  userLimit: { type: Number, default: 1 },
  applicablePackages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
  applicableDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
  applicableCategories: [String],
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
export const Review = mongoose.model('Review', reviewSchema);
export const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export const AIHistory = mongoose.model('AIHistory', aiHistorySchema);
export const Coupon = mongoose.model('Coupon', couponSchema);
