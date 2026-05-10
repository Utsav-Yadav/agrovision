const mongoose = require('mongoose');

const ContractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  region: String,
  requiredAcreageHa: Number,
  crops: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contractor', ContractorSchema);