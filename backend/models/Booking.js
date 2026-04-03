import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const travelerSchema = new mongoose.Schema({
  type: { type: String, enum: ['adult', 'child', 'infant'], required: true },
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  passportNumber: String,
  passportExpiry: Date,
  nationality: String,
  dietaryRequirements: String,
  specialNeeds: String
});

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    default: () => 'BK' + uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase()
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  travelers: [travelerSchema],
  travelDates: {
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    duration: Number
  },
  pricing: {
    adultsCount: { type: Number, default: 1 },
    childrenCount: { type: Number, default: 0 },
    infantsCount: { type: Number, default: 0 },
    adultPrice: Number,
    childPrice: Number,
    infantPrice: { type: Number, default: 0 },
    subtotal: Number,
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    processingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['online', 'upi', 'bank_transfer', 'cash'], default: 'online' },
  specialRequests: String,
  roomType: { type: String, enum: ['single', 'double', 'twin', 'triple', 'suite'] },
  pickupLocation: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  notes: String,
  cancellationReason: String,
  refundAmount: Number,
  loyaltyPointsEarned: { type: Number, default: 0 },
  loyaltyPointsUsed: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate duration automatically
bookingSchema.pre('save', function(next) {
  if (this.travelDates.departureDate && this.travelDates.returnDate) {
    const diff = this.travelDates.returnDate - this.travelDates.departureDate;
    this.travelDates.duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
