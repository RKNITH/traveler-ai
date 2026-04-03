import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    unique: true
  },
  slug: { type: String, unique: true, lowercase: true },
  country: { type: String, required: true },
  continent: {
    type: String,
    enum: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Antarctica'],
    required: true
  },
  type: {
    type: String,
    enum: ['domestic', 'international'],
    required: true
  },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  coverImage: { type: String },
  location: {
    coordinates: { lat: Number, lng: Number },
    address: String,
    timezone: String
  },
  climate: {
    bestMonths: [String],
    temperature: { min: Number, max: Number, unit: { type: String, default: 'C' } },
    rainfall: String
  },
  highlights: [String],
  thingsToDo: [{ title: String, description: String, category: String }],
  travelTips: [String],
  visaInfo: {
    required: Boolean,
    onArrival: Boolean,
    eVisa: Boolean,
    processingDays: Number,
    fee: Number,
    notes: String
  },
  currency: { code: String, name: String, exchangeRate: Number },
  language: [String],
  safetyRating: { type: Number, min: 1, max: 5, default: 4 },
  popularityScore: { type: Number, default: 0 },
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug
destinationSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Destination', destinationSchema);
