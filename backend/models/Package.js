import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String,
  activities: [String],
  meals: { breakfast: Boolean, lunch: Boolean, dinner: Boolean },
  accommodation: String,
  transport: String,
  highlights: [String]
});

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true
  },
  slug: { type: String, unique: true, lowercase: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  category: {
    type: [String],
    enum: ['adventure', 'honeymoon', 'family', 'solo', 'group', 'luxury', 'budget', 'cultural', 'beach', 'mountain', 'wildlife', 'pilgrimage'],
    required: true
  },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 300 },
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true }
  },
  pricing: {
    basePrice: { type: Number, required: true },
    adultPrice: { type: Number, required: true },
    childPrice: { type: Number },
    infantPrice: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    discountPercentage: { type: Number, default: 0 },
    seasonalPricing: [{
      season: String,
      startMonth: Number,
      endMonth: Number,
      multiplier: { type: Number, default: 1 }
    }]
  },
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  coverImage: { type: String },
  itinerary: [itineraryDaySchema],
  inclusions: [String],
  exclusions: [String],
  highlights: [String],
  accommodation: {
    type: String,
    hotels: [{
      name: String,
      rating: Number,
      location: String,
      amenities: [String],
      images: [String]
    }]
  },
  transport: {
    fromCity: String,
    mode: [{ type: String, enum: ['flight', 'train', 'bus', 'car', 'cruise', 'ferry'] }],
    details: String
  },
  maxGroupSize: { type: Number, default: 20 },
  minGroupSize: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['easy', 'moderate', 'challenging', 'expert'], default: 'easy' },
  ageRestriction: { min: { type: Number, default: 0 }, max: { type: Number, default: 99 } },
  availability: {
    isAvailable: { type: Boolean, default: true },
    slots: { type: Number, default: 20 },
    bookedSlots: { type: Number, default: 0 },
    blackoutDates: [Date],
    departureDates: [Date]
  },
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

packageSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

// Virtual for discounted price
packageSchema.virtual('discountedPrice').get(function () {
  if (this.pricing.discountPercentage > 0) {
    return this.pricing.adultPrice * (1 - this.pricing.discountPercentage / 100);
  }
  return this.pricing.adultPrice;
});

packageSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Package', packageSchema);
