const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropType: String,
  sowingDate: Date,
  durationDays: Number,
  schedule: [{
    activity: String,
    date: Date,
    day: Number,
    duration: Number,
    notes: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
