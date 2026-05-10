// Simple seed script to add demo farmers and contractors
const mongoose = require('mongoose');
const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrovision';

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected');
  await Farmer.deleteMany({});
  await Contractor.deleteMany({});
  const farmers = [
    { name: 'Ram Kumar', contact: '9999999999', location: 'Punjab', acreageHa: 2.5, crops: ['wheat'] },
    { name: 'Sita Devi', contact: '8888888888', location: 'Uttar Pradesh', acreageHa: 1.2, crops: ['rice'] },
  ];
  const contractors = [
    { name: 'AgriCorp', contact: '7777777777', region: 'Punjab', requiredAcreageHa: 5, crops: ['wheat','maize'] },
    { name: 'GreenWorks', contact: '6666666666', region: 'Bihar', requiredAcreageHa: 3, crops: ['rice'] },
  ];
  await Farmer.insertMany(farmers);
  await Contractor.insertMany(contractors);
  console.log('Seeded');
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
