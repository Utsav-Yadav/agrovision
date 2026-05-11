const mongoose = require('mongoose');

const RevenueRequestSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', sparse: true },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor', sparse: true },
  fieldSizeHa: Number,
  cropType: String,
  season: String,
  soilQuality: Number,
  result: Object,
  userId: String,
  metadata: {
    ip: String,
    userAgent: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RevenueRequest', RevenueRequestSchema);