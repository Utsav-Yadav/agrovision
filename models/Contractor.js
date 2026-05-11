const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ContractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, sparse: true, lowercase: true },
  password: { type: String },
  contact: String,
  region: String,
  requiredAcreageHa: Number,
  crops: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

ContractorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

ContractorSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Contractor', ContractorSchema);