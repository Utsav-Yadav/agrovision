const mongoose = require('mongoose');

const RevenueRequestSchema = new mongoose.Schema({
  fieldSizeHa: Number,
  cropType: String,
  season: String,
  soilQuality: Number,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RevenueRequest', RevenueRequestSchema);