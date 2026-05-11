const CropConfig = require('../models/CropConfig');

const defaultMSP = {
  wheat: 2150,
  rice: 1868,
  maize: 1870,
  cotton: 5550,
  sugarcane: 2900,
  groundnut: 5550
};

exports.getCropConfig = async (cropType) => {
  try {
    const config = await CropConfig.findOne({
      cropName: new RegExp('^' + cropType + '$', 'i')
    });
    return config;
  } catch (err) {
    console.error('Error fetching crop config:', err);
    return null;
  }
};

exports.getAllCrops = async () => {
  try {
    const crops = await CropConfig.find().sort({ cropName: 1 });
    return crops;
  } catch (err) {
    console.error('Error fetching all crops:', err);
    return [];
  }
};

exports.getMSPData = async () => {
  try {
    const configs = await CropConfig.find().select('cropName msp');
    if (configs.length > 0) {
      const mspData = {};
      configs.forEach(c => {
        mspData[c.cropName] = c.msp;
      });
      return mspData;
    }
  } catch (err) {
    console.error('CropConfig lookup failed, using fallback:', err.message);
  }
  return defaultMSP;
};

exports.getCropSchedules = async (cropType) => {
  try {
    const config = await this.getCropConfig(cropType);
    if (config && config.cropSchedules) {
      return config.cropSchedules;
    }
  } catch (err) {
    console.error('Error fetching crop schedules:', err);
  }
  return [];
};

exports.syncHardcodedDataToDatabase = async () => {
  try {
    const crops = [
      { cropName: 'Wheat', msp: 2150, baseYieldPerHa: 3000, regions: ['Punjab', 'Haryana', 'Uttar Pradesh'], seasons: ['Rabi'] },
      { cropName: 'Rice', msp: 1868, baseYieldPerHa: 3500, regions: ['Bihar', 'West Bengal', 'Punjab'], seasons: ['Kharif'] },
      { cropName: 'Maize', msp: 1870, baseYieldPerHa: 4000, regions: ['Madhya Pradesh', 'Karnataka'], seasons: ['Kharif', 'Rabi'] },
      { cropName: 'Cotton', msp: 5550, baseYieldPerHa: 800, regions: ['Gujarat', 'Maharashtra', 'Telangana'], seasons: ['Kharif'] },
      { cropName: 'Sugarcane', msp: 2900, baseYieldPerHa: 60000, regions: ['Uttar Pradesh', 'Maharashtra'], seasons: ['Year-round'] },
      { cropName: 'Groundnut', msp: 5550, baseYieldPerHa: 1500, regions: ['Gujarat', 'Andhra Pradesh'], seasons: ['Kharif'] }
    ];

    for (const crop of crops) {
      await CropConfig.updateOne(
        { cropName: crop.cropName },
        { $set: crop },
        { upsert: true }
      );
    }

    console.log('[configService] Hardcoded crop data synced to database');
    return crops.length;
  } catch (err) {
    console.error('Error syncing hardcoded data:', err);
    throw err;
  }
};

exports.createOrUpdateCropConfig = async (cropName, data) => {
  try {
    return await CropConfig.findOneAndUpdate(
      { cropName },
      { $set: data },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('Error creating/updating crop config:', err);
    throw err;
  }
};

exports.deleteCropConfig = async (cropName) => {
  try {
    return await CropConfig.deleteOne({ cropName });
  } catch (err) {
    console.error('Error deleting crop config:', err);
    throw err;
  }
};
