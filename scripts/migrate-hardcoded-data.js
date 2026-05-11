require('dotenv').config();
const mongoose = require('mongoose');
const CropConfig = require('../models/CropConfig');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

const migrateHardcodedData = async () => {
  const crops = [
    {
      cropName: 'Wheat',
      msp: 2150,
      baseYieldPerHa: 3000,
      regions: ['Punjab', 'Haryana', 'Uttar Pradesh'],
      seasons: ['Rabi'],
      cropSchedules: [
        { activity: 'Land Preparation', dayOffset: 0, duration: 10 },
        { activity: 'Sowing', dayOffset: 10, duration: 5 },
        { activity: 'Weed Control', dayOffset: 30, duration: 5 },
        { activity: 'Fertilizer Application', dayOffset: 45, duration: 3 },
        { activity: 'Pest Management', dayOffset: 60, duration: 3 },
        { activity: 'Harvesting', dayOffset: 120, duration: 10 }
      ]
    },
    {
      cropName: 'Rice',
      msp: 1868,
      baseYieldPerHa: 3500,
      regions: ['Bihar', 'West Bengal', 'Punjab'],
      seasons: ['Kharif'],
      cropSchedules: [
        { activity: 'Nursery Preparation', dayOffset: 0, duration: 7 },
        { activity: 'Field Preparation', dayOffset: 7, duration: 14 },
        { activity: 'Transplanting', dayOffset: 21, duration: 7 },
        { activity: 'Weed Control', dayOffset: 35, duration: 5 },
        { activity: 'Pest Management', dayOffset: 50, duration: 3 },
        { activity: 'Harvesting', dayOffset: 120, duration: 10 }
      ]
    },
    {
      cropName: 'Maize',
      msp: 1870,
      baseYieldPerHa: 4000,
      regions: ['Madhya Pradesh', 'Karnataka'],
      seasons: ['Kharif', 'Rabi'],
      cropSchedules: [
        { activity: 'Soil Preparation', dayOffset: 0, duration: 5 },
        { activity: 'Sowing', dayOffset: 5, duration: 3 },
        { activity: 'Weed Control', dayOffset: 30, duration: 5 },
        { activity: 'Fertilizer Application', dayOffset: 45, duration: 3 },
        { activity: 'Tasseling', dayOffset: 60, duration: 5 },
        { activity: 'Harvesting', dayOffset: 110, duration: 10 }
      ]
    },
    {
      cropName: 'Cotton',
      msp: 5550,
      baseYieldPerHa: 800,
      regions: ['Gujarat', 'Maharashtra', 'Telangana'],
      seasons: ['Kharif'],
      cropSchedules: [
        { activity: 'Field Preparation', dayOffset: 0, duration: 10 },
        { activity: 'Sowing', dayOffset: 10, duration: 5 },
        { activity: 'Weed Control', dayOffset: 30, duration: 7 },
        { activity: 'Fertilizer Application', dayOffset: 45, duration: 3 },
        { activity: 'Pest Management', dayOffset: 60, duration: 5 },
        { activity: 'Picking', dayOffset: 150, duration: 30 }
      ]
    },
    {
      cropName: 'Sugarcane',
      msp: 2900,
      baseYieldPerHa: 60000,
      regions: ['Uttar Pradesh', 'Maharashtra'],
      seasons: ['Year-round'],
      cropSchedules: [
        { activity: 'Field Preparation', dayOffset: 0, duration: 10 },
        { activity: 'Planting', dayOffset: 10, duration: 5 },
        { activity: 'Irrigation', dayOffset: 30, duration: 5 },
        { activity: 'Harvesting', dayOffset: 300, duration: 20 }
      ]
    },
    {
      cropName: 'Groundnut',
      msp: 5550,
      baseYieldPerHa: 1500,
      regions: ['Gujarat', 'Andhra Pradesh'],
      seasons: ['Kharif'],
      cropSchedules: [
        { activity: 'Land Preparation', dayOffset: 0, duration: 10 },
        { activity: 'Sowing', dayOffset: 10, duration: 5 },
        { activity: 'Weeding', dayOffset: 45, duration: 5 },
        { activity: 'Harvesting', dayOffset: 120, duration: 10 }
      ]
    }
  ];

  try {
    for (const crop of crops) {
      await CropConfig.updateOne(
        { cropName: crop.cropName },
        { $set: crop },
        { upsert: true }
      );
      console.log(`✓ Migrated: ${crop.cropName}`);
    }
    console.log(`\n[SUCCESS] Migrated ${crops.length} crops to CropConfig`);
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrovision';

connectDB(MONGODB_URI).then(() => {
  migrateHardcodedData().then(() => {
    console.log('Migration complete. Exiting...');
    process.exit(0);
  });
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
