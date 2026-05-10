// Application model to record farmer<>contractor interactions
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' },
  message: String,
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
