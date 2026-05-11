const mongoose = require('mongoose');

const CropConfigSchema = new mongoose.Schema({
  cropName: { type: String, required: true, unique: true },
  msp: { type: Number, required: true },
  baseYieldPerHa: Number,
  cropSchedules: [{
    activity: String,
    dayOffset: Number,
    notes: String
  }],
  regions: [String],
  seasons: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CropConfig', CropConfigSchema);
