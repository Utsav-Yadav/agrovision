const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  contact: String,
  location: String,
  acreageHa: Number,
  crops: [String],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
FarmerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
FarmerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Farmer', FarmerSchema);