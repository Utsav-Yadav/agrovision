const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor', required: true },
  message: String,
  plannedRevenue: Number,
  termsAccepted: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'signed', 'accepted', 'rejected', 'active', 'completed'],
    default: 'pending'
  },
  farmerSignature: {
    name: String,
    date: Date,
    initials: String,
    contact: String,
    location: String,
    farmAcreage: Number
  },
  contractorSignature: {
    date: Date,
    signedBy: String
  },
  applicationDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
