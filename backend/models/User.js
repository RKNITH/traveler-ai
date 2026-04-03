import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'agent'],
    default: 'user'
  },
  phone: { type: String, trim: true },
  avatar: { type: String, default: '' },
  dateOfBirth: { type: Date },
  nationality: { type: String },
  passportNumber: { type: String },
  preferences: {
    travelStyle: [{ type: String, enum: ['adventure', 'luxury', 'budget', 'cultural', 'nature', 'beach'] }],
    dietaryRestrictions: [String],
    roomPreference: { type: String, enum: ['single', 'double', 'twin', 'suite'] },
    notifications: { type: Boolean, default: true }
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
  loyaltyPoints: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: { type: Date }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return user without sensitive fields
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

export default mongoose.model('User', userSchema);
