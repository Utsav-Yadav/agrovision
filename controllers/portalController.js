const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');

function validateNameBody(body) {
  if (!body || !body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return 'Name is required';
  }
  return null;
}

exports.createFarmer = async (req, res) => {
  const err = validateNameBody(req.body);
  if (err) return res.status(400).json({ error: err });
  try {
    const payload = Object.assign({}, req.body);
    if (payload.crops && typeof payload.crops === 'string') payload.crops = payload.crops.split(',').map(s => s.trim());
    const f = await Farmer.create(payload);
    res.status(201).json(f);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listFarmers = async (req, res) => {
  try {
    const { crop, minAcreage, page = 1, limit = 50, q } = req.query;
    const filter = {};
    if (crop) filter.crops = crop;
    if (minAcreage) filter.acreageHa = { $gte: Number(minAcreage) };
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { location: new RegExp(q, 'i') }];
    const skip = (Number(page) - 1) * Number(limit);
    const items = await Farmer.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Farmer.countDocuments(filter);
    res.json({ meta: { total, page: Number(page), limit: Number(limit) }, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createContractor = async (req, res) => {
  const err = validateNameBody(req.body);
  if (err) return res.status(400).json({ error: err });
  try {
    const payload = Object.assign({}, req.body);
    if (payload.crops && typeof payload.crops === 'string') payload.crops = payload.crops.split(',').map(s => s.trim());
    const c = await Contractor.create(payload);
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listContractors = async (req, res) => {
  try {
    const { crop, minAcreage, page = 1, limit = 50, q } = req.query;
    const filter = {};
    if (crop) filter.crops = crop;
    if (minAcreage) filter.requiredAcreageHa = { $gte: Number(minAcreage) };
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { region: new RegExp(q, 'i') }];
    const skip = (Number(page) - 1) * Number(limit);
    const items = await Contractor.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Contractor.countDocuments(filter);
    res.json({ meta: { total, page: Number(page), limit: Number(limit) }, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};