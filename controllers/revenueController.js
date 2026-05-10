const RevenueRequest = require('../models/RevenueRequest');

const MSP = {
  wheat: 2150,
  rice: 1868,
  maize: 1870,
  cotton: 5550,
  sugarcane: 2900,
  groundnut: 5550
};

function estimateYieldPerHectare(cropType, season, soilQuality) {
  const base = { wheat: 3000, rice: 3500, maize: 4000, cotton: 800 };
  let y = base[cropType] || 2500;
  y *= 0.8 + 0.4 * (soilQuality || 0.5);
  if (season === 'Kharif') y *= 1.05;
  if (season === 'Rabi') y *= 0.98;
  if (season === 'Zaid') y *= 0.9;
  return Math.round(y);
}

exports.getMSP = (req, res) => res.json(MSP);

exports.getMSPData = () => {
  const mspData = {};
  for (const [crop, price] of Object.entries(MSP)) {
    mspData[crop.charAt(0).toUpperCase() + crop.slice(1)] = price;
  }
  return mspData;
};

exports.calculate = async (req, res) => {
  try {
    const { fieldSizeHa, cropType, season, soilQuality, save = false } = req.body;
    if (typeof fieldSizeHa !== 'number' || fieldSizeHa <= 0) return res.status(400).json({ error: 'fieldSizeHa must be a positive number' });
    if (!cropType || typeof cropType !== 'string') return res.status(400).json({ error: 'cropType required' });
    if (typeof soilQuality !== 'number' || soilQuality < 0 || soilQuality > 1) return res.status(400).json({ error: 'soilQuality must be between 0 and 1' });

    const yieldPerHaKg = estimateYieldPerHectare(cropType, season, soilQuality);
    const totalYieldKg = yieldPerHaKg * fieldSizeHa;
    const mspPerQuintal = MSP[cropType.toLowerCase()] || 2000;
    const mspPerKg = mspPerQuintal / 100;
    const revenueINR = Math.round(totalYieldKg * mspPerKg);
    const result = { cropType, fieldSizeHa, yieldPerHaKg, totalYieldKg, mspPerQuintal, revenueINR };

    if (save) {
      const doc = await RevenueRequest.create({ fieldSizeHa, cropType, season, soilQuality, result });
      return res.status(201).json({ id: doc._id, result });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};