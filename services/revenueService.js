const RevenueRequest = require('../models/RevenueRequest');
const CropConfig = require('../models/CropConfig');

const MSP = {
  wheat: 2150,
  rice: 1868,
  maize: 1870,
  cotton: 5550,
  sugarcane: 2900,
  groundnut: 5550
};

const estimateYieldPerHectare = (cropType, season, soilQuality) => {
  const base = { wheat: 3000, rice: 3500, maize: 4000, cotton: 800 };
  let y = base[cropType] || 2500;
  y *= 0.8 + 0.4 * (soilQuality || 0.5);
  if (season === 'Kharif') y *= 1.05;
  if (season === 'Rabi') y *= 0.98;
  if (season === 'Zaid') y *= 0.9;
  return Math.round(y);
};

exports.estimateYieldPerHectare = estimateYieldPerHectare;

exports.getMSPForCrop = async (cropType) => {
  try {
    const config = await CropConfig.findOne({ cropName: new RegExp(cropType, 'i') });
    if (config) return config.msp;
  } catch (err) {
    console.error('CropConfig lookup failed, using fallback:', err.message);
  }
  return MSP[cropType.toLowerCase()] || 2000;
};

exports.getMSPData = async () => {
  try {
    const configs = await CropConfig.find();
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
  const mspData = {};
  for (const [crop, price] of Object.entries(MSP)) {
    mspData[crop.charAt(0).toUpperCase() + crop.slice(1)] = price;
  }
  return mspData;
};

exports.calculateRevenue = async (fieldSizeHa, cropType, season, soilQuality) => {
  if (typeof fieldSizeHa !== 'number' || fieldSizeHa <= 0) {
    throw new Error('fieldSizeHa must be a positive number');
  }
  if (!cropType || typeof cropType !== 'string') {
    throw new Error('cropType required');
  }
  if (typeof soilQuality !== 'number' || soilQuality < 0 || soilQuality > 1) {
    throw new Error('soilQuality must be between 0 and 1');
  }

  const yieldPerHaKg = estimateYieldPerHectare(cropType, season, soilQuality);
  const totalYieldKg = yieldPerHaKg * fieldSizeHa;
  const mspPerQuintal = await this.getMSPForCrop(cropType);
  const mspPerKg = mspPerQuintal / 100;
  const revenueINR = Math.round(totalYieldKg * mspPerKg);

  return {
    cropType,
    fieldSizeHa,
    yieldPerHaKg,
    totalYieldKg,
    mspPerQuintal,
    revenueINR
  };
};

exports.saveRevenueRequest = async (data, farmerId, contractorId = null) => {
  try {
    const revenueRequest = new RevenueRequest({
      farmerId,
      contractorId,
      fieldSizeHa: data.fieldSizeHa,
      cropType: data.cropType,
      season: data.season,
      soilQuality: data.soilQuality,
      result: data.result || data
    });
    await revenueRequest.save();
    return revenueRequest;
  } catch (err) {
    console.error('Error saving revenue request:', err);
    throw err;
  }
};

exports.getRevenueHistory = async (farmerId) => {
  try {
    return await RevenueRequest.find({ farmerId }).sort({ createdAt: -1 }).populate('farmerId');
  } catch (err) {
    console.error('Error fetching revenue history:', err);
    return [];
  }
};

exports.getRevenueById = async (id) => {
  try {
    return await RevenueRequest.findById(id).populate('farmerId').populate('contractorId');
  } catch (err) {
    console.error('Error fetching revenue by id:', err);
    return null;
  }
};
